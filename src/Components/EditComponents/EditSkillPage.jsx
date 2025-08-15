import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Paper,
  MenuItem,
} from "@mui/material";
import axios from "axios";

export default function EditSkillPage({ skillId, onSaved }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState({
    name: "",
    level: "",
  });

  // Ambil data skill awal
  useEffect(() => {
    if (!skillId) return;
    axios
      .get(`https://rutee.id/dapur/profile/get-skill.php?id=${skillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data || {};
        setSkill({
          name: data.name || "",
          level: data.level || "",
        });
      })
      .catch((err) => console.error(err));
  }, [skillId, token]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://rutee.id/dapur/profile/edit-skill.php",
        {
          id: skillId,
          ...skill,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Skill berhasil diperbarui!");
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nama Skill"
          value={skill.name}
          onChange={(e) => setSkill({ ...skill, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Level"
          select
          value={skill.level}
          onChange={(e) => setSkill({ ...skill, level: e.target.value })}
          fullWidth
        >
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
          <MenuItem value="Expert">Expert</MenuItem>
        </TextField>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Simpan Perubahan"}
        </Button>
      </Box>
    </Paper>
  );
}
