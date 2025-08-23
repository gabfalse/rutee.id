import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import API from "../../Config/API";
import { useAuth } from "../../Context/AuthContext";

export default function HideButton({ articleId, onHidden }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleHide = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        API.REPORT_ARTICLE, // 🔹 pakai endpoint report yang sama
        { article_id: articleId, reason: "sembunyikan" }, // 🔹 auto alasan
        { headers }
      );

      if (res.data.success) {
        setSnackbar({
          open: true,
          message: res.data.message || "Artikel berhasil disembunyikan",
          severity: "success",
        });
        if (onHidden) onHidden(articleId); // 🔹 langsung remove dari list
      } else {
        setSnackbar({
          open: true,
          message: res.data.error || "Gagal menyembunyikan",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("❌ Error hide:", err);
      const errorMsg =
        err.response?.data?.error || "Terjadi kesalahan, coba lagi";
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Hide (dipakai di MenuItem) */}
      <Button
        onClick={handleHide}
        disabled={loading}
        startIcon={<VisibilityOffIcon fontSize="small" />}
        color="warning"
        size="small"
      >
        {loading ? "Hiding..." : "Hide Article"}
      </Button>

      {/* Snackbar Feedback */}
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
