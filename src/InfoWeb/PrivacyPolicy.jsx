import React from "react";
import { Box, Typography, Container } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Kebijakan Privasi
      </Typography>
      <Typography paragraph>
        Privasi Anda penting bagi kami. Dokumen ini menjelaskan bagaimana kami
        mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat
        menggunakan Rutee.
      </Typography>

      <Typography variant="h6">1. Informasi yang Kami Kumpulkan</Typography>
      <Typography paragraph>
        Kami mengumpulkan informasi seperti email, nama pengguna, jawaban tes,
        dan aktivitas akun untuk meningkatkan pengalaman pengguna Anda di Rutee.
      </Typography>

      <Typography variant="h6">2. Penggunaan Informasi</Typography>
      <Typography paragraph>
        Data digunakan untuk personalisasi hasil, analitik internal, dan
        peningkatan layanan. Kami tidak akan menjual atau membagikan data Anda
        kepada pihak ketiga tanpa izin Anda.
      </Typography>

      <Typography variant="h6">3. Keamanan Data</Typography>
      <Typography paragraph>
        Kami menggunakan teknologi enkripsi dan standar keamanan terkini untuk
        melindungi data Anda dari akses tidak sah.
      </Typography>

      <Typography variant="h6">4. Hak Anda</Typography>
      <Typography paragraph>
        Anda berhak meminta akses, pembaruan, atau penghapusan data Anda.
        Hubungi kami melalui email jika Anda ingin mengajukan permintaan ini.
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;
