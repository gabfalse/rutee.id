import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { Business } from "@mui/icons-material";

export default function NavigationButton({ mode, setMode }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ================== Fetch profile untuk avatar ==================
  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `https://rutee.id/dapur/profile/get-profile.php?user_id=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.profile) setProfileData(res.data.profile);
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user?.id]);

  const menuItems = [
    {
      label: "Profile",
      path: `/profile/${user?.id}`,
      icon: <AccountCircleIcon />,
      active: true,
    },
    {
      label: "Contact Admin",
      path: "/contact-admin",
      icon: <ContactMailIcon />,
      active: true,
    },
    {
      label: "Career Recommendations",
      path: "/careers",
      icon: <WorkIcon />,
      active: true,
    },
    {
      label: "Jobs",
      path: "/jobs",
      icon: <Business />,
      active: true,
    },
    // { label: "Group", path: "/groups", icon: <GroupIcon />, active: false },
    // {
    //   label: "Leaderboard",
    //   path: "/leaderboard",
    //   icon: <LeaderboardIcon />,
    //   active: false,
    // },
    { label: "Sign Out", path: "/logout", icon: <LogoutIcon />, active: true },
  ];

  const toggleDrawer = (state) => () => setOpen(state);

  const handleNavigate = (path) => {
    setOpen(false);
    if (path === "/logout") {
      logout();
      navigate("/login");
      return;
    }
    navigate(path);
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
          size={isMobile ? "medium" : "large"}
        >
          Sign In
        </Button>
      </Box>
    );
  }

  // Fallback avatar function
  const getAvatarSrc = () => {
    return (
      profileData?.profile_image_url ||
      user?.profile_url ||
      "https://rutee.id/images/default-avatar.png"
    );
  };

  const getAvatarFallback = () => {
    return !profileData?.profile_image_url && !user?.profile_url
      ? user.display_name?.[0] || user.username?.[0] || "?"
      : null;
  };

  return (
    <>
      <Tooltip title="Open Navigation Menu" arrow>
        <IconButton
          color="primary"
          onClick={toggleDrawer(true)}
          size="large"
          sx={{
            ml: 1,
            zIndex: 100,
            borderRadius: "50%",
            transition: "background-color 0.3s ease",
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
        >
          {loading ? (
            <CircularProgress size={40} />
          ) : (
            <Avatar
              src={getAvatarSrc()}
              alt={user.display_name || user.username}
              sx={{ width: 48, height: 48 }}
            >
              {getAvatarFallback()}
            </Avatar>
          )}
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: isMobile ? "80vw" : 280,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[6],
            height: "100%",
            overflowY: "auto",
          },
        }}
      >
        <Box
          role="presentation"
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Header */}
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
              src={getAvatarSrc()}
              alt={user.display_name || user.username}
              sx={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40 }}
            >
              {getAvatarFallback()}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant={isMobile ? "body2" : "subtitle1"} noWrap>
                {user.display_name || user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>

          {/* List Menu */}
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map(({ label, path, icon, active }, index) => {
              const button = (
                <ListItemButton
                  key={index}
                  onClick={() => active && handleNavigate(path)}
                  disabled={!active}
                  sx={{
                    "&.Mui-disabled": { opacity: 0.5, cursor: "not-allowed" },
                    "&:hover": active
                      ? { bgcolor: theme.palette.action.hover }
                      : {},
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ noWrap: true }}
                  />
                </ListItemButton>
              );

              return isMobile || active ? (
                button
              ) : (
                <Tooltip key={index} title="Coming soon" arrow placement="left">
                  <span>{button}</span>
                </Tooltip>
              );
            })}
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
