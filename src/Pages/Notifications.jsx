import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
  Button,
  Paper,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FeatureButton from "../Components/FeatureButton";

const notificationText = {
  follow: "Invite you to connect",

  like: "Liked Your Content",
  comment: "Commented",
  connection: "Now Connected",
  chat: "Sent a message",
};

const getNotificationLink = (notification) => {
  switch (notification.type) {
    case "follow":
    case "connection":
      return notification.sender_id
        ? `/connections/${notification.sender_id}`
        : "/connections";
    case "chat":
      return "/chats";
    case "like":
    case "comment":
      return notification.post_id ? `/articles/${notification.post_id}` : "#";
    default:
      return "#";
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const latestNotificationId = useRef(null);

  // Fetch notifikasi
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://rutee.id/dapur/notification/get-notifications.php",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const newNotifications = res.data.notifications;
        setNotifications(newNotifications);

        // tampilkan push notification hanya untuk notifikasi terbaru
        const newest = newNotifications[0]; // asumsikan array sorted terbaru di awal
        if (
          newest &&
          newest.id !== latestNotificationId.current &&
          !newest.is_read
        ) {
          latestNotificationId.current = newest.id;

          if (Notification.permission === "granted") {
            new Notification("Rutee's Notification", {
              body: `${newest.sender_name || "Someone"} ${
                notificationText[newest.type]
              }`,
              icon: newest.sender_avatar || "/default-avatar.png",
            });
          }
        }
      }
    } catch (err) {
      console.error("Error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Tandai semua notifikasi terbaca
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    try {
      await axios.post(
        "https://rutee.id/dapur/notification/mark-read.php",
        { ids: unreadIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error");
    }
  };

  // Tandai notifikasi tertentu terbaca
  const markNotificationAsRead = async (id) => {
    try {
      await axios.post(
        "https://rutee.id/dapur/notification/mark-read.php",
        { ids: [id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Error");
    }
  };

  // Minta izin notifikasi browser dengan styling custom
  const requestNotificationPermission = () => {
    if (Notification.permission === "default") {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.bottom = "20px";
      container.style.right = "20px";
      container.style.background = "#1976d2";
      container.style.color = "#fff";
      container.style.padding = "12px 16px";
      container.style.borderRadius = "12px";
      container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      container.style.cursor = "pointer";
      container.style.zIndex = 9999;
      container.innerText = "Klik sini untuk mengaktifkan notifikasi";

      container.onclick = () => {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            alert("Notification's Activated");
          }
          document.body.removeChild(container);
        });
      };

      document.body.appendChild(container);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Box>
      <Paper
        elevation={4}
        sx={{
          width: { xs: "100%", sm: 400, md: 500 },
          maxHeight: "80vh",
          overflowY: "auto",
          p: 2,
          borderRadius: 3,
          mx: "auto",
          mt: { xs: 1, sm: 3 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Notification
          </Typography>
          <Badge color="error" badgeContent={unreadCount} />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mb: 2 }}
          justifyContent="space-between"
        >
          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={fetchNotifications}
          >
            Refresh
          </Button>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={markAllAsRead}
          >
            Mark All As Read
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center" }}
          >
            No notification yet
          </Typography>
        ) : (
          <Stack spacing={1}>
            {notifications.map((n) => (
              <Box
                key={n.id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: n.is_read ? "background.paper" : "action.hover",
                  transition: "background-color 0.3s",
                  "&:hover": { bgcolor: "action.selected" },
                  cursor: "pointer",
                }}
                onClick={async () => {
                  if (!n.is_read) await markNotificationAsRead(n.id);
                  navigate(getNotificationLink(n));
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={n.is_read}
                    overlap="circular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <Avatar
                      src={n.sender_avatar || "/default-avatar.png"}
                      alt={n.sender_name || "Seseorang"}
                      sx={{ width: 40, height: 40 }}
                    />
                  </Badge>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: n.is_read ? "regular" : "bold",
                        lineHeight: 1.4,
                      }}
                    >
                      {n.sender_name || "Someone"}{" "}
                      {notificationText[n.type] || "Sending Notification"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {new Date(n.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
      <FeatureButton />
    </Box>
  );
};

export default Notifications;
