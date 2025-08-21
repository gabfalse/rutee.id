import React, { useState, useEffect } from "react";
import { IconButton, Typography, Stack } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";

export default function ToggleLikeButton({ articleId, token }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const contentType = "article"; // sesuai backend

  // Ambil status like dan jumlah like
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!articleId) return;

      try {
        const res = await axios.get(
          `https://rutee.id/dapur/article/get-like-counts.php?content_id=${articleId}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );

        if (res.data.success) {
          setLikeCount(res.data.likes_count || 0);
          setLiked(res.data.is_liked || false); // tombol merah jika sudah like
        }
      } catch (err) {
        console.error("[DEBUG] Error fetching like status:", err);
      }
    };

    fetchLikeStatus();
  }, [articleId, token]);

  const toggleLike = async () => {
    if (!token) return alert("Silakan login terlebih dahulu.");

    try {
      const res = await axios.post(
        "https://rutee.id/dapur/article/toggle-like.php",
        {
          content_type: contentType,
          content_id: articleId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "liked") {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else if (res.data.status === "unliked") {
        setLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Error");
      alert("Error");
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton onClick={toggleLike} color={liked ? "error" : "default"}>
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      <Typography variant="body2">{likeCount}</Typography>
    </Stack>
  );
}
