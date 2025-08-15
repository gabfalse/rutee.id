import React from "react";
import { Box, Typography, Container } from "@mui/material";

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Syarat dan Ketentuan
      </Typography>
      <Typography paragraph>
        Dengan menggunakan Rutee, Anda menyetujui untuk mematuhi semua syarat
        dan ketentuan berikut:
      </Typography>
      <Typography variant="h6">1. Penggunaan Layanan</Typography>
      <Typography paragraph>
        Rutee menyediakan layanan pengujian kepribadian dan konten reflektif.
        Anda setuju untuk menggunakan layanan ini hanya untuk keperluan pribadi
        dan tidak menyalahgunakannya dalam bentuk apa pun.
      </Typography>

      <Typography variant="h6">2. Akun dan Keamanan</Typography>
      <Typography paragraph>
        Anda bertanggung jawab atas kerahasiaan akun Anda. Rutee tidak
        bertanggung jawab atas kerugian akibat penggunaan tidak sah terhadap
        akun Anda.
      </Typography>

      <Typography variant="h6">3. Konten Berbayar</Typography>
      <Typography paragraph>
        Beberapa fitur di Rutee tersedia dalam bentuk konten premium. Pembayaran
        yang telah dilakukan tidak dapat dikembalikan kecuali ada kesalahan
        teknis dari pihak kami.
      </Typography>

      <Typography variant="h6">4. Perubahan Syarat</Typography>
      <Typography paragraph>
        Kami dapat mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan
        akan diumumkan di situs web dan berlaku segera setelah dipublikasikan.
      </Typography>
    </Container>
  );
};

export default TermsOfService;
