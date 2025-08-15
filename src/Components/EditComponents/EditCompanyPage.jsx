import React, { useState, useEffect } from "react";
import { Box, Button, TextField, CircularProgress, Paper } from "@mui/material";
import axios from "axios";

export default function EditCompanyPage({ companyId, onSaved }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState({
    name: "",
    industry: "",
    location: "",
    website: "",
  });

  // Ambil data awal perusahaan
  useEffect(() => {
    if (!companyId) return;
    axios
      .get(`https://rutee.id/dapur/profile/get-company.php?id=${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data || {};
        setCompany({
          name: data.name || "",
          industry: data.industry || "",
          location: data.location || "",
          website: data.website || "",
        });
      })
      .catch((err) => console.error(err));
  }, [companyId, token]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://rutee.id/dapur/profile/edit-company.php",
        {
          id: companyId,
          ...company,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Perusahaan berhasil diperbarui!");
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perusahaan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nama Perusahaan"
          value={company.name}
          onChange={(e) => setCompany({ ...company, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Industri"
          value={company.industry}
          onChange={(e) => setCompany({ ...company, industry: e.target.value })}
          fullWidth
        />
        <TextField
          label="Lokasi"
          value={company.location}
          onChange={(e) => setCompany({ ...company, location: e.target.value })}
          fullWidth
        />
        <TextField
          label="Website"
          value={company.website}
          onChange={(e) => setCompany({ ...company, website: e.target.value })}
          fullWidth
        />

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
