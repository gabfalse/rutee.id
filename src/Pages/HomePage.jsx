import React from "react";
import Navbar from "../Components/Navbar";
import { Box } from "@mui/material";
import Footer from "../Components/Footer";
import PersonalityCarousel from "../Components/PersonalityCarousel";

function HomePage() {
  return (
    <Box>
      <Navbar />
      <PersonalityCarousel />
      <Footer />
    </Box>
  );
}

export default HomePage;
