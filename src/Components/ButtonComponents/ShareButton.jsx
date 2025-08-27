import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

export default function ShareButton({ slug }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const link = `${window.location.origin}/articles/list/${slug}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        // ✅ Gunakan Web Share API (browser mobile)
        await navigator.share({
          title: "Check this article!",
          text: "Here’s an article I found interesting:",
          url: link,
        });
      } else {
        // ✅ Fallback: copy ke clipboard
        await navigator.clipboard.writeText(link);
        setSnackbar({
          open: true,
          message: "Link copied to clipboard!",
          severity: "success",
        });
      }
    } catch (err) {
      console.error("❌ Error sharing:", err);
      setSnackbar({
        open: true,
        message: "Failed to share the link",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        startIcon={<ShareIcon fontSize="small" />}
        color="primary"
        size="small"
      >
        Share
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
