import React, { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";

export default function ReactionCount({
  contentId,
  token,
  initialLikesCount = 0,
  initialCommentsCount = 0,
}) {
  const [likeCount, setLikeCount] = useState(initialLikesCount);
  const [commentCount, setCommentCount] = useState(initialCommentsCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(
    initialLikesCount === 0 && initialCommentsCount === 0
  );

  useEffect(() => {
    if (!contentId) return;

    const fetchCounts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://rutee.id/dapur/article/reaction-counts.php?content_id=${contentId}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );

        if (res.data.success) {
          setLikeCount(res.data.likes_count || 0);
          setCommentCount(res.data.comments_count || 0);
          setLiked(res.data.is_liked || false); // update status like user
        }
      } catch (err) {
        console.error("[DEBUG] Error fetching reaction counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [contentId, token]);

  if (loading) return <CircularProgress size={20} />;

  return (
    <Stack direction="row" spacing={2} mt={1} alignItems="center">
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {liked ? (
          <FavoriteIcon fontSize="small" sx={{ color: "red" }} />
        ) : (
          <FavoriteBorderIcon fontSize="small" color="action" />
        )}
        <Typography variant="body2">{likeCount}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <ChatBubbleOutlineIcon fontSize="small" color="action" />
        <Typography variant="body2">{commentCount}</Typography>
      </Stack>
    </Stack>
  );
}
