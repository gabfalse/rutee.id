import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import { Delete, Add, Edit } from "@mui/icons-material";
import axios from "axios";

export default function EditLanguagePage() {
  const token = localStorage.getItem("token");
  const API_URL = "https://rutee.id/dapur/profile/edit-language.php";

  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [newLanguage, setNewLanguage] = useState({
    id: "",
    language: "",
    level: "",
  });

  const addButtonRef = useRef(null);

  const fetchLanguages = () => {
    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const langs = (res.data.languages || []).map((lang) => ({
          ...lang,
          level: lang.level?.toLowerCase() || "",
        }));
        setLanguages(langs);
      })
      .catch((err) => console.error("[DEBUG] Gagal ambil bahasa:", err));
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => addButtonRef.current?.focus(), 0);
  };

  const handleOpenAdd = () => {
    setNewLanguage({ id: "", language: "", level: "" });
    setOpenModal(true);
  };

  const handleOpenEdit = (lang) => {
    setNewLanguage({
      id: lang.id,
      language: lang.language,
      level: lang.level.toLowerCase(),
    });
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Yakin mau hapus bahasa ini?")) return;

    setLoading(true);
    axios
      .delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      })
      .then(() => fetchLanguages())
      .catch((err) => console.error("[DEBUG] Gagal hapus bahasa:", err))
      .finally(() => setLoading(false));
  };

  const handleSave = () => {
    if (!newLanguage.language || !newLanguage.level) {
      alert("Lengkapi semua field");
      return;
    }

    setLoading(true);
    const payload = { ...newLanguage, level: newLanguage.level.toLowerCase() };
    const request = newLanguage.id
      ? axios.put(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        handleCloseModal();
        setNewLanguage({ id: "", language: "", level: "" });
        fetchLanguages();
      })
      .catch((err) => console.error("[DEBUG] Gagal simpan bahasa:", err))
      .finally(() => setLoading(false));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      sx={{ backgroundColor: "background.paper", py: 4 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "16px",
          width: "100%",
          maxWidth: 900,
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            🌐 Bahasa yang Dikuasai
          </Typography>
          <Button
            ref={addButtonRef}
            variant="contained"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              px: 3,
            }}
            startIcon={<Add />}
            onClick={handleOpenAdd}
          >
            Tambah
          </Button>
        </Box>

        {/* Grid List */}
        {languages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Belum ada bahasa yang ditambahkan.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {languages.map((lang) => (
              <Grid key={lang.id}>
                <Card
                  sx={{
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "translateY(-4px)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{lang.language}</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        textTransform: "capitalize",
                      }}
                    >
                      Level: {lang.level}
                    </Typography>
                    <Box mt={2} display="flex" gap={1}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(lang)}
                        disabled={loading}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(lang.id)}
                        disabled={loading}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: "16px",
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>
            {newLanguage.id ? "Edit Bahasa" : "Tambah Bahasa"}
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Nama Bahasa"
              value={newLanguage.language}
              onChange={(e) =>
                setNewLanguage({ ...newLanguage, language: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Tingkat Kemahiran"
              select
              value={newLanguage.level}
              onChange={(e) =>
                setNewLanguage({
                  ...newLanguage,
                  level: e.target.value.toLowerCase(),
                })
              }
              fullWidth
            >
              <MenuItem value="beginner">Pemula</MenuItem>
              <MenuItem value="intermediate">Menengah</MenuItem>
              <MenuItem value="advanced">Lanjutan</MenuItem>
              <MenuItem value="native">Penutur Asli</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} sx={{ textTransform: "none" }}>
              Batal
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "20px", textTransform: "none" }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Simpan"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
