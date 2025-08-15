import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Delete, Add, Edit } from "@mui/icons-material";
import axios from "axios";

export default function EditContactPage() {
  const token = localStorage.getItem("token");
  const API_URL = "https://rutee.id/dapur/profile/edit-contact.php";

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [newContact, setNewContact] = useState({
    id: "",
    contact_type: "",
    contact_value: "",
  });

  const addButtonRef = useRef(null);

  const fetchContacts = () => {
    setLoading(true);
    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = res.data.contacts || [];
        setContacts(data);
      })
      .catch((err) => console.error("[DEBUG] Gagal ambil kontak:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => addButtonRef.current?.focus(), 0);
  };

  const handleOpenAdd = () => {
    setNewContact({ id: "", contact_type: "", contact_value: "" });
    setOpenModal(true);
  };

  const handleOpenEdit = (contact) => {
    setNewContact({
      id: contact.id,
      contact_type: contact.contact_type,
      contact_value: contact.contact_value,
    });
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Yakin mau hapus kontak ini?")) return;

    setLoading(true);
    axios
      .delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      })
      .then(() => fetchContacts())
      .catch((err) => console.error("[DEBUG] Gagal hapus kontak:", err))
      .finally(() => setLoading(false));
  };

  const handleSave = () => {
    if (!newContact.contact_type || !newContact.contact_value) {
      alert("Lengkapi semua field");
      return;
    }

    setLoading(true);
    const payload = { ...newContact };
    const request = newContact.id
      ? axios.put(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        handleCloseModal();
        setNewContact({ id: "", contact_type: "", contact_value: "" });
        fetchContacts();
      })
      .catch((err) => console.error("[DEBUG] Gagal simpan kontak:", err))
      .finally(() => setLoading(false));
  };

  // Opsional: warna berbeda tiap tipe kontak
  const getButtonColor = (type) => {
    switch (type) {
      case "Email":
        return "primary";
      case "Telepon":
        return "success";
      case "LinkedIn":
        return "info";
      case "Website":
        return "secondary";
      default:
        return "inherit";
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      sx={{ backgroundColor: "secondary", py: 4 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "16px",
          width: "100%",
          maxWidth: 400,
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            📞 Kontak
          </Typography>
          <Button
            ref={addButtonRef}
            variant="contained"
            sx={{ borderRadius: "20px", textTransform: "none" }}
            startIcon={<Add />}
            onClick={handleOpenAdd}
          >
            Tambah
          </Button>
        </Box>

        {/* List Linktree-style */}
        {loading && contacts.length === 0 ? (
          <Box textAlign="center" py={2}>
            <CircularProgress size={30} />
          </Box>
        ) : contacts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Belum ada kontak yang ditambahkan.
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {contacts.map((c) => (
              <Box key={c.id} display="flex" gap={1}>
                <Button
                  fullWidth
                  variant="contained"
                  color={getButtonColor(c.contact_type)}
                  sx={{ borderRadius: "12px", py: 1.5, textTransform: "none" }}
                  href={
                    c.contact_value.startsWith("http")
                      ? c.contact_value
                      : undefined
                  }
                  target="_blank"
                >
                  {c.contact_type}: {c.contact_value}
                </Button>
                <IconButton
                  color="primary"
                  onClick={() => handleOpenEdit(c)}
                  size="small"
                  sx={{ alignSelf: "center" }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(c.id)}
                  size="small"
                  sx={{ alignSelf: "center" }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Modal */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="xs"
          PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>
            {newContact.id ? "Edit Kontak" : "Tambah Kontak"}
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Tipe Kontak"
              select
              value={newContact.contact_type}
              onChange={(e) =>
                setNewContact({ ...newContact, contact_type: e.target.value })
              }
              fullWidth
            >
              <MenuItem value="Email">Email</MenuItem>
              <MenuItem value="Telepon">Telepon</MenuItem>
              <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              <MenuItem value="Website">Website</MenuItem>
              <MenuItem value="Lainnya">Lainnya</MenuItem>
            </TextField>
            <TextField
              label="Kontak"
              value={newContact.contact_value}
              onChange={(e) =>
                setNewContact({ ...newContact, contact_value: e.target.value })
              }
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} sx={{ textTransform: "none" }}>
              Batal
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "20px", textTransform: "none" }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Simpan"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
