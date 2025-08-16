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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useParams } from "react-router-dom";

const defaultLanguage = {
  id: "",
  language: "",
  level: "",
};

const LanguageList = ({ userId: propUserId, readOnly = false, limit }) => {
  const { token, user_id: loggedInUserId } = useAuth();
  const { user_id: paramUserId } = useParams();
  const userId = propUserId || paramUserId || loggedInUserId;

  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultLanguage);

  const isOwner = !readOnly && String(userId) === String(loggedInUserId);

  const fetchLanguages = async () => {
    if (!userId || !token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `https://rutee.id/dapur/profile/edit-language.php?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let data = res.data.languages || [];
      if (limit) data = data.slice(0, limit); // ✅ apply limit
      setLanguages(data);
    } catch (err) {
      console.error(
        "❌ Error fetch languages:",
        err.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchLanguages();
  }, [userId, token, limit]);

  const handleSave = async () => {
    if (!userId || !token) return;
    try {
      const method = form.id ? "put" : "post";
      await axios[method](
        `https://rutee.id/dapur/profile/edit-language.php`,
        { ...form, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setForm(defaultLanguage);
      fetchLanguages();
    } catch (err) {
      console.error(
        "❌ Error save language:",
        err.response || err.message || err
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus bahasa ini?")) return;
    if (!userId || !token) return;

    try {
      await axios.delete(`https://rutee.id/dapur/profile/edit-language.php`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id, user_id: userId },
      });
      fetchLanguages();
    } catch (err) {
      console.error(
        "❌ Error delete language:",
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
        textAlign={"center"}
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Languages
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setForm(defaultLanguage);
              setOpenDialog(true);
            }}
          >
            Tambah
          </Button>
        )}
      </Box>

      {languages.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          Belum ada bahasa
        </Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
          {languages.map((lang) => (
            <Chip
              key={lang.id}
              label={`${lang.language} (${lang.level})`}
              color="primary"
              variant="outlined"
              onDelete={isOwner ? () => handleDelete(lang.id) : undefined}
              deleteIcon={isOwner ? <Delete /> : undefined}
              icon={
                isOwner ? (
                  <Tooltip title="Edit">
                    <Edit
                      fontSize="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm(lang);
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
        <DialogTitle>{form.id ? "Edit Bahasa" : "Tambah Bahasa"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Bahasa"
            fullWidth
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Level"
            fullWidth
            select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          >
            <MenuItem value="beginner">Beginner</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="fluent">Fluent</MenuItem>
            <MenuItem value="native">Native</MenuItem>
          </TextField>
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

export default LanguageList;
