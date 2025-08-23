import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import API from "../Config/API";

export default function RuteeArticlePage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const userId = "f57f05a1-1506-446f-8e69-3d32e60b5e7c";

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API.RUTEE_ARTICLE}?user_id=${userId}&page=${page}&limit=${limit}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setArticles(res.data.articles || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Error fetching user articles:", err);
      setError(err.message || "Terjadi kesalahan saat memuat artikel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page]);

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2} color="text.secondary">
          Loading Articles...
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
        <Typography color="text.secondary">No articles found</Typography>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 5, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        Rutee's Article
      </Typography>

      {/* Card Grid */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {articles.map((art) => (
          <Paper
            key={art.id}
            sx={{
              flex: "1 1 calc(33.333% - 16px)",
              maxWidth: 360,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: "0px 6px 18px rgba(0,0,0,0.12)",
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0px 10px 24px rgba(0,0,0,0.2)",
              },
              "@media (max-width:900px)": {
                flex: "1 1 calc(50% - 12px)",
                maxWidth: "calc(50% - 12px)",
              },
              "@media (max-width:600px)": {
                flex: "1 1 100%",
                maxWidth: "100%",
              },
            }}
          >
            {art.image_url && (
              <Box
                component="img"
                src={art.image_url}
                alt={art.title}
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              />
            )}

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ p: 2 }}
            >
              <Avatar
                src={art.author_avatar || undefined}
                alt={art.author_name}
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2, // maksimal 2 baris, bisa diubah
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {art.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {art.author_name} •{" "}
                  {dayjs(art.created_at).format("DD MMM YYYY")}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              sx={{ m: 2, mt: 0, borderRadius: 2, textTransform: "none" }}
              onClick={() => navigate(`/articles/list/${art.id}`)}
            >
              Read
            </Button>
          </Paper>
        ))}
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" gap={2} mt={4}>
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Typography>
          Page {page} of {Math.ceil(total / limit) || 1}
        </Typography>
        <Button
          variant="outlined"
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
