import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";

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

export default function EditProjectPage() {
  const token = localStorage.getItem("token");
  const API_URL = "https://rutee.id/dapur/profile/edit-project.php";
  const UPLOAD_URL = "https://rutee.id/dapur/profile/upload-image.php";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [project, setProject] = useState(defaultProject);
  const addButtonRef = useRef(null);

  const fetchProjects = () => {
    setLoading(true);
    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProjects(res.data.projects || []))
      .catch((err) => console.error("Gagal fetch projects:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchProjects(), []);

  const handleOpenAdd = () => {
    setProject(defaultProject);
    setOpenModal(true);
  };
  const handleOpenEdit = (item) => {
    setProject({ ...defaultProject, ...item });
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => addButtonRef.current?.focus(), 0);
  };
  const handleDelete = (id) => {
    if (!window.confirm("Yakin mau hapus project ini?")) return;
    setLoading(true);
    axios
      .delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      })
      .then(() => fetchProjects())
      .catch((err) => console.error("Gagal hapus project:", err))
      .finally(() => setLoading(false));
  };
  const handleSave = () => {
    if (
      !(project.title || "").trim() ||
      !(project.role || "").trim() ||
      !(project.start_date || "").trim()
    ) {
      alert("Judul, Role, dan Tanggal Mulai wajib diisi");
      return;
    }

    const payload = {
      ...project,
      title: (project.title || "").trim(),
      role: (project.role || "").trim(),
      company: (project.company || "").trim() || null,
      image_url: project.image_url || null,
      start_date: (project.start_date || "").trim(),
      end_date: project.still_on_project
        ? null
        : (project.end_date || "").trim() || null,
      still_on_project: project.still_on_project ? 1 : 0,
      description: (project.description || "").trim() || null,
      skills: (project.skills || "").trim() || null,
      proof_url: (project.proof_url || "").trim() || null,
    };

    setLoading(true);
    const request = project.id
      ? axios.put(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
    request
      .then(() => {
        handleCloseModal();
        setProject(defaultProject);
        fetchProjects();
      })
      .catch((err) => {
        console.error("Gagal simpan project:", err);
        alert("Gagal menyimpan project. Cek console untuk detail.");
      })
      .finally(() => setLoading(false));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Tipe file tidak didukung (jpg, jpeg, png)");
      return;
    }

    if (!project.id) {
      alert(
        "Project belum tersimpan. Simpan project dulu sebelum upload gambar."
      );
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "project");
    formData.append("id", project.id);
    formData.append("action", "update");

    try {
      const res = await axios.post(UPLOAD_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.file_url) {
        setProject((prev) => ({ ...prev, image_url: res.data.file_url }));
      } else {
        alert("Upload gagal, coba lagi.");
      }
    } catch (err) {
      console.error("Gagal upload gambar:", err.response?.data || err.message);
      alert("Gagal upload gambar. Cek console untuk detail.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Daftar Proyek
        </Typography>
        <Button
          ref={addButtonRef}
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{ textTransform: "none" }}
        >
          Tambah Project
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : projects.length === 0 ? (
        <Typography>Belum ada proyek.</Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          gap={3}
        >
          {projects.map((p) => (
            <Paper
              key={p.id}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              {p.image_url && (
                <Avatar
                  src={p.image_url}
                  variant="square"
                  sx={{ width: "100%", height: 140, mb: 2, borderRadius: 2 }}
                />
              )}
              <Typography variant="h6" fontWeight="600" mb={0.5}>
                {p.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {p.role} | {p.start_date} -{" "}
                {p.still_on_project ? "Sekarang" : p.end_date || "-"}
              </Typography>
              {p.company && (
                <Typography variant="body2" color="primary" mb={1}>
                  {p.company}
                </Typography>
              )}
              {p.skills && (
                <Box mb={1}>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    fontWeight={500}
                  >
                    Skills:
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {p.skills}
                  </Typography>
                </Box>
              )}
              {p.description && (
                <Typography variant="body2" mb={1}>
                  {p.description}
                </Typography>
              )}
              {p.proof_url && (
                <Typography
                  variant="body2"
                  color="primary"
                  component="a"
                  href={p.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  mb={1}
                >
                  Lihat Bukti
                </Typography>
              )}
              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <IconButton color="primary" onClick={() => handleOpenEdit(p)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(p.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        disableEnforceFocus
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {project.id ? "Edit Project" : "Tambah Project"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Judul Proyek"
            value={project.title || ""}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Nama Perusahaan / Klien"
            value={project.company || ""}
            onChange={(e) =>
              setProject({ ...project, company: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Peran / Role"
            value={project.role || ""}
            onChange={(e) => setProject({ ...project, role: e.target.value })}
            fullWidth
          />
          <TextField
            label="Skill yang Digunakan (pisahkan dengan koma)"
            value={project.skills || ""}
            onChange={(e) => setProject({ ...project, skills: e.target.value })}
            fullWidth
          />

          {/* Upload Image */}
          <Box>
            <Typography variant="body2" fontWeight="500">
              Logo / Gambar Project
            </Typography>
            {project.image_url && (
              <Box mb={1}>
                <Avatar
                  src={project.image_url}
                  variant="square"
                  sx={{ width: 64, height: 64 }}
                />
              </Box>
            )}
            <Button
              variant="outlined"
              component="label"
              disabled={uploadingImage}
            >
              {uploadingImage ? "Mengunggah..." : "Pilih Gambar"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
          </Box>

          <TextField
            type="date"
            label="Mulai"
            value={project.start_date || ""}
            onChange={(e) =>
              setProject({ ...project, start_date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            type="date"
            label="Selesai"
            value={project.end_date || ""}
            onChange={(e) =>
              setProject({ ...project, end_date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled={project.still_on_project}
          />
          <TextField
            label="Deskripsi"
            multiline
            rows={3}
            value={project.description || ""}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="URL Bukti"
            value={project.proof_url || ""}
            onChange={(e) =>
              setProject({ ...project, proof_url: e.target.value })
            }
            fullWidth
          />

          <Box display="flex" alignItems="center">
            <input
              type="checkbox"
              checked={project.still_on_project}
              onChange={(e) =>
                setProject({
                  ...project,
                  still_on_project: e.target.checked,
                  end_date: e.target.checked ? "" : project.end_date,
                })
              }
            />
            <Typography ml={1}>Masih mengerjakan proyek ini</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Batal</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
