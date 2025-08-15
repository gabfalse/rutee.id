import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  Link,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function RegisterWithOtp() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const USERNAME_REGEX = /^[a-z0-9._-]{6,}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validasi username
    if (!USERNAME_REGEX.test(form.username.trim())) {
      setError(
        "Username minimal 6 karakter, hanya huruf kecil, angka, dan simbol _ - ."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://rutee.id/dapur/auth-user/register-send-otp.php",
        {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim(),
        }
      );
      setSuccess(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1️⃣ Verifikasi OTP
      const res = await axios.post(
        "https://rutee.id/dapur/auth-user/verify-otp.php",
        {
          username: form.username.trim(),
          email: form.email.trim(),
          otp: form.otp.trim(),
        }
      );
      setSuccess(res.data.message);

      // 2️⃣ Login otomatis setelah OTP sukses
      const loginRes = await axios.post(
        "https://rutee.id/dapur/auth-user/login.php",
        {
          usernameOrEmail: form.username.trim(),
          password: form.password,
        }
      );

      // Simpan token & user ke localStorage
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      // Redirect ke dashboard
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.error || "OTP tidak valid");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "https://rutee.id/dapur/auth-user/resend-otp.php",
        {
          username: form.username.trim(),
          email: form.email.trim(),
        }
      );
      setSuccess(res.data.message || "OTP baru sudah dikirim ke email Anda");
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengirim ulang OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6} px={2}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" mb={3} fontWeight={700} align="center">
          {step === 1 ? "Register" : "Verify OTP"}
        </Typography>

        {step === 1 && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 2 }}
            textAlign="center"
          >
            Dengan membuat akun, Anda menyetujui{" "}
            <Link component={RouterLink} to="/webinfo" underline="hover">
              Syarat dan Ketentuan
            </Link>
            .
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {step === 1 && (
          <>
            <form onSubmit={handleRegister}>
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Mengirim OTP..." : "Register & Get OTP"}
              </Button>
            </form>

            <Stack mt={3} direction="row" justifyContent="center" spacing={1}>
              <Typography variant="body2">Sudah punya akun?</Typography>
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                variant="body2"
              >
                Masuk di sini
              </Link>
            </Stack>
          </>
        )}

        {step === 2 && (
          <>
            <form onSubmit={handleVerifyOtp}>
              <Typography mb={1} textAlign="center">
                Masukkan kode OTP yang dikirim ke email{" "}
                <strong>{form.email}</strong>
              </Typography>
              <TextField
                label="OTP Code"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Memverifikasi..." : "Verify OTP & Login"}
              </Button>
            </form>

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleResendOtp}
              disabled={loading}
            >
              Kirim Ulang OTP
            </Button>

            <Button
              variant="text"
              color="secondary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => {
                setStep(1);
                setError("");
                setSuccess("");
              }}
            >
              Kembali ke Registrasi
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
