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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useParams } from "react-router-dom";
import API from "../../Config/API"; // pakai config API

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
  const { token, user } = useAuth();
  const { user_id: paramUserId } = useParams();
  const userId = propUserId || paramUserId || user?.id;

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultExperience);

  const isOwner = !readOnly && String(userId) === String(user?.id);

  const fetchExperiences = async () => {
    if (!userId || !token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API.PROFILE_EDIT_EXPERIENCE}?user_id=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let data = res.data.experiences || [];
      if (limit) data = data.slice(0, limit);
      setExperiences(data);
    } catch (err) {
      console.error("❌ Error fetch experiences:", err.response || err.message);
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
        API.PROFILE_EDIT_EXPERIENCE,
        { ...form, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setForm(defaultExperience);
      fetchExperiences();
    } catch (err) {
      console.error("❌ Error save experience:", err.response || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus pengalaman ini?")) return;
    if (!userId || !token) return;
    try {
      await axios.delete(API.PROFILE_EDIT_EXPERIENCE, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id, user_id: userId },
      });
      fetchExperiences();
    } catch (err) {
      console.error("❌ Error delete experience:", err.response || err.message);
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
            Add
          </Button>
        )}
      </Box>

      {experiences.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          No experience yet
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
                  <Button
                    href={exp.proof_url}
                    target="_blank"
                    rel="noreferrer"
                    size="small"
                    sx={{ mt: 1 }}
                    variant="outlined"
                  >
                    View
                  </Button>
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
                  <Tooltip title="Delete">
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

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {form.id ? "Edit Experience" : "Add Experience"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Company"
            fullWidth
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Position"
            fullWidth
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Start date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="End date"
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
            label="Still in this position"
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
          <TextField
            margin="dense"
            label="URL (drive/image, etc)"
            fullWidth
            value={form.proof_url || ""}
            onChange={(e) => setForm({ ...form, proof_url: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ExperienceList;
