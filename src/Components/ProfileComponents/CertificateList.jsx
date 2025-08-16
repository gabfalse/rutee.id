import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Paper,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useParams } from "react-router-dom";

const defaultCertificate = {
  id: "",
  name: "",
  issued_by: "",
  issue_date: "",
  description: "",
  certificate_url: "",
  image_url: "",
};

const CertificateList = ({ userId: propUserId, readOnly = false, limit }) => {
  const { token, user_id: loggedInUserId } = useAuth();
  const { user_id: paramUserId } = useParams();
  const userId = propUserId || paramUserId || loggedInUserId;

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultCertificate);

  const isOwner = !readOnly && String(userId) === String(loggedInUserId);

  const fetchCertificates = async () => {
    if (!userId || !token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `https://rutee.id/dapur/profile/edit-certificate.php?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let data = res.data.certificates || [];
      if (limit) data = data.slice(0, limit); // ✅ apply limit
      setCertificates(data);
    } catch (err) {
      console.error(
        "❌ Error fetch certificates:",
        err.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchCertificates();
  }, [userId, token, limit]);

  const handleSave = async () => {
    if (!userId || !token) return;
    try {
      const method = form.id ? "put" : "post";
      await axios[method](
        `https://rutee.id/dapur/profile/edit-certificate.php`,
        { ...form, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setForm(defaultCertificate);
      fetchCertificates();
    } catch (err) {
      console.error(
        "❌ Error save certificate:",
        err.response || err.message || err
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus sertifikat ini?")) return;
    if (!userId || !token) return;

    try {
      await axios.delete(
        `https://rutee.id/dapur/profile/edit-certificate.php`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { id, user_id: userId },
        }
      );
      fetchCertificates();
    } catch (err) {
      console.error(
        "❌ Error delete certificate:",
        err.response || err.message || err
      );
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Certificates
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setForm(defaultCertificate);
              setOpenDialog(true);
            }}
          >
            Tambah
          </Button>
        )}
      </Box>

      {certificates.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          Belum ada sertifikat
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {certificates.map((cert) => (
            <Paper
              key={cert.id}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1,
              }}
            >
              <Box flex={1}>
                {cert.image_url && (
                  <Box mt={0.5}>
                    <img
                      src={cert.image_url}
                      alt={cert.name}
                      style={{ maxHeight: 80, width: "auto" }}
                    />
                  </Box>
                )}
                <Typography fontWeight="bold">{cert.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Diterbitkan oleh {cert.issued_by} - {cert.issue_date}
                </Typography>
                {cert.description && (
                  <Typography variant="body2">{cert.description}</Typography>
                )}
                {cert.certificate_url && (
                  <Typography variant="body2">
                    <Button
                      href={cert.certificate_url}
                      sx={{ mt: 1 }}
                      target="_blank"
                      variant="outlined"
                      rel="noreferrer"
                      size="small"
                    >
                      Lihat
                    </Button>
                  </Typography>
                )}
              </Box>

              {isOwner && (
                <Box display="flex" gap={1} mt={{ xs: 1, sm: 0 }}>
                  <Tooltip title="Edit">
                    <Edit
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setForm(cert);
                        setOpenDialog(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <Delete
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDelete(cert.id)}
                    />
                  </Tooltip>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* Modal tambah/edit */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {form.id ? "Edit Certificate" : "Tambah Certificate"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Sertifikat"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Diterbitkan Oleh"
            fullWidth
            value={form.issued_by}
            onChange={(e) => setForm({ ...form, issued_by: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tanggal Terbit"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.issue_date}
            onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Deskripsi"
            fullWidth
            multiline
            rows={3}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL Sertifikat"
            fullWidth
            value={form.certificate_url || ""}
            onChange={(e) =>
              setForm({ ...form, certificate_url: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="URL Gambar"
            fullWidth
            value={form.image_url || ""}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Batal</Button>
          <Button onClick={handleSave} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CertificateList;
