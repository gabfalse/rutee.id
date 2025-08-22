import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import API from "../Config/API"; // pakai config API

// Fungsi waktu lokal WIB (untuk tampilan, backend yang menentukan waktu resmi)
const getWIBDateTime = () => {
  const now = new Date();
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
};

const ContactAdmin = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [userId] = useState(user?.id || `guest-${Date.now()}`);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const chatBoxRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !name.trim()) {
      setError("Nama dan pesan wajib diisi.");
      return;
    }

    const newMsg = { sender: "user", text: currentMessage };
    setMessages((prev) => [...prev, newMsg]);
    setError("");

    try {
      const res = await axios.post(API.ADMIN_SEND_TELEGRAM, {
        name,
        user_id: userId,
        message: currentMessage,
        datetime: getWIBDateTime(),
        email: user?.email || "",
      });

      if (res.data.success) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: "admin",
              text: "Pesan kamu sudah diterima! Kami akan menghubungi lewat email jika diperlukan. 🙏",
            },
          ]);
        }, 800);
        setSent(true);
      } else {
        setError(res.data.error || "Gagal mengirim pesan.");
      }
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      setError(
        err.response?.data?.error ||
          "Terjadi kesalahan jaringan. Cek koneksi atau CORS."
      );
    }

    setCurrentMessage("");
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 420,
        mx: "auto",
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: 500,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <ChatIcon />
        <Typography variant="h6" fontWeight="bold">
          Hubungi Admin
        </Typography>
      </Box>

      <Divider />

      {/* Nama jika belum login */}
      {!user?.name && (
        <Box sx={{ px: 2, py: 1 }}>
          <TextField
            label="Nama"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
        </Box>
      )}

      {/* Chat area */}
      <Box
        ref={chatBoxRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 2,
          py: 1,
          bgcolor: "grey.100",
        }}
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                bgcolor:
                  msg.sender === "user" ? "primary.dark" : "secondary.main",
                color: msg.sender === "user" ? "#fff" : "#000",
                px: 2,
                py: 1,
                borderRadius: 3,
                maxWidth: "75%",
                boxShadow: 1,
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Input pesan */}
      <Divider />
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          bgcolor: "background.paper",
        }}
      >
        <TextField
          fullWidth
          placeholder="Tulis pesan..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          size="small"
          variant="outlined"
        />
        <IconButton type="submit" color="primary" sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>

      {sent && (
        <Alert severity="success" sx={{ m: 1 }}>
          Terima kasih! Pesan sudah terkirim.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ m: 1 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default ContactAdmin;
