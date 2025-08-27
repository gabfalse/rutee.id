// src/Components/ArticleComponents/ReactionCount.jsx
import React, { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";
import API from "../../Config/API";

export default function ReactionCount({
  contentId,
  token,
  initialLikesCount = 0,
  initialCommentsCount = 0,
}) {
  const [counts, setCounts] = useState({
    likes: initialLikesCount,
    comments: initialCommentsCount,
  });
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(
    initialLikesCount === 0 && initialCommentsCount === 0
  );

  useEffect(() => {
    if (!contentId) return;

    const fetchCounts = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(
          `${API.ARTICLE_REACTIONS}?content_id=${contentId}`,
          { headers }
        );

        if (res.data?.success) {
          setCounts({
            likes: res.data.likes_count ?? 0,
            comments: res.data.comments_count ?? 0,
          });
          setLiked(!!res.data.is_liked);
        }
      } catch (err) {
        console.error(
          "❌ Error fetching reaction counts:",
          err.response || err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [contentId, token]);

  if (loading) {
    return (
      <Stack direction="row" spacing={2} mt={1} alignItems="center">
        <CircularProgress size={18} />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={2} mt={1} alignItems="center">
      {/* Likes */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {liked ? (
          <FavoriteIcon fontSize="small" sx={{ color: "red" }} />
        ) : (
          <FavoriteBorderIcon fontSize="small" color="action" />
        )}
        <Typography variant="body2" color="text.secondary">
          {counts.likes > 0 ? counts.likes : "0"}
        </Typography>
      </Stack>

      {/* Comments */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <ChatBubbleOutlineIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          {counts.comments > 0 ? counts.comments : "0"}
        </Typography>
      </Stack>
    </Stack>
  );
}
