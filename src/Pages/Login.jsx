import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Stack,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Collapse,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
  const { user, login, isAuthenticated, loading, error } = useAuth();
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect otomatis jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      const name = user?.display_name || user?.username || "Pengguna";
      setSuccess(`Selamat datang kembali, ${name}!`);
      const timer = setTimeout(() => navigate("/"), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(""); // Reset dulu success sebelum login
    const loggedInUser = await login(form);
    if (loggedInUser) {
      // Gunakan user hasil login langsung, jangan dari context yang mungkin belum updated
      const name =
        loggedInUser.display_name || loggedInUser.username || "Pengguna";
      setSuccess(`Selamat datang, ${name}!`);
    }
  };

  return (
    <Box maxWidth={420} mx="auto" mt={8} px={2}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="h5"
          mb={3}
          fontWeight={700}
          align="center"
          color="primary"
        >
          Login ke Akun Anda
        </Typography>

        {/* Alert Error */}
        <Collapse in={!!error}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} variant="filled">
              {error}
            </Alert>
          )}
        </Collapse>

        {/* Alert Success */}
        <Collapse in={!!success}>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} variant="filled">
              {success}
            </Alert>
          )}
        </Collapse>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username atau Email"
            name="usernameOrEmail"
            value={form.usernameOrEmail}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            autoComplete="username"
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.4, fontWeight: 600 }}
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {loading ? "Memproses..." : "Login"}
          </Button>
        </form>

        <Stack mt={3} direction="row" justifyContent="center" spacing={1}>
          <Typography variant="body2">Belum punya akun?</Typography>
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            variant="body2"
            color="primary"
            fontWeight={500}
          >
            Daftar di sini
          </Link>
        </Stack>
      </Paper>
    </Box>
  );
}
