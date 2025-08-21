import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import CreateIcon from "@mui/icons-material/Create";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useNotification } from "../Context/NotificationContext"; // 🔥 pakai context

export default function FeatureButton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const { user } = useAuth();
  const { unread } = useNotification(); // 🔥 ambil unread count
  const user_id = user?.id;

  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(window.scrollY);

  // auto-hide navbar
  useEffect(() => {
    let timer;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll) setShow(false);
      else setShow(true);
      setLastScroll(currentScroll);

      clearTimeout(timer);
      timer = setTimeout(() => setShow(true), 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const features = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    {
      label: "Connection",
      icon: (
        <Badge color="error" variant="dot" invisible={unread.connection === 0}>
          <GroupIcon />
        </Badge>
      ),
      path: user_id ? `/connections/${user_id}` : "/login",
    },
    { label: "Write Article", icon: <CreateIcon />, path: "/articles/new" },
    {
      label: "Notification",
      icon: (
        <Badge
          color="error"
          badgeContent={unread.all}
          invisible={unread.all === 0}
        >
          <NotificationsIcon />
        </Badge>
      ),
      path: "/notifications",
    },
    {
      label: "Chat",
      icon: (
        <Badge color="error" variant="dot" invisible={unread.chat === 0}>
          <ChatIcon />
        </Badge>
      ),
      path: "/chats",
    },
  ];

  const handleNavigate = (path) => {
    if (path === "/") navigate(path, { replace: true });
    else navigate(path);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        py: 1,
        bgcolor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        transform: show ? "translateY(0)" : "translateY(100px)",
        transition: "transform 0.3s ease",
        zIndex: 150,
      }}
    >
      {features.map((feature, index) => (
        <Box
          key={index}
          onClick={() => handleNavigate(feature.path)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            color: theme.palette.text.primary,
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          <IconButton color="primary">{feature.icon}</IconButton>
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            {feature.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
