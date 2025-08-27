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
  CircularProgress,
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

  const handleCloseDialog = () => {
    setOpen(false);
    setReason("");
  };

  const handleReport = async () => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "You must be logged in to report",
        severity: "warning",
      });
      return;
    }

    if (!reason.trim()) {
      setSnackbar({
        open: true,
        message: "Reason cannot be empty",
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
      const res = await axios.post(
        API.REPORT_ARTICLE,
        { article_id: articleId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSnackbar({
          open: true,
          message: res.data.message || "Report submitted successfully",
          severity: "success",
        });
        handleCloseDialog();
      } else {
        setSnackbar({
          open: true,
          message: res.data.error || "Failed to submit report",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("❌ Error report:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Something went wrong, try again",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Report */}
      <Button
        onClick={() => setOpen(true)}
        startIcon={<FlagIcon fontSize="small" />}
        color="error"
        size="small"
      >
        Report Article
      </Button>

      {/* Dialog Input Report */}
      <Dialog open={open} onClose={handleCloseDialog}>
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleReport}
            disabled={loading}
            variant="contained"
            color="error"
            startIcon={
              loading ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {loading ? "Sending..." : "Send Report"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
