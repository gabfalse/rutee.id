import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PaymentIcon from "@mui/icons-material/Payment";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/Chat";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function NavigationButton() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    {
      label: "Profile",
      path: `/profile/${user.id}`,
      icon: <AccountCircleIcon />,
    },
    {
      label: "Rekomendasi Karir",
      path: "/career-recommendations",
      icon: <WorkIcon />,
    },
    {
      label: "Hubungi Admin",
      path: "/contact-admin",
      icon: <ContactMailIcon />,
    },
    { label: "Konten Berbayar", path: "/paid-content", icon: <PaymentIcon /> },
    { label: "Company", path: "/companies", icon: <BusinessIcon /> },
    { label: "Group", path: "/groups", icon: <GroupIcon /> },
    { label: "Chat", path: "/chat", icon: <ChatIcon /> },
    { label: "Forum", path: "/forum", icon: <ForumIcon /> },
    {
      label: "Notifikasi",
      path: "/notifications",
      icon: <NotificationsIcon />,
    },
    { label: "Leaderboard", path: "/leaderboard", icon: <LeaderboardIcon /> },
    { label: "Logout", path: "/logout", icon: <LogoutIcon /> },
  ];

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const handleNavigate = (path) => {
    setOpen(false);
    if (path === "/logout") {
      logout();
      navigate("/login");
      return;
    }
    navigate(path);
  };

  // Kalau belum login
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
          size={isMobile ? "medium" : "large"}
        >
          Login
        </Button>
      </Box>
    );
  }

  // Kalau sudah login
  return (
    <>
      <Tooltip title="Open Navigation Menu" arrow>
        <IconButton
          color="primary"
          onClick={toggleDrawer(true)}
          size="large"
          aria-label="open navigation menu"
          sx={{
            ml: 1,
            borderRadius: "50%",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Avatar
            src={user.profile_image_url || undefined}
            alt={user.display_name || user.username}
            sx={{ width: 48, height: 48 }}
          >
            {!user.profile_image_url &&
              (user.display_name?.[0] || user.username?.[0] || "?")}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: isMobile ? "75vw" : 280,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <Box
          role="presentation"
          onKeyDown={(event) => {
            if (event.key === "Tab" || event.key === "Shift") return;
            setOpen(false);
          }}
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              src={user.profile_image_url || undefined}
              alt={user.display_name || user.username}
              sx={{ width: 40, height: 40 }}
            >
              {!user.profile_image_url &&
                (user.display_name?.[0] || user.username?.[0] || "?")}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" noWrap>
                {user.display_name || user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>

          {/* List Menu */}
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map(({ label, path, icon }, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleNavigate(path)}
                sx={{
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          {/* Footer */}
          <Box
            sx={{
              px: 3,
              py: 2,
              textAlign: "center",
              fontSize: 12,
              color: theme.palette.text.secondary,
            }}
          >
            © {new Date().getFullYear()} Rutee.id
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
