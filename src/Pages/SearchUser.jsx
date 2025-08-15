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

const RECENT_SEARCH_KEY = "recent_user_searches";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigate = useNavigate();

  // Ambil current user ID dari localStorage (pastikan 'authUser' berisi JSON string user info)
  useEffect(() => {
    const authUserStr = localStorage.getItem("authUser");
    if (authUserStr) {
      try {
        const user = JSON.parse(authUserStr);
        setCurrentUserId(user.id);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, []);

  // Load recent searches dari localStorage, filter user sendiri supaya gak muncul
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCH_KEY);
    if (saved) {
      try {
        const savedParsed = JSON.parse(saved);
        const filteredSaved = savedParsed.filter(
          (user) => user.id !== currentUserId
        );
        setRecentSearches(filteredSaved);
      } catch {
        setRecentSearches([]);
      }
    }
  }, [currentUserId]);

  // Simpan recent searches setiap berubah
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
      const res = await axios.get(
        "https://rutee.id/dapur/user/search-user.php",
        { params: { q } }
      );
      const filteredResults = (res.data.results || []).filter(
        (user) => user.id !== currentUserId
      );
      setResults(filteredResults);
    } catch (err) {
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

  // Saat user dipilih, simpan di recentSearches (max 5), set query, dan navigasi
  const handleSelectUser = (user) => {
    if (!user || user.id === currentUserId) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (u) => u.id !== user.id && u.id !== currentUserId
      );
      return [user, ...filtered].slice(0, 5);
    });

    setQuery(user.username);
    navigate(`/profile/${user.id}`);
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
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} align="center">
          Cari User
        </Typography>

        <Autocomplete
          freeSolo
          options={results}
          getOptionLabel={(option) => option.username || ""}
          loading={loading}
          onInputChange={(e, value, reason) => {
            if (reason === "input") {
              setQuery(value);
            }
          }}
          onChange={(e, value) => {
            if (value) {
              handleSelectUser(value);
            }
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
              label="Username atau Nama"
              variant="outlined"
              fullWidth
              onKeyDown={handleKeyDown}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress
                        color="inherit"
                        size={20}
                        sx={{ mr: 1 }}
                      />
                    ) : null}
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
            Pencarian Terakhir
          </Typography>
          {recentSearches.length === 0 ? (
            <Typography color="text.secondary" fontStyle="italic">
              Tidak ada pencarian terakhir
            </Typography>
          ) : (
            recentSearches.map((user, index) => (
              <ListItem
                key={`${user.id ?? "unknown"}-${index}`}
                sx={{
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => handleSelectUser(user)}
                disablePadding
              >
                <ListItemText
                  sx={{ px: 2, py: 1 }}
                  primary={user.username}
                  secondary={user.name || "—"}
                />
                <IconButton
                  edge="end"
                  aria-label="hapus"
                  onClick={(e) => handleRemoveRecent(e, user.id)}
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
