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
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function NavigationButton({ mode, setMode }) {
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
      active: true,
    },
    {
      label: "Hubungi Admin",
      path: "/contact-admin",
      icon: <ContactMailIcon />,
      active: true,
    },
    {
      label: "Rekomendasi Karir",
      path: "/career-recommendations",
      icon: <WorkIcon />,
      active: false,
    },
    {
      label: "Company",
      path: "/companies",
      icon: <BusinessIcon />,
      active: false,
    },
    { label: "Group", path: "/groups", icon: <GroupIcon />, active: false },
    {
      label: "Leaderboard",
      path: "/leaderboard",
      icon: <LeaderboardIcon />,
      active: false,
    },
    { label: "Logout", path: "/logout", icon: <LogoutIcon />, active: true },
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

  const handleToggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
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
          Login
        </Button>
      </Box>
    );
  }

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
            {menuItems.map(({ label, path, icon, active }, index) => {
              // Tombol Logout ditempatkan paling bawah, jadi kita akan sisipkan tombol Dark/Light sebelum Logout
              if (label === "Logout") {
                return (
                  <Box key={index}>
                    {/* Tombol Dark / Light */}
                    <ListItemButton onClick={handleToggleMode}>
                      <ListItemIcon>
                        {mode === "light" ? (
                          <Brightness4Icon />
                        ) : (
                          <Brightness7Icon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          mode === "light" ? "Mode Gelap" : "Mode Terang"
                        }
                      />
                    </ListItemButton>

                    {/* Tombol Logout */}
                    <ListItemButton onClick={() => handleNavigate(path)}>
                      <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </Box>
                );
              }

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
                  <ListItemText primary={label} />
                </ListItemButton>
              );

              return active ? (
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
