import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

export default function ShareButton({ articleId }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleShare = async () => {
    try {
      const link = `${window.location.origin}/articles/list/${articleId}`;
      await navigator.clipboard.writeText(link);
      setSnackbar({
        open: true,
        message: "Link copied to clipboard!",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Error copy link:", err);
      setSnackbar({
        open: true,
        message: "Failed to copy link",
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
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
