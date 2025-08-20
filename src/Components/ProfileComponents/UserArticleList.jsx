import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Tooltip,
  Button,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// ...import dan hook sama seperti sebelumnya

const UserArticleList = ({ limit }) => {
  const { token, user_id: loggedInUser } = useAuth();
  const navigate = useNavigate();
  const { user_id: paramUserId } = useParams();
  const location = useLocation();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerName, setOwnerName] = useState("");

  const isOwnedRoute = location.pathname.startsWith("/articles/owned");
  const targetUserId = isOwnedRoute ? loggedInUser : paramUserId;
  const isOwner =
    loggedInUser && (isOwnedRoute || loggedInUser === paramUserId);

  const fetchArticles = async () => {
    if (!targetUserId) return;
    setLoading(true);
    setError(null);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(
        `https://rutee.id/dapur/article/articles.php?user_id=${targetUserId}`,
        { headers }
      );
      let data = res.data.articles || [];
      if (data.length > 0) setOwnerName(data[0].owner_name || "");

      if (limit) data = data.slice(0, limit);
      setArticles(data);

      // --------------
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
  }, [targetUserId, token, limit]);

  // --- DEBUG sebelum render ---

  // ----------------------------

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus artikel ini?")) return;
    if (!token || !id) return;

    try {
      await axios.delete(`https://rutee.id/dapur/article/articles.php`, {
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

  // ...render sama seperti sebelumnya

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
      {/* Judul utama */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {isOwner ? "Artikel Saya" : `Artikel ${ownerName || "yang dimiliki"}`}
      </Typography>

      {/* Tombol buat artikel hanya untuk owner */}
      {isOwner && (
        <Box mb={2} textAlign="right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/articles/new")}
          >
            + Buat Artikel
          </Button>
        </Box>
      )}

      {articles.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          Belum ada artikel
        </Typography>
      ) : (
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
                {art.image_url && (
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
                )}

                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {art.title}
                  </Typography>
                  {art.tags && (
                    <Typography variant="body1" color="text.secondary">
                      Tags: {art.tags}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box display="flex" gap={2}>
                <Tooltip title="Lihat Detail">
                  <Visibility
                    fontSize="medium"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/articles/list/${art.id}`)}
                  />
                </Tooltip>

                {isOwner && (
                  <>
                    <Tooltip title="Edit">
                      <Edit
                        fontSize="medium"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/articles/edit/${art.id}`)}
                      />
                    </Tooltip>
                    <Tooltip title="Hapus">
                      <Delete
                        fontSize="medium"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleDelete(art.id)}
                      />
                    </Tooltip>
                  </>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default UserArticleList;
