import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import ArticleReactions from "./ArticleReactions";
import API from "../../Config/API";

export default function ArticleDetailPage() {
  const { slug } = useParams(); // 🔄 ganti article_id → slug
  const { user, token } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        // 🔄 pastikan API.ARTICLE_DETAIL menerima slug
        const url = API.ARTICLE_DETAIL(slug);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(url, { headers });

        if (res.data?.article) {
          setArticle(res.data.article);
        } else {
          setArticle(null);
          setError("Artikel tidak ditemukan.");
        }
      } catch (err) {
        console.error("❌ Fetch article error:", err.response || err);
        setError(
          err.response?.data?.error || "Terjadi kesalahan saat memuat artikel."
        );
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, token]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );

  if (!article)
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="text.secondary">
          Artikel tidak ditemukan
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 4, px: { xs: 2, md: 0 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        {/* Judul */}
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          {article.title}
        </Typography>

        {/* Meta Info */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Author: {article.author_name || "Anonim"} •{" "}
          {article.created_at
            ? new Date(article.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""}
        </Typography>

        {/* Gambar */}
        {article.image_url && (
          <Box
            component="img"
            src={article.image_url}
            alt={article.title}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "contain",
              borderRadius: 2,
              mb: 3,
            }}
          />
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Konten */}
        {article.content &&
          article.content
            .split("\n")
            .filter((p) => p.trim() !== "")
            .map((p, idx) => (
              <Typography
                key={idx}
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                  textAlign: "justify",
                  mb: 2,
                }}
              >
                {p}
              </Typography>
            ))}

        {/* Tags */}
        {article.tags && (
          <Box mt={3} display="flex" gap={1} flexWrap="wrap">
            {article.tags.split(",").map((tag, idx) => (
              <Chip key={idx} label={tag.trim()} variant="outlined" />
            ))}
          </Box>
        )}

        {/* Reactions */}
        <ArticleReactions
          articleId={article.id} // ⚠️ tetap pakai ID internal untuk like/comment
          currentUserId={user?.id}
          token={token}
        />
      </Paper>
    </Box>
  );
}
