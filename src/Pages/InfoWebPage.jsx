import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Typography,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AboutUs from "../InfoWeb/AboutUs";
import TermsOfService from "../InfoWeb/TermofService";
import PrivacyPolicy from "../InfoWeb/PrivacyPolicy";
import { useNavigate } from "react-router-dom";

const InfoWebPage = () => {
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutUs />;
      case "terms":
        return <TermsOfService />;
      case "privacy":
        return <PrivacyPolicy />;
      default:
        return <AboutUs />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Tombol kembali di pojok kiri atas */}
      <Box sx={{ position: "absolute", top: 16, left: 16 }}>
        <IconButton onClick={() => navigate(-1)} color="primary">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Typography variant="h4" align="center" gutterBottom>
        Informasi Umum Rutee
      </Typography>

      <Box display="flex" justifyContent="center" my={4}>
        <ButtonGroup variant="outlined">
          <Button
            variant={activeTab === "about" ? "contained" : "outlined"}
            onClick={() => setActiveTab("about")}
          >
            Tentang Kami
          </Button>
          <Button
            variant={activeTab === "terms" ? "contained" : "outlined"}
            onClick={() => setActiveTab("terms")}
          >
            Syarat & Ketentuan
          </Button>
          <Button
            variant={activeTab === "privacy" ? "contained" : "outlined"}
            onClick={() => setActiveTab("privacy")}
          >
            Kebijakan Privasi
          </Button>
        </ButtonGroup>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {renderContent()}
    </Container>
  );
};

export default InfoWebPage;
