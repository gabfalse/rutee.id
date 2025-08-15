import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import axios from "axios";

export default function ContactList({ limit, user_id }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!user_id) {
      setContacts([]);
      setLoading(false);
      setError("User ID tidak tersedia.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token tidak tersedia. Silakan login ulang.");
      setLoading(false);
      return;
    }

    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `https://rutee.id/dapur/profile/get-profile.php?user_id=${encodeURIComponent(
            user_id
          )}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (isMounted) {
          if (res.data && Array.isArray(res.data.contacts)) {
            setContacts(res.data.contacts);
          } else if (res.data && Array.isArray(res.data.contact)) {
            // fallback jika backend masih pakai 'contact'
            setContacts(res.data.contact);
          } else {
            setContacts([]);
            console.warn("Properti contact tidak ditemukan atau bukan array.");
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data kontak:", err);
        if (isMounted) {
          setError("Gagal memuat data kontak.");
          setContacts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchContacts();

    return () => {
      isMounted = false;
    };
  }, [user_id]);

  const displayedContacts = limit ? contacts.slice(0, limit) : contacts;

  // Warna tombol berdasarkan tipe kontak
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
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 400,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        ({contacts.length}) Kontak
      </Typography>

      {loading ? (
        <Box textAlign="center" py={2}>
          <CircularProgress size={24} />
          <Typography mt={1} fontStyle="italic">
            Memuat kontak...
          </Typography>
        </Box>
      ) : error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : displayedContacts.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Belum ada kontak.
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1}>
          {displayedContacts.map((c, idx) => (
            <Button
              key={idx}
              variant="contained"
              color={getButtonColor(c.contact_type)}
              sx={{ borderRadius: 2, textTransform: "none", py: 1.5 }}
              href={
                c.contact_value.startsWith("http") ? c.contact_value : undefined
              }
              target="_blank"
            >
              {c.contact_type}: {c.contact_value}
            </Button>
          ))}
        </Box>
      )}
    </Paper>
  );
}
