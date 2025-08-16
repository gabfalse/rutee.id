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
  Chip,
  Paper,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useParams } from "react-router-dom";

const defaultExperience = {
  id: "",
  company_name: "",
  position: "",
  start_date: "",
  end_date: "",
  still_working: false,
  description: "",
  proof_url: "",
};

const ExperienceList = ({ userId: propUserId, readOnly = false, limit }) => {
  const { token, user_id: loggedInUserId } = useAuth();
  const { user_id: paramUserId } = useParams();
  const userId = propUserId || paramUserId || loggedInUserId;

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultExperience);

  const isOwner = !readOnly && String(userId) === String(loggedInUserId);

  const fetchExperiences = async () => {
    if (!userId || !token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `https://rutee.id/dapur/profile/edit-experience.php?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let data = res.data.experiences || [];
      if (limit) data = data.slice(0, limit); // ✅ apply limit
      setExperiences(data);
    } catch (err) {
      console.error(
        "❌ Error fetch experiences:",
        err.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchExperiences();
  }, [userId, token, limit]);

  const handleSave = async () => {
    if (!userId || !token) return;
    try {
      const method = form.id ? "put" : "post";
      await axios[method](
        `https://rutee.id/dapur/profile/edit-experience.php`,
        { ...form, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setForm(defaultExperience);
      fetchExperiences();
    } catch (err) {
      console.error(
        "❌ Error save experience:",
        err.response || err.message || err
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus pengalaman ini?")) return;
    if (!userId || !token) return;

    try {
      await axios.delete(`https://rutee.id/dapur/profile/edit-experience.php`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id, user_id: userId },
      });
      fetchExperiences();
    } catch (err) {
      console.error(
        "❌ Error delete experience:",
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
          Experiences
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setForm(defaultExperience);
              setOpenDialog(true);
            }}
          >
            Tambah
          </Button>
        )}
      </Box>

      {experiences.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          Belum ada pengalaman
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1}>
          {experiences.map((exp) => (
            <Paper
              key={exp.id}
              sx={{
                p: 1.5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
              }}
            >
              <Box>
                <Typography fontWeight="bold">
                  {exp.position} - {exp.company_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.start_date} -{" "}
                  {exp.still_working ? "Sekarang" : exp.end_date || "-"}
                </Typography>
                {exp.description && (
                  <Typography variant="body2">{exp.description}</Typography>
                )}
                {exp.proof_url && (
                  <Typography variant="body2">
                    <a href={exp.proof_url} target="_blank" rel="noreferrer">
                      Bukti
                    </a>
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
                        setForm(exp);
                        setOpenDialog(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <Delete
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDelete(exp.id)}
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
          {form.id ? "Edit Experience" : "Tambah Experience"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Perusahaan"
            fullWidth
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Jabatan"
            fullWidth
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tanggal Mulai"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tanggal Selesai"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={form.still_working}
            value={form.end_date || ""}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.still_working}
                onChange={(e) =>
                  setForm({ ...form, still_working: e.target.checked })
                }
              />
            }
            label="Masih bekerja di sini"
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
            label="URL Bukti"
            fullWidth
            value={form.proof_url || ""}
            onChange={(e) => setForm({ ...form, proof_url: e.target.value })}
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

export default ExperienceList;
