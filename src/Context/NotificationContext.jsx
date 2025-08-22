// src/Context/NotificationContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import API from "../Config/API";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, token }) => {
  const [notifications, setNotifications] = useState([]);

  // ===== Axios instance =====
  const axiosAuth = axios.create({
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  // ===== Fetch notifications =====
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axiosAuth.get(API.NOTIFICATION_LIST);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("❌ Gagal fetch notifications:", err.message);
    }
  }, [token]);

  // ===== Auto fetch every 20s =====
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // ===== Unread counts =====
  const unread = {
    connection: notifications.filter(
      (n) => !n.is_read && (n.type === "follow" || n.type === "connection")
    ).length,
    chat: notifications.filter((n) => !n.is_read && n.type === "chat").length,
    all: notifications.filter((n) => !n.is_read).length,
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unread, fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
