// src/components/Article/UserArticleList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Tooltip,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete, Visibility, Share } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import API from "../../Config/API";

const UserArticleList = ({ limit = 20 }) => {
  const { token, user } = useAuth();
  const loggedInUser = user?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: routeUserId } = useParams(); // ambil userId dari route

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [shareMsg, setShareMsg] = useState("");

  // cek apakah halaman ini milik owner
  const isOwnedRoute = location.pathname.startsWith("/articles/owned");
  const isOwner = Boolean(isOwnedRoute && loggedInUser);

  const fetchArticles = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      let res;
      if (isOwner) {
        // 🔹 ambil artikel milik sendiri (publish + draft)
        res = await axios.get(API.OWN_ARTICLE_LIST(page, limit), { headers });
      } else if (routeUserId) {
        // 🔹 ambil artikel user lain (server bisa kasih semua, tapi kita filter publish saja)
        res = await axios.get(API.USER_ARTICLE_LIST(routeUserId, page, limit), {
          headers,
        });
      } else {
        // fallback → kalau tidak ada userId dan bukan owner
        res = await axios.get(API.OWN_ARTICLE_LIST(page, limit), { headers });
      }

      let articlesData = res.data.articles || [];

      // ⬅️ filter: kalau bukan owner → hanya artikel published
      if (!isOwner) {
        articlesData = articlesData.filter((a) => a.status === "published");
      }

      setArticles(articlesData);
      setPagination(res.data.pagination || null);
    } catch (err) {
      console.error(
        "❌ Error fetch articles:",
        err.response || err.message || err
      );
      setError(err.message || "Terjadi kesalahan saat memuat artikel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [token, page, limit, routeUserId, isOwner]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus artikel ini?")) return;
    if (!token || !id) return;

    try {
      await axios.delete(API.ARTICLE_SAVE, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id, user_id: loggedInUser },
      });
      fetchArticles();
    } catch (err) {
      console.error(
        "❌ Error delete article:",
        err.response || err.message || err
      );
      setError(err.message || "Terjadi kesalahan saat menghapus artikel.");
    }
  };

  const handleShare = (article) => {
    const url = `${window.location.origin}/articles/list/${article.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.tags ? `Tags: ${article.tags}` : article.title,
          url,
        })
        .then(() => setShareMsg("Berhasil dibagikan!"))
        .catch(() => setShareMsg("Gagal membagikan"));
    } else {
      navigator.clipboard.writeText(url);
      setShareMsg("Link artikel disalin ke clipboard!");
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={2}>
        <CircularProgress />
        <Typography mt={1} color="text.secondary" fontStyle="italic">
          Memuat artikel...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
        <Typography color="error" fontStyle="italic">
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {isOwner ? "My Article" : "User Article"}
      </Typography>

      {isOwner && (
        <Box mb={2} textAlign="right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/articles/new")}
          >
            + Add Article
          </Button>
        </Box>
      )}

      {articles.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          No article yet
        </Typography>
      ) : (
        <>
          <Box display="flex" flexDirection="column" gap={1}>
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
                  borderRadius: 2,
                  boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
                }}
              >
                <Box display="flex" alignItems="center" gap={3}>
                  {art.image_url ? (
                    <Box
                      component="img"
                      src={art.image_url}
                      alt={art.title}
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.200",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No image
                      </Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {art.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                        color:
                          art.status === "published"
                            ? "success.main"
                            : "warning.main",
                        fontWeight: "bold",
                      }}
                    >
                      {art.status === "published" ? "Publish" : "Draft"}
                    </Typography>
                    {art.tags && (
                      <Typography variant="body1" color="text.secondary">
                        Tags: {art.tags}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box display="flex" gap={1}>
                  <Tooltip title="View">
                    <IconButton
                      onClick={() => navigate(`/articles/list/${art.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton onClick={() => handleShare(art)}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                  {isOwner && (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => navigate(`/articles/edit/${art.id}`)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(art.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>

          {pagination && (
            <Box display="flex" justifyContent="center" gap={2} mt={3}>
              <Button
                variant="outlined"
                disabled={!pagination.has_prev}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Typography variant="body2" sx={{ alignSelf: "center" }}>
                Page {pagination.page}
              </Typography>
              <Button
                variant="outlined"
                disabled={!pagination.has_next}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={!!shareMsg}
        autoHideDuration={3000}
        onClose={() => setShareMsg("")}
      >
        <Alert severity="info">{shareMsg}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserArticleList;
