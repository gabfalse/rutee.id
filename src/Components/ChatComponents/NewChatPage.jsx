// src/pages/NewChatPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
  Paper,
  Autocomplete,
  Stack,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import API from "../../Config/API";

const RECENT_SEARCH_KEY = "recent_user_searches";

export default function NewChatPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    setToken(authToken);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCH_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const searchUsers = async (q) => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API.USER_SEARCH, {
        params: { q },
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Gagal mengambil data user");
      setResults([]);
    }
    setLoading(false);
  };

  const handleSearchClick = () => {
    searchUsers(query.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchUsers(query.trim());
    }
  };

  const handleStartChat = async (otherUser) => {
    if (!otherUser) return;

    try {
      const formData = new FormData();
      formData.append("target_id", otherUser.id);

      const res = await axios.post(API.CHAT_CREATE_ROOM, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // simpan ke recent search (max 5)
        setRecentSearches((prev) => {
          const filtered = prev.filter((u) => u.id !== otherUser.id);
          return [otherUser, ...filtered].slice(0, 5);
        });

        // Kirim room baru ke ChatsPage
        const newRoom = {
          id: res.data.room_id,
          other_user: otherUser,
          lastMessageObj: null,
          lastMessageText: "",
        };

        navigate("/chats", { state: { newRoom } });
      } else {
        setError(res.data.message || "Gagal membuat chat");
      }
    } catch (err) {
      console.error("Create room failed:", err);
      setError("Gagal membuat chat baru");
    }
  };

  const handleRemoveRecent = (e, id) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 700,
        mx: "auto",
        mt: { xs: 3, sm: 5 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3} align="center">
          Mulai Chat Baru
        </Typography>

        <Autocomplete
          freeSolo
          options={results}
          getOptionLabel={(option) => option.username || ""}
          loading={loading}
          onInputChange={(e, value, reason) => {
            if (reason === "input") setQuery(value);
          }}
          onChange={(e, value) => {
            if (value) handleStartChat(value);
          }}
          noOptionsText="Tidak ada user ditemukan"
          renderOption={(props, option) => (
            <li
              {...props}
              key={option.id}
              style={{ display: "flex", alignItems: "center" }}
            >
              {option.profile_image_url ? (
                <img
                  src={option.profile_image_url}
                  alt={option.username}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    marginRight: 8,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    marginRight: 8,
                    backgroundColor: "#ccc",
                  }}
                />
              )}
              <div>
                <div style={{ fontWeight: "bold" }}>{option.username}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {option.name || "-"}
                </div>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cari username atau nama"
              fullWidth
              onKeyDown={handleKeyDown}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSearchClick}
                      sx={{ mr: 1 }}
                      startIcon={<SearchIcon />}
                    >
                      Cari
                    </Button>
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{ mb: 3 }}
        />

        {error && (
          <Typography color="error" mb={2} align="center">
            {error}
          </Typography>
        )}

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            Search History
          </Typography>
          {recentSearches.length === 0 ? (
            <Typography color="text.secondary" fontStyle="italic">
              Nothing Yet
            </Typography>
          ) : (
            recentSearches.map((u, index) => (
              <ListItem
                key={`${u.id ?? "unknown"}-${index}`}
                sx={{
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => handleStartChat(u)}
                disablePadding
              >
                <ListItemText
                  sx={{ px: 2, py: 1 }}
                  primary={u.username}
                  secondary={u.name || "—"}
                />
                <IconButton
                  edge="end"
                  aria-label="hapus"
                  onClick={(e) => handleRemoveRecent(e, u.id)}
                >
                  <ClearIcon />
                </IconButton>
              </ListItem>
            ))
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
