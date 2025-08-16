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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useParams } from "react-router-dom";

const defaultProject = {
  id: "",
  title: "",
  role: "",
  company: "",
  image_url: "",
  start_date: "",
  end_date: "",
  still_on_project: false,
  description: "",
  skills: "",
  proof_url: "",
};

const ProjectList = ({ userId: propUserId, readOnly = false, limit }) => {
  const { token, user_id: loggedInUserId } = useAuth();
  const { user_id: paramUserId } = useParams();
  const userId = propUserId || paramUserId || loggedInUserId;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultProject);

  const isOwner = !readOnly && String(userId) === String(loggedInUserId);

  const fetchProjects = async () => {
    if (!userId || !token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `https://rutee.id/dapur/profile/edit-project.php?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let data = res.data.projects || [];
      if (limit) data = data.slice(0, limit); // ✅ apply limit
      setProjects(data);
    } catch (err) {
      console.error(
        "❌ Error fetch projects:",
        err.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchProjects();
  }, [userId, token, limit]);

  const handleSave = async () => {
    if (!userId || !token) return;
    try {
      const method = form.id ? "put" : "post";
      await axios[method](
        `https://rutee.id/dapur/profile/edit-project.php`,
        { ...form, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setForm(defaultProject);
      fetchProjects();
    } catch (err) {
      console.error(
        "❌ Error save project:",
        err.response || err.message || err
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus project ini?")) return;
    if (!userId || !token) return;

    try {
      await axios.delete(`https://rutee.id/dapur/profile/edit-project.php`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id, user_id: userId },
      });
      fetchProjects();
    } catch (err) {
      console.error(
        "❌ Error delete project:",
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
          Projects
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setForm(defaultProject);
              setOpenDialog(true);
            }}
          >
            Tambah
          </Button>
        )}
      </Box>

      {projects.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          Belum ada project
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1}>
          {projects.map((proj) => (
            <Paper
              key={proj.id}
              sx={{
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography fontWeight="bold">{proj.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {proj.role} {proj.company && `@ ${proj.company}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {proj.start_date} -{" "}
                  {proj.still_on_project ? "Sekarang" : proj.end_date}
                </Typography>
                {proj.description && (
                  <Typography variant="body2">{proj.description}</Typography>
                )}
                {proj.skills && (
                  <Typography variant="body2">Skills: {proj.skills}</Typography>
                )}
                {proj.proof_url && (
                  <Button
                    variant="outlined"
                    size="small"
                    href={proj.proof_url}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ mt: 1 }}
                  >
                    Lihat
                  </Button>
                )}

                {proj.image_url && (
                  <Box mt={0.5}>
                    <img
                      src={proj.image_url}
                      alt={proj.title}
                      style={{ maxHeight: 80, borderRadius: 4 }}
                    />
                  </Box>
                )}
              </Box>
              {isOwner && (
                <Box display="flex" gap={1} mt={{ xs: 1, sm: 0 }}>
                  <Tooltip title="Edit">
                    <Edit
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setForm({
                          ...proj,
                          still_on_project: !!proj.still_on_project,
                        });
                        setOpenDialog(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <Delete
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDelete(proj.id)}
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
        <DialogTitle>{form.id ? "Edit Project" : "Tambah Project"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Judul Project"
            fullWidth
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Peran"
            fullWidth
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Perusahaan / Klien"
            fullWidth
            value={form.company || ""}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
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
          {!form.still_on_project && (
            <TextField
              margin="dense"
              label="Tanggal Selesai"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.end_date || ""}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={form.still_on_project}
                onChange={(e) =>
                  setForm({ ...form, still_on_project: e.target.checked })
                }
              />
            }
            label="Masih Berjalan"
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
            label="Skills (pisahkan koma)"
            fullWidth
            value={form.skills || ""}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL Bukti / Proof"
            fullWidth
            value={form.proof_url || ""}
            onChange={(e) => setForm({ ...form, proof_url: e.target.value })}
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

export default ProjectList;
