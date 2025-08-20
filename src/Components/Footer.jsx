import {
  Box,
  Typography,
  IconButton,
  Stack,
  Link,
  Button,
} from "@mui/material";
import { Instagram, Facebook, LinkedIn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "secondary.main",
        color: "text.secondary",
        py: 3,
        px: 4,
        mt: "auto",

        textAlign: "center",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" justifyContent="center" spacing={2} mb={1}>
        <IconButton
          component={Link}
          href="https://www.instagram.com/rutee.indonesia?igsh=cXgyYWdrbTBhdDZz"
          target="_blank"
          rel="noopener"
          sx={{ color: "primary.main" }}
        >
          <Instagram />
        </IconButton>

        <IconButton
          component={Link}
          href="https://www.linkedin.com/company/rutee/"
          target="_blank"
          rel="noopener"
          sx={{ color: "primary.main" }}
        >
          <LinkedIn />
        </IconButton>

        <IconButton
          component={Link}
          href="https://www.facebook.com/share/1BB8JszsDM/"
          target="_blank"
          rel="noopener"
          sx={{ color: "primary.main" }}
        >
          <Facebook />
        </IconButton>
      </Stack>

      {/* Tombol menuju halaman info */}
      <Button
        variant="text"
        size="small"
        onClick={() => navigate("/infoweb")}
        sx={{ mt: 1, color: "primary.main", textTransform: "none" }}
      >
        Tentang Kami & Kebijakan
      </Button>

      <Typography variant="body2" sx={{ mt: 1 }}>
        © {new Date().getFullYear()} RUTEE — Ruang Temukan Eksistensi
      </Typography>
    </Box>
  );
};

export default Footer;
