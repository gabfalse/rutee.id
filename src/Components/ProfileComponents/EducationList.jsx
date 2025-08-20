// src/components/Profile/EducationList.jsx
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

// Sesuaikan default education dengan DB baru
const defaultEducation = {
  id: "",
  institution: "",
  major: "",
  start_year: "",
  end_year: "",
  still_study: false,
  description: "",
};

const EducationList = ({ userId: propUserId, readOnly = false, limit }) => {
  const { token, user_id: loggedInUserId } = useAuth();
  const { user_id: paramUserId } = useParams();
  const userId = propUserId || paramUserId || loggedInUserId;

  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultEducation);

  const isOwner = !readOnly && String(userId) === String(loggedInUserId);

  const fetchEducations = async () => {
    if (!userId || !token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `https://rutee.id/dapur/profile/edit-education.php`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let data = res.data.educations || [];
      if (limit) data = data.slice(0, limit);
      setEducations(data);
    } catch (err) {
      console.error(
        "❌ Error fetch educations:",
        err.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchEducations();
  }, [userId, token, limit]);

  const handleSave = async () => {
    if (!userId || !token) return;
    try {
      const method = form.id ? "put" : "post";
      await axios[method](
        `https://rutee.id/dapur/profile/edit-education.php`,
        {
          id: form.id,
          institution: form.institution,
          major: form.major,
          start_year: form.start_year,
          end_year: form.still_study ? null : form.end_year,
          still_study: form.still_study,
          description: form.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setForm(defaultEducation);
      fetchEducations();
    } catch (err) {
      console.error(
        "❌ Error save education:",
        err.response || err.message || err
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus education ini?")) return;
    if (!userId || !token) return;
    try {
      await axios.delete(`https://rutee.id/dapur/profile/edit-education.php`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      fetchEducations();
    } catch (err) {
      console.error(
        "❌ Error delete education:",
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
          Education
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setForm(defaultEducation);
              setOpenDialog(true);
            }}
          >
            Tambah
          </Button>
        )}
      </Box>

      {educations.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          Belum ada education
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1}>
          {educations.map((edu) => (
            <Paper
              key={edu.id}
              sx={{
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography fontWeight="bold">
                  {edu.institution} - {edu.major}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.start_year} -{" "}
                  {edu.still_study ? "Sekarang" : edu.end_year}
                </Typography>
                {edu.description && (
                  <Typography variant="body2">{edu.description}</Typography>
                )}
              </Box>
              {isOwner && (
                <Box display="flex" gap={1} mt={{ xs: 1, sm: 0 }}>
                  <Tooltip title="Edit">
                    <Edit
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setForm(edu);
                        setOpenDialog(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <Delete
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDelete(edu.id)}
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
          {form.id ? "Edit Education" : "Tambah Education"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Institution"
            fullWidth
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Major"
            fullWidth
            value={form.major}
            onChange={(e) => setForm({ ...form, major: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Start Year"
            type="number"
            fullWidth
            value={form.start_year}
            onChange={(e) => setForm({ ...form, start_year: e.target.value })}
          />
          {!form.still_study && (
            <TextField
              margin="dense"
              label="End Year"
              type="number"
              fullWidth
              value={form.end_year || ""}
              onChange={(e) => setForm({ ...form, end_year: e.target.value })}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={form.still_study}
                onChange={(e) =>
                  setForm({ ...form, still_study: e.target.checked })
                }
              />
            }
            label="Masih Studi"
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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

export default EducationList;
