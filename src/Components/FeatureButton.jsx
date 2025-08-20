// src/components/FeatureButton.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import CreateIcon from "@mui/icons-material/Create";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // ⬅️ ambil AuthContext

export default function FeatureButton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const { user_id } = useAuth(); // ⬅️ ambil user_id dari context

  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(window.scrollY);

  // Detect scroll for auto-hide
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
    { label: "Beranda", icon: <HomeIcon />, path: "/" },
    {
      label: "Koneksi",
      icon: <GroupIcon />,
      path: user_id ? `/connections/${user_id}` : "/connections", // ⬅️ fallback kalau belum login
    },
    { label: "Tulis Artikel", icon: <CreateIcon />, path: "/articles/new" },
    {
      label: "Notifikasi",
      icon: <NotificationsIcon />,
      path: "/notifications",
    },
    { label: "Chat", icon: <ChatIcon />, path: "/chats" },
  ];

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
          onClick={() => navigate(feature.path)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            color: theme.palette.text.primary,
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          <IconButton sx={{ color: "primary" }}>{feature.icon}</IconButton>
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            {feature.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
