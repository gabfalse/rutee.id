import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import axios from "axios";
import API from "../../Config/API";
import { useAuth } from "../../Context/AuthContext";

export default function ReportButton({ articleId }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleReport = async () => {
    if (!reason.trim()) {
      setSnackbar({
        open: true,
        message: "Reason can not be empty",
        severity: "warning",
      });
      return;
    }

    if (reason.length > 500) {
      setSnackbar({
        open: true,
        message: "Max 500 characters",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        API.REPORT_ARTICLE,
        { article_id: articleId, reason },
        { headers }
      );

      if (res.data.success) {
        setSnackbar({
          open: true,
          message: res.data.message || "Report Success",
          severity: "success",
        });
        setOpen(false);
        setReason("");
      } else {
        setSnackbar({
          open: true,
          message: res.data.error || "Failed to report",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("❌ Error report:", err);
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
      {/* Tombol Report (sama bentuk & ukuran dengan HideButton) */}
      <Button
        onClick={() => setOpen(true)}
        startIcon={<FlagIcon fontSize="small" />}
        color="error"
        size="small"
      >
        Report Article
      </Button>

      {/* Dialog Input Report */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Report Article</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for reporting"
            fullWidth
            multiline
            minRows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            inputProps={{ maxLength: 500 }}
            helperText={`${reason.length}/500`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReport}
            disabled={loading}
            variant="contained"
            color="error"
          >
            {loading ? "Sending..." : "Send Report"}
          </Button>
        </DialogActions>
      </Dialog>

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
