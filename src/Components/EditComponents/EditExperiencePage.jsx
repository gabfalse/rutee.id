import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const defaultExp = {
  id: "",
  company_name: "",
  position: "",
  start_date: "",
  end_date: "",
  still_working: false,
  description: "",
  proof_url: "",
};

export default function EditExperiencePage() {
  const token = localStorage.getItem("token");
  const API_URL = "https://rutee.id/dapur/profile/edit-experience.php";

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [exp, setExp] = useState(defaultExp);

  const addButtonRef = useRef(null);

  const fetchExperiences = () => {
    setLoading(true);
    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setExperiences(res.data.experiences || []))
      .catch((err) => console.error("Gagal fetch experience:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchExperiences(), []);

  const handleOpenAdd = () => {
    setExp(defaultExp);
    setOpenModal(true);
  };

  const handleOpenEdit = (item) => {
    setExp({ ...defaultExp, ...item });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => addButtonRef.current?.focus(), 0);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Yakin mau hapus experience ini?")) return;
    setLoading(true);
    axios
      .delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      })
      .then(() => fetchExperiences())
      .catch((err) => console.error("Gagal hapus experience:", err))
      .finally(() => setLoading(false));
  };

  const handleSave = () => {
    if (!exp.company_name || !exp.position || !exp.start_date) {
      alert("Lengkapi semua field wajib");
      return;
    }
    setLoading(true);
    const request = exp.id
      ? axios.put(API_URL, exp, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(API_URL, exp, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        handleCloseModal();
        setExp(defaultExp);
        fetchExperiences();
      })
      .catch((err) => {
        console.error("Gagal simpan experience:", err);
        alert("Gagal menyimpan experience. Cek console untuk detail.");
      })
      .finally(() => setLoading(false));
  };

  // Group experiences by company
  const grouped = experiences.reduce((acc, exp) => {
    (acc[exp.company_name] = acc[exp.company_name] || []).push(exp);
    return acc;
  }, {});

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Daftar Pengalaman
        </Typography>
        <Button
          ref={addButtonRef}
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{ textTransform: "none" }}
        >
          Tambah Experience
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : experiences.length === 0 ? (
        <Typography>Belum ada pengalaman.</Typography>
      ) : (
        <Box>
          {Object.entries(grouped).map(([company, exps]) => (
            <Box key={company} sx={{ mb: 5, position: "relative" }}>
              {/* Company header */}
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                  {company[0].toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight="600">
                  {company}
                </Typography>
              </Box>

              {/* Timeline */}
              <Box sx={{ position: "relative", pl: 3 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  {/* Garis timeline */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 4,
                      top: 14,
                      bottom: 14,
                      width: 4,
                      bgcolor: "primary.main",
                      borderRadius: 2,
                    }}
                  />
                  {exps.map((e, idx) => (
                    <Box
                      key={e.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      flexDirection={{ xs: "column", sm: "row" }}
                      position="relative"
                      mb={idx !== exps.length - 1 ? 3 : 0}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: -24,
                          top: 8,
                          width: 12,
                          height: 12,
                          bgcolor: "primary.main",
                          borderRadius: "50%",
                          zIndex: 2,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="500">
                          {e.position}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {e.start_date} -{" "}
                          {e.still_working ? "Sekarang" : e.end_date || ""}
                        </Typography>
                        {e.description && (
                          <Typography variant="body2" mt={1}>
                            {e.description}
                          </Typography>
                        )}
                      </Box>
                      <Box mt={{ xs: 1, sm: 0 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEdit(e)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(e.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        disableEnforceFocus
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {exp.id ? "Edit Experience" : "Tambah Experience"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Perusahaan"
            value={exp.company_name}
            onChange={(e) => setExp({ ...exp, company_name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Jabatan"
            value={exp.position}
            onChange={(e) => setExp({ ...exp, position: e.target.value })}
            fullWidth
          />
          <TextField
            type="date"
            label="Mulai"
            value={exp.start_date}
            onChange={(e) => setExp({ ...exp, start_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            type="date"
            label="Selesai"
            value={exp.end_date}
            onChange={(e) => setExp({ ...exp, end_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled={exp.still_working}
          />
          <TextField
            label="Deskripsi"
            multiline
            rows={3}
            value={exp.description}
            onChange={(e) => setExp({ ...exp, description: e.target.value })}
            fullWidth
          />
          <TextField
            label="URL Bukti"
            value={exp.proof_url}
            onChange={(e) => setExp({ ...exp, proof_url: e.target.value })}
            fullWidth
          />
          <Box display="flex" alignItems="center">
            <input
              type="checkbox"
              checked={exp.still_working}
              onChange={(e) =>
                setExp({ ...exp, still_working: e.target.checked })
              }
            />
            <Typography ml={1}>Masih bekerja di sini</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Batal</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
