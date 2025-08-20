// src/Pages/ArticleListPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "https://rutee.id/dapur/article/get-article.php"
      );
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error("❌ Error fetching articles:", err);
      setError(err.message || "Terjadi kesalahan saat memuat artikel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2} color="text.secondary">
          Memuat artikel...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  if (!articles.length)
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="text.secondary">Belum ada artikel</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Daftar Artikel
      </Typography>

      {articles.map((art) => (
        <Paper
          key={art.id}
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.25)",
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={3} flex="1 1 300px">
            {art.image_url && (
              <Box
                component="img"
                src={art.image_url}
                alt={art.title}
                sx={{
                  width: { xs: 100, sm: 140, md: 160 },
                  height: { xs: 100, sm: 140, md: 160 },
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            )}

            <Box flex="1" minWidth={0}>
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={1}
                noWrap
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {art.title}
              </Typography>
              {art.author_name && (
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Oleh: {art.author_name}
                </Typography>
              )}
              {art.tags && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ wordBreak: "break-word" }}
                >
                  Tags: {art.tags}
                </Typography>
              )}
            </Box>
          </Box>

          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/articles/list/${art.id}`)}
            >
              Baca
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
