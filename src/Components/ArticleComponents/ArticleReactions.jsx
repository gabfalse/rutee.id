import React from "react";
import ToggleLikeButton from "./ToggleLikeButton";
import CommentSection from "./CommentSections";
import { Box, Divider } from "@mui/material";

export default function ArticleReactions({ articleId, currentUserId, token }) {
  return (
    <Box mt={4}>
      {/* Tombol Like */}
      <ToggleLikeButton articleId={articleId} token={token} />

      <Divider sx={{ my: 3 }} />

      {/* Comment Section */}
      <CommentSection
        articleId={articleId}
        currentUserId={currentUserId}
        token={token}
      />
    </Box>
  );
}
