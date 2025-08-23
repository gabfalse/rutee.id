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
import GoogleLoginButton from "../Components/GoogleLoginButton";
import API from "../Config/API"; // pastikan import config API

export default function Login() {
  const { user, login, isAuthenticated, loading, error } = useAuth();
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    setSuccess("");
    try {
      // login pakai config API
      const loggedInUser = await login(form, API.LOGIN);
      if (loggedInUser) {
        const name =
          loggedInUser.display_name || loggedInUser.username || "Pengguna";
        setSuccess(`Selamat datang, ${name}!`);
      }
    } catch (err) {
      console.error(err);
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
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          mb={1}
          fontWeight={700}
          align="center"
          color="primary"
        >
          Login
        </Typography>

        <Collapse in={!!error}>
          {error && (
            <Alert severity="error" sx={{ mb: 1 }} variant="filled">
              {error}
            </Alert>
          )}
        </Collapse>

        <Collapse in={!!success}>
          {success && (
            <Alert severity="success" sx={{ mb: 1 }} variant="filled">
              {success}
            </Alert>
          )}
        </Collapse>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username or Email"
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
            {loading ? "Logging In..." : "Login"}
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mt: 1, mb: 1 }}
        >
          Or Log In with
        </Typography>

        <Box display="flex" justifyContent="center" mb={1}>
          <GoogleLoginButton />
        </Box>

        <Stack direction="row" justifyContent="center" spacing={1}>
          <Typography variant="body2">Don't have an account?</Typography>
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            variant="body2"
            color="primary"
            fontWeight={500}
          >
            Sign Up here
          </Link>
        </Stack>
      </Paper>
    </Box>
  );
}
