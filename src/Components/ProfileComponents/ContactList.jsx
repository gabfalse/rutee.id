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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useParams } from "react-router-dom";

const defaultContact = {
  id: "",
  contact_type: "",
  contact_value: "",
};

const ContactList = ({ userId: propUserId, readOnly = false, limit }) => {
  const { token, user } = useAuth();
  const { user_id: paramUserId } = useParams();
  const loggedInUserId = user?.id; // ambil dari AuthContext
  const userId = propUserId || paramUserId || loggedInUserId;

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultContact);
  const [isOwner, setIsOwner] = useState(false);

  const fetchContacts = async () => {
    if (!token) return;
    try {
      setLoading(true);

      const url = userId
        ? `https://rutee.id/dapur/profile/edit-contact.php?user_id=${userId}`
        : `https://rutee.id/dapur/profile/edit-contact.php`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = res.data.contacts || [];
      if (limit) data = data.slice(0, limit);
      setContacts(data);

      // cek owner dari backend
      if (typeof res.data.is_owner !== "undefined") {
        setIsOwner(res.data.is_owner);
      } else {
        setIsOwner(!readOnly && String(userId) === String(loggedInUserId));
      }
    } catch (err) {
      console.error(
        "❌ Error fetch contacts:",
        err.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token, limit]);

  const handleSave = async () => {
    if (!token) return;
    try {
      const method = form.id ? "put" : "post";
      await axios[method](
        `https://rutee.id/dapur/profile/edit-contact.php`,
        { ...form }, // user_id sengaja tidak dikirim (backend pakai token)
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setForm(defaultContact);
      fetchContacts();
    } catch (err) {
      console.error(
        "❌ Error save contact:",
        err.response || err.message || err
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus kontak ini?")) return;
    if (!token) return;

    try {
      await axios.delete(`https://rutee.id/dapur/profile/edit-contact.php`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }, // user_id sengaja tidak dikirim
      });
      fetchContacts();
    } catch (err) {
      console.error(
        "❌ Error delete contact:",
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
          Contacts
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setForm(defaultContact);
              setOpenDialog(true);
            }}
          >
            Add
          </Button>
        )}
      </Box>

      {contacts.length === 0 ? (
        <Typography color="text.secondary" fontStyle="italic">
          No contact yet
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1}>
          {contacts.map((c) => (
            <Paper
              key={c.id}
              sx={{
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography fontWeight="bold">{c.contact_type}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.contact_value}
                </Typography>
              </Box>
              {isOwner && (
                <Box display="flex" gap={1} mt={{ xs: 1, sm: 0 }}>
                  <Tooltip title="Edit">
                    <Edit
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setForm({ ...c });
                        setOpenDialog(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Delete
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDelete(c.id)}
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
        <DialogTitle>{form.id ? "Edit Contact" : "Add Contact"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Contact type (ex: Email, WhatsApp, Instagram)"
            fullWidth
            value={form.contact_type}
            onChange={(e) => setForm({ ...form, contact_type: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contact"
            fullWidth
            value={form.contact_value}
            onChange={(e) =>
              setForm({ ...form, contact_value: e.target.value })
            }
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

export default ContactList;
