// src/components/Profile/SkillList.jsx
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useParams } from "react-router-dom";
import API from "../../Config/API";

const defaultSkill = {
  id: "",
  skill_name: "",
  level: "",
  certificate_url: "",
};

const SkillList = ({ userId: propUserId, readOnly = false, limit }) => {
  const { token, user } = useAuth();
  const { user_id: paramUserId } = useParams();
  const userId = propUserId || paramUserId || user?.id;

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultSkill);
  const [error, setError] = useState("");

  const isOwner = !readOnly && String(userId) === String(user?.id);

  const fetchSkills = async () => {
    if (!userId || !token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API.PROFILE_EDIT_SKILL}?user_id=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let data = res.data.skills || [];
      if (limit) data = data.slice(0, limit);
      setSkills(data);
    } catch (err) {
      console.error("❌ Error fetch skills:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchSkills();
  }, [userId, token, limit]);

  const handleSave = async () => {
    setError("");
    if (!userId || !token) return;

    if (form.level === "Expert" && !form.certificate_url.trim()) {
      setError("URL wajib diisi untuk level Expert!");
      return;
    }

    try {
      const method = form.id ? "put" : "post";
      await axios[method](
        API.PROFILE_EDIT_SKILL,
        { ...form, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setForm(defaultSkill);
      fetchSkills();
    } catch (err) {
      console.error("❌ Error save skill:", err.response || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus skill ini?")) return;
    if (!userId || !token) return;

    try {
      await axios.delete(API.PROFILE_EDIT_SKILL, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id, user_id: userId },
      });
      fetchSkills();
    } catch (err) {
      console.error("❌ Error delete skill:", err.response || err.message);
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
          Skills
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setForm(defaultSkill);
              setError("");
              setOpenDialog(true);
            }}
          >
            Add
          </Button>
        )}
      </Box>

      {skills.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          No skill yet
        </Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
          {skills.map((skill) => (
            <Chip
              key={skill.id}
              label={`${skill.skill_name} (${skill.level})`}
              color="primary"
              variant="outlined"
              onClick={
                skill.certificate_url
                  ? () => window.open(skill.certificate_url, "_blank")
                  : undefined
              }
              onDelete={isOwner ? () => handleDelete(skill.id) : undefined}
              deleteIcon={isOwner ? <Delete /> : undefined}
              icon={
                isOwner ? (
                  <Tooltip title="Edit">
                    <Edit
                      fontSize="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm(skill);
                        setError("");
                        setOpenDialog(true);
                      }}
                    />
                  </Tooltip>
                ) : undefined
              }
              sx={{ borderRadius: "16px", fontSize: "0.85rem" }}
            />
          ))}
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{form.id ? "Edit Skill" : "Add Skill"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Skill"
            fullWidth
            value={form.skill_name}
            onChange={(e) => setForm({ ...form, skill_name: e.target.value })}
          />

          <FormControl margin="dense" fullWidth>
            <InputLabel id="level-label">Level</InputLabel>
            <Select
              labelId="level-label"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Expert">Expert</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Certificate URL"
            fullWidth
            value={form.certificate_url || ""}
            onChange={(e) =>
              setForm({ ...form, certificate_url: e.target.value })
            }
            required={form.level === "Expert"}
            helperText={
              form.level === "Expert"
                ? "Expert need to fill the URL"
                : "Optional"
            }
            error={form.level === "Expert" && !form.certificate_url}
          />

          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}
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

export default SkillList;
