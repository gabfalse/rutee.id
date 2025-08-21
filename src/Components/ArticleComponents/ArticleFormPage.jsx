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
import { PhotoCamera } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const API_URL = "https://rutee.id/dapur/article/articles.php";
const UPLOAD_URL = "https://rutee.id/dapur/article/upload-article-image.php";

export default function ArticleFormPage() {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [articleIdCreated, setArticleIdCreated] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const loggedInUserId = user?.id;

  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: "",
    tags: "",
    status: "draft",
    user_id: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const isOwner = id ? form.user_id === loggedInUserId : true;

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

        if (article.user_id !== loggedInUserId) {
          setAlert({
            open: true,
            message: "Unauthorzed",
            severity: "error",
          });
          navigate("/articles");
          return;
        }
        setForm(article);
      } catch (err) {
        console.error(err.response || err);
        setAlert({
          open: true,
          message: "Failed to load article",
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
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !isOwner) return;
    setLoading(true);

    try {
      let imageUrl = form.image_url;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const uploadRes = await axios.post(UPLOAD_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        if (uploadRes.data.success) imageUrl = uploadRes.data.url;
        else throw new Error(uploadRes.data.error || "Upload gagal");
      }

      const res = await axios({
        method: id ? "put" : "post",
        url: API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: id
          ? { ...form, id, image_url: imageUrl }
          : { ...form, user_id: loggedInUserId, image_url: imageUrl },
      });

      setArticleIdCreated(id || res.data.id);
      setAlert({
        open: true,
        message: id ? "Update success" : "Article created",
        severity: "success",
      });
    } catch (err) {
      console.error(err.response || err);
      setAlert({
        open: true,
        message: "Error occured",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", my: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, mb: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {id ? "Edit Article" : "Create New Article"}
          </Typography>
        </Box>

        {!isOwner && id ? (
          <Typography color="error">Unauthorized</Typography>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              fullWidth
              disabled={!isOwner}
            />
            <TextField
              label="Content"
              name="content"
              value={form.content}
              onChange={handleChange}
              multiline
              rows={6}
              required
              fullWidth
              disabled={!isOwner}
            />

            {/* Styled Upload Button + Preview */}
            <Box>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                sx={{ textTransform: "none", mb: 1 }}
                disabled={!isOwner}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Image Preview:</Typography>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    style={{
                      maxWidth: "200px",
                      marginTop: "5px",
                      borderRadius: 5,
                    }}
                  />
                </Box>
              )}
              {!file && form.image_url && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Image:</Typography>
                  <img
                    src={form.image_url}
                    alt="current"
                    style={{
                      maxWidth: "200px",
                      marginTop: "5px",
                      borderRadius: 5,
                    }}
                  />
                </Box>
              )}
            </Box>

            <TextField
              label="Tags (Separate with commas)"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              fullWidth
              disabled={!isOwner}
            />
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
                <MenuItem value="published">Publish</MenuItem>
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
                  "Create"
                )}
              </Button>
              {articleIdCreated && (
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/article/${articleIdCreated}`)}
                >
                  View Artikel
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Paper>

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
