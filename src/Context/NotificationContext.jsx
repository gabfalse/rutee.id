// src/Context/NotificationContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://rutee.id/dapur/notification/get-notifications.php",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

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
