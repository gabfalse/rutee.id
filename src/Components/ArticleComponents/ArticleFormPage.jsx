import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const API_URL = "https://rutee.id/dapur/article/articles.php";

export default function ArticleFormPage() {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [articleIdCreated, setArticleIdCreated] = useState(null);

  const { id } = useParams(); // id untuk edit
  const navigate = useNavigate();
  const { token, user_id: loggedInUserId } = useAuth(); // ambil user_id login

  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: "",
    tags: "",
    status: "draft",
    user_id: "", // simpan user_id pemilik
  });
  const [loading, setLoading] = useState(false);

  const isOwner = id ? form.user_id === loggedInUserId : true; // cek kepemilikan

  // Ambil data artikel untuk edit
  useEffect(() => {
    if (!id || !token) return;
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const article = res.data.article;
        if (!article) throw new Error("Artikel tidak ditemukan");

        // cek kepemilikan
        if (article.user_id !== loggedInUserId) {
          setAlert({
            open: true,
            message: "Anda tidak memiliki izin untuk mengedit artikel ini",
            severity: "error",
          });
          navigate("/articles"); // redirect ke daftar artikel
          return;
        }

        setForm(article);
      } catch (err) {
        console.error(err.response || err);
        setAlert({
          open: true,
          message: "Gagal memuat artikel",
          severity: "error",
        });
        navigate("/articles");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, token, loggedInUserId, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !isOwner) return; // aman jika bukan pemilik
    setLoading(true);
    try {
      const res = await axios({
        method: id ? "put" : "post",
        url: API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: id ? { ...form, id } : form,
      });

      const returnedId = id || res.data.id; // pakai id baru jika create
      setArticleIdCreated(returnedId);

      setAlert({
        open: true,
        message: id ? "Artikel berhasil diupdate" : "Artikel berhasil dibuat",
        severity: "success",
      });
    } catch (err) {
      console.error(err.response || err);
      setAlert({
        open: true,
        message: "Terjadi kesalahan saat submit",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", my: 4, px: 2 }}>
      {/* === FORM === */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, mb: 4 }}>
        {/* Tombol Back */}
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Kembali
        </Button>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {id ? "Edit Artikel" : "Buat Artikel Baru"}
          </Typography>
        </Box>

        {!isOwner && id ? (
          <Typography color="error">
            Anda tidak memiliki izin untuk mengedit artikel ini
          </Typography>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Judul"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              fullWidth
              disabled={!isOwner}
            />
            <TextField
              label="Konten"
              name="content"
              value={form.content}
              onChange={handleChange}
              multiline
              rows={6}
              required
              fullWidth
              disabled={!isOwner}
            />
            <TextField
              label="Image URL"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              fullWidth
              disabled={!isOwner}
            />
            <TextField
              label="Tags"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              fullWidth
              disabled={!isOwner}
            />

            {/* === Status Dropdown === */}
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                disabled={!isOwner}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>

            <Box display="flex" gap={2} alignItems="center">
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !isOwner}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : id ? (
                  "Update"
                ) : (
                  "Buat"
                )}
              </Button>

              {articleIdCreated && (
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/article/${articleIdCreated}`)}
                >
                  Lihat Artikel
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Snackbar Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
