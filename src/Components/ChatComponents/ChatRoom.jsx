import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

// Fungsi helper time ago
const timeAgo = (timestamp) => {
  if (!timestamp) return "";
  const messageTime = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - messageTime) / 1000);

  if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
};

const ChatRoom = ({ initialMessages = [], roomId, onSendExternal }) => {
  const { user_id, avatar: userAvatar } = useAuth(); // ambil avatar user
  const theme = useTheme();
  const navigate = useNavigate();
  const scrollRef = useRef();
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");

  // Sync messages saat parent update
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Scroll otomatis
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://rutee.id/dapur/chat/send-message.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          room_id: roomId,
          message: text.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newMessage = {
          id: data.message_id,
          sender_id: data.sender_id,
          message: data.content,
          created_at: data.created_at,
          sender_name: "You",
          sender_avatar: userAvatar || "/default-avatar.png", // avatar user dinamis
        };

        // Kirim ke parent untuk update state global
        if (onSendExternal) onSendExternal(newMessage);
        setText(""); // Clear input
      } else {
        console.error("Gagal mengirim pesan:", data.message);
      }
    } catch (err) {
      console.error("Error mengirim pesan:", err);
    }
  };

  const handleProfileClick = (sender_id) => {
    if (sender_id) navigate(`/profile/${sender_id}`);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
    >
      {/* Chat list */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          p: 2,
          bgcolor: "background.default",
        }}
      >
        {messages
          .filter((msg) => msg && msg.sender_id)
          .map((msg) => {
            const isOwn = msg.sender_id === user_id;
            const senderName = msg.sender_name || "Unknown";
            const senderAvatar = msg.sender_avatar || "/default-avatar.png";
            const textMsg = msg.message || "";
            const time = timeAgo(msg.created_at);

            return (
              <Stack
                key={msg.id}
                direction={isOwn ? "row-reverse" : "row"}
                spacing={1}
                sx={{ mb: 1, alignItems: "flex-start" }}
              >
                <Avatar
                  src={senderAvatar}
                  alt={senderName}
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleProfileClick(msg.sender_id)}
                />
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: "70%",
                    bgcolor: isOwn
                      ? theme.palette.secondary.main
                      : theme.palette.primary.dark,
                    color: "white",
                    wordBreak: "break-word",
                  }}
                >
                  {!isOwn && (
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ mb: 0.5, cursor: "pointer" }}
                      onClick={() => handleProfileClick(msg.sender_id)}
                    >
                      {senderName}
                    </Typography>
                  )}
                  <Typography variant="body1">{textMsg}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {time}
                  </Typography>
                </Box>
              </Stack>
            );
          })}
      </Box>

      {/* Chat input */}
      <Paper
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #ddd",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatRoom;
