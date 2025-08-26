// src/Components/Article/CommentSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  IconButton,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import API from "../../Config/API";

export default function CommentSection({ articleId, currentUserId, token }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Ambil komentar
  const fetchComments = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(
        `${API.ARTICLE_COMMENTS}?content_type=article&content_id=${articleId}`,
        { headers }
      );
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.error("[DEBUG] Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId, token]);

  // Tambah komentar baru
  const handleAddComment = async () => {
    if (!currentUserId) {
      setSnackbarOpen(true); // tampilkan notifikasi
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        API.ARTICLE_COMMENTS,
        {
          content_type: "article",
          content_id: articleId,
          message: newComment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        if (res.data.user_name) {
          setComments([
            ...comments,
            {
              id: res.data.id,
              user_id: currentUserId,
              message: newComment,
              created_at: new Date().toISOString(),
              user_name: res.data.user_name,
              profile_image_url: res.data.profile_image_url,
            },
          ]);
        } else {
          await fetchComments();
        }
        setNewComment("");
      }
    } catch (err) {
      console.error("Error add comment:", err);
    }
  };

  // Update komentar
  const handleUpdateComment = async (id) => {
    if (!currentUserId) return;
    try {
      const res = await axios.put(
        API.ARTICLE_COMMENTS,
        { id, message: editMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setComments(
          comments.map((c) =>
            c.id === id ? { ...c, message: editMessage } : c
          )
        );
        setEditMode(null);
        setEditMessage("");
      }
    } catch (err) {
      console.error("Error update comment:", err);
    }
  };

  // Hapus komentar
  const handleDeleteComment = async (id) => {
    if (!currentUserId) return;
    try {
      const res = await axios.delete(API.ARTICLE_COMMENTS, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: `id=${encodeURIComponent(id)}`,
      });
      if (res.data.success) {
        setComments(comments.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Error delete comment:", err.response?.data || err);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>

      {/* Input komentar baru */}
      <Box display="flex" gap={1} mb={2}>
        <TextField
          size="small"
          variant="outlined"
          fullWidth
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!currentUserId}
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          disabled={!currentUserId}
        >
          Send
        </Button>
      </Box>

      {!currentUserId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Silakan login terlebih dahulu untuk menulis komentar.
        </Alert>
      )}

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        comments.map((comment) => (
          <Box key={comment.id} display="flex" alignItems="flex-start" mb={1.5}>
            <Avatar
              src={comment.profile_image_url || ""}
              alt={comment.user_name}
              sx={{ mr: 1 }}
            />
            <Box flex={1}>
              <Typography variant="subtitle2">{comment.user_name}</Typography>

              {editMode === comment.id ? (
                <Box display="flex" gap={1} mt={0.5}>
                  <TextField
                    size="small"
                    fullWidth
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                  />
                  <IconButton onClick={() => handleUpdateComment(comment.id)}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setEditMode(null);
                      setEditMessage("");
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              ) : (
                <Typography variant="body2" mt={0.5}>
                  {comment.message}
                </Typography>
              )}

              {comment.user_id === currentUserId && editMode !== comment.id && (
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditMode(comment.id);
                      setEditMessage(comment.message);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        ))
      )}

      {/* Snackbar notifikasi */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Silakan login terlebih dahulu untuk menulis komentar."
      />
    </div>
  );
}
