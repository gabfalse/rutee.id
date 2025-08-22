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
  const [editMode, setEditMode] = useState(null); // id comment yg lagi di-edit
  const [editMessage, setEditMessage] = useState("");

  // === Ambil komentar ===
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${API.ARTICLE_COMMENTS}?content_type=article&content_id=${articleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
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

  // === Tambah komentar baru ===
  const handleAddComment = async () => {
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
          await fetchComments(); // fallback supaya data konsisten
        }
        setNewComment("");
      }
    } catch (err) {
      console.error("Error add comment:", err);
    }
  };

  // === Update komentar ===
  const handleUpdateComment = async (id) => {
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

  // === Hapus komentar ===
  const handleDeleteComment = async (id) => {
    try {
      const res = await axios.delete(API.ARTICLE_COMMENTS, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: `id=${encodeURIComponent(id)}`, // penting: form-urlencoded
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
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <TextField
          size="small"
          variant="outlined"
          fullWidth
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddComment}>
          Send
        </Button>
      </div>

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "12px",
            }}
          >
            <Avatar
              src={comment.profile_image_url || ""}
              alt={comment.user_name}
              style={{ marginRight: "8px" }}
            />
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle2">{comment.user_name}</Typography>

              {editMode === comment.id ? (
                <div style={{ display: "flex", gap: "6px" }}>
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
                </div>
              ) : (
                <Typography variant="body2">{comment.message}</Typography>
              )}

              {comment.user_id === currentUserId && editMode !== comment.id && (
                <div>
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
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
