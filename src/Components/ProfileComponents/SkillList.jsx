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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useParams } from "react-router-dom";

const defaultSkill = {
  id: "",
  skill_name: "",
  level: "",
  certificate_url: "",
};

const SkillList = ({ userId: propUserId, readOnly = false, limit }) => {
  const { token, user_id: loggedInUserId } = useAuth();
  const { user_id: paramUserId } = useParams();
  const userId = propUserId || paramUserId || loggedInUserId;

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultSkill);

  const isOwner = !readOnly && String(userId) === String(loggedInUserId);

  const fetchSkills = async () => {
    if (!userId || !token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `https://rutee.id/dapur/profile/edit-skill.php?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let data = res.data.skills || [];
      if (limit) data = data.slice(0, limit); // ✅ apply limit
      setSkills(data);
    } catch (err) {
      console.error(
        "❌ Error fetch skills:",
        err.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchSkills();
  }, [userId, token, limit]);

  const handleSave = async () => {
    if (!userId || !token) return;
    try {
      const method = form.id ? "put" : "post";
      await axios[method](
        `https://rutee.id/dapur/profile/edit-skill.php`,
        { ...form, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setForm(defaultSkill);
      fetchSkills();
    } catch (err) {
      console.error("❌ Error save skill:", err.response || err.message || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus skill ini?")) return;
    if (!userId || !token) return;

    try {
      await axios.delete(`https://rutee.id/dapur/profile/edit-skill.php`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id, user_id: userId },
      });
      fetchSkills();
    } catch (err) {
      console.error(
        "❌ Error delete skill:",
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
          Skills
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setForm(defaultSkill);
              setOpenDialog(true);
            }}
          >
            Tambah
          </Button>
        )}
      </Box>

      {skills.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          Belum ada skill
        </Typography>
      ) : (
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          flexWrap="wrap"
          gap={1}
        >
          {skills.map((skill) => (
            <Chip
              key={skill.id}
              label={`${skill.skill_name} (${skill.level})`}
              color="primary"
              variant="outlined"
              clickable={!!skill.certificate_url}
              component={skill.certificate_url ? "a" : "div"}
              href={skill.certificate_url || undefined}
              target="_blank"
              rel="noreferrer"
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

      {/* Modal tambah/edit */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{form.id ? "Edit Skill" : "Tambah Skill"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Skill"
            fullWidth
            value={form.skill_name}
            onChange={(e) => setForm({ ...form, skill_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Level"
            fullWidth
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
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

export default SkillList;
