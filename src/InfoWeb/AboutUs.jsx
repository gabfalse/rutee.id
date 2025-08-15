import React from "react";
import { Box, Typography, Container } from "@mui/material";

const AboutUs = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Tentang Rutee
      </Typography>
      <Typography paragraph>
        Rutee adalah platform pengembangan diri yang dirancang untuk membantu
        individu memahami diri mereka lebih dalam melalui tes kepribadian,
        refleksi, dan konten eksklusif. Kami percaya bahwa setiap orang berhak
        memiliki akses ke alat yang membantu mereka tumbuh secara personal,
        emosional, dan sosial.
      </Typography>
      <Typography paragraph>
        Berdiri sejak 2025, Rutee memadukan teknologi dengan psikologi populer
        untuk menciptakan pengalaman interaktif yang menarik, mudah diakses, dan
        bermakna. Kami menyediakan berbagai fitur mulai dari tes kepribadian,
        hasil visual yang mendalam, hingga fitur premium untuk pemahaman diri
        lanjutan.
      </Typography>
      <Typography paragraph>
        Misi kami adalah menjadi teman terpercaya dalam perjalanan
        self-awareness pengguna, dengan menyediakan pengalaman yang otentik,
        aman, dan berdampak.
      </Typography>
    </Container>
  );
};

export default AboutUs;
