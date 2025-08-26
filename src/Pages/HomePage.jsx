import React from "react";
import { Box, CircularProgress, Typography, Container } from "@mui/material";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PersonalityCarousel from "../Components/PersonalityCarousel";
import ArticleListPage from "./ArticleListPage";
import { useAuth } from "../Context/AuthContext";
import FeatureButton from "../Components/FeatureButton";

function HomePage() {
  const { user, personalityResult, loading } = useAuth();

  // loading data user
  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
        <Typography mt={2} color="text.secondary" variant="body1">
          Memuat data...
        </Typography>
      </Box>
    );
  }

  // cek apakah sudah ada personality type
  const hasPersonality = Boolean(personalityResult?.type);

  return (
    <Box sx={{ backgroundColor: "secondary.main", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        {/* Tampilkan semua artikel untuk semua orang */}
        <ArticleListPage userId={user?.id} />

        {/* Kalau user sudah login tapi belum ada personality, tampilkan carousel */}
        {user && !hasPersonality && (
          <Box sx={{ mt: 4 }}>
            <PersonalityCarousel />
          </Box>
        )}
      </Container>
      <FeatureButton />
      <Footer />
    </Box>
  );
}

export default HomePage;
