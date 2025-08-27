// src/Components/ArticleComponents/ToggleLikeButton.jsx
import React, { useState, useEffect } from "react";
import { IconButton, Typography, Stack, CircularProgress } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";
import API from "../../Config/API";

export default function ToggleLikeButton({ articleId, token }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const contentType = "article"; // sesuai backend

  // Ambil status like dan jumlah like
  useEffect(() => {
    if (!articleId) return;

    const fetchLikeStatus = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(
          `${API.ARTICLE_LIKE_COUNT}?content_id=${articleId}`,
          { headers }
        );

        if (res.data?.success) {
          setLikeCount(res.data.likes_count ?? 0);
          setLiked(!!res.data.is_liked);
        }
      } catch (err) {
        console.error("❌ Error fetching like status:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikeStatus();
  }, [articleId, token]);

  // Toggle like (optimistic update)
  const toggleLike = async () => {
    if (!token) {
      console.warn("Silakan login terlebih dahulu.");
      return;
    }

    setSubmitting(true);

    // Optimistic update
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount((c) => Math.max(c + (prevLiked ? -1 : 1), 0));

    try {
      const res = await axios.post(
        API.ARTICLE_TOGGLE_LIKE,
        { content_type: contentType, content_id: articleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // kalau backend balikin status berbeda, sinkronkan lagi
      if (res.data?.status === "liked") {
        setLiked(true);
      } else if (res.data?.status === "unliked") {
        setLiked(false);
      }
    } catch (err) {
      console.error("❌ Error toggle like:", err.response || err);
      // rollback kalau error
      setLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CircularProgress size={20} />;
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        onClick={toggleLike}
        color={liked ? "error" : "default"}
        disabled={submitting}
      >
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      <Typography variant="body2">{likeCount}</Typography>
    </Stack>
  );
}
