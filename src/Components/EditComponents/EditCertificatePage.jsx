import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Paper,
  IconButton,
  Typography,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";

export default function EditCertificatePage() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: "",
    type: "certificates",
    name: "",
    issued_by: "",
    issue_date: null,
    description: "",
    certificate_url: "",
    image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, [token]);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
        "https://rutee.id/dapur/profile/edit-certificate.php",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertificates(res.data.certificates || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setForm({ ...form, image_url: "" });
  };

  const uploadImage = async (file, id) => {
    if (!file) return form.image_url || null; // Kalau tidak ada file baru, pakai yang lama

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "certificates");
    formData.append("id", id); // ID wajib saat edit

    const res = await axios.post(
      "https://rutee.id/dapur/profile/upload-image.php",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.file_url;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let certificateId = form.id;
      let imageUrl = form.image_url;

      if (!editing) {
        // Tambah data baru → buat record untuk dapat ID
        const createRes = await axios.post(
          "https://rutee.id/dapur/profile/edit-certificate.php",
          {
            ...form,
            issue_date:
              form.issue_date && dayjs(form.issue_date).isValid()
                ? dayjs(form.issue_date).format("YYYY-MM-DD")
                : null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!createRes.data.id) {
          throw new Error("Gagal membuat sertifikat, ID tidak ditemukan");
        }
        certificateId = createRes.data.id;
      }

      // Upload gambar hanya jika ada file baru
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, certificateId);
      }

      // Update data
      await axios.put(
        "https://rutee.id/dapur/profile/edit-certificate.php",
        {
          ...form,
          id: certificateId,
          image_url: imageUrl,
          issue_date:
            form.issue_date && dayjs(form.issue_date).isValid()
              ? dayjs(form.issue_date).format("YYYY-MM-DD")
              : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Data berhasil ${editing ? "diperbarui" : "ditambahkan"}!`);
      fetchCertificates();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cert) => {
    setEditing(true);
    setForm({
      ...cert,
      id: cert.id, // Pastikan ID ikut terset
      issue_date: cert.issue_date ? dayjs(cert.issue_date) : null,
    });
    setImageFile(null);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus data ini?")) return;
    try {
      await axios.delete(
        "https://rutee.id/dapur/profile/edit-certificate.php",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { id },
        }
      );
      alert("Data dihapus");
      fetchCertificates();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  const handleOpenModalAdd = () => {
    setEditing(false);
    setForm({
      id: "",
      type: "certificates",
      name: "",
      issued_by: "",
      issue_date: null,
      description: "",
      certificate_url: "",
      image_url: "",
    });
    setImageFile(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setImageFile(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        sx={{
          maxWidth: 800,
          margin: "auto",
          padding: 3,
          mt: 4,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Daftar Sertifiat</Typography>
          <IconButton
            color="primary"
            onClick={handleOpenModalAdd}
            sx={{ border: "1px solid ", borderRadius: 2 }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {certificates.length === 0 ? (
          <Typography mt={2}>Tidak ada data</Typography>
        ) : (
          certificates.map((cert) => (
            <Paper
              key={cert.id}
              sx={{
                p: 2,
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                {cert.image_url && (
                  <img
                    src={cert.image_url}
                    alt={cert.name}
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                )}
                <Box>
                  <Typography fontWeight="bold">{cert.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cert.issued_by} —{" "}
                    {cert.issue_date
                      ? dayjs(cert.issue_date).format("DD/MM/YYYY")
                      : ""}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleEdit(cert)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(cert.id)}
                >
                  Hapus
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Paper>

      {/* Modal Form */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: 500,
            maxHeight: "90vh",
            overflowY: "auto",
            p: 3,
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <Typography variant="h6" mb={2}>
            {editing ? "Edit Data" : "Tambah Data"}
          </Typography>

          {/* Upload Gambar */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {imageFile || form.image_url ? (
              <Box position="relative" display="inline-block">
                <img
                  src={
                    imageFile ? URL.createObjectURL(imageFile) : form.image_url
                  }
                  alt="Preview"
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    minWidth: "auto",
                    padding: "2px 6px",
                    fontSize: 10,
                  }}
                >
                  X
                </Button>
              </Box>
            ) : null}
            <IconButton color="primary" component="label">
              <PhotoCameraIcon />
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileChange}
              />
            </IconButton>
          </Box>

          <TextField
            label="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Diterbitkan Oleh"
            value={form.issued_by}
            onChange={(e) => setForm({ ...form, issued_by: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <DatePicker
            label="Tanggal Terbit"
            value={form.issue_date}
            onChange={(newValue) =>
              setForm({
                ...form,
                issue_date:
                  newValue && dayjs(newValue).isValid() ? newValue : null,
              })
            }
            format="DD/MM/YYYY"
            slotProps={{
              textField: { fullWidth: true },
            }}
          />
          <TextField
            label="Deskripsi"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="URL"
            value={form.certificate_url}
            onChange={(e) =>
              setForm({ ...form, certificate_url: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />

          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Simpan"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCloseModal}
              fullWidth
            >
              Batal
            </Button>
          </Box>
        </Paper>
      </Modal>
    </LocalizationProvider>
  );
}
