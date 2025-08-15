import React from "react";
import { AppBar, Toolbar, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import NavigationButton from "./NavigationButton";
import { useAuth } from "../Context/AuthContext"; // pastikan path sesuai
import Logo from "../../public/Rute-Logo.png"; // pastikan path sesuai

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Ambil user dari context

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  return (
    <AppBar
      position="static"
      color="background"
      elevation={1}
      sx={{
        bgcolor: "background.default",
        borderBottom: "2px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, sm: 3 },
        }}
      >
        {/* Kiri: Logo */}
        <Box
          onClick={handleLogoClick}
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Rutee Logo"
            sx={{ height: 36, width: 36 }}
          />
        </Box>

        {/* Tengah: Kosong / Placeholder */}
        <Box sx={{ flex: 1 }} />

        {/* Kanan: Search + Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleSearchClick}
            sx={{ color: "text.primary" }}
          >
            <SearchIcon />
          </IconButton>

          {/* Tampilkan NavigationButton hanya jika user login */}
          {user && <NavigationButton />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
