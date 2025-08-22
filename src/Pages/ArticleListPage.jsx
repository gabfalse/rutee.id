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
import ReactionCount from "../Components/ArticleComponents/ReactionCount";
import API from "../Config/API";

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API.ARTICLE_LIST, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

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
          Loading Article...
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
        <Typography color="text.secondary">
          There are no articles yet
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 5, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Article List
        </Typography>
      </Box>

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
              flex: "1 1 calc(33.333% - 16px)", // default desktop 3 kolom
              maxWidth: 360, // batasi lebar maksimal
              display: "flex",
              flexDirection: "column",
              flexGrow: 0,
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
            {/* Gambar */}
            {art.image_url ? (
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
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.200",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No Image
                </Typography>
              </Box>
            )}

            {/* Konten */}
            <Box
              sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  mb: 1,
                }}
              >
                {art.title}
              </Typography>

              {art.author && (
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Avatar
                    src={art.author.profile_image_url || undefined}
                    alt={art.author.name}
                    sx={{ width: 28, height: 28 }}
                  >
                    {!art.author.profile_image_url &&
                      art.author.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {art.author.name} •{" "}
                    {dayjs(art.created_at).format("DD MMM YYYY")}
                  </Typography>
                </Stack>
              )}

              {art.tags && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Tags: {art.tags}
                </Typography>
              )}

              {/* Reaction Count */}
              <ReactionCount
                contentId={art.id}
                token={localStorage.getItem("token") || null}
                initialLikesCount={art.likes_count || 0}
                initialCommentsCount={art.comments_count || 0}
              />

              <Box mt="auto">
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/articles/list/${art.id}`)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Read
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
