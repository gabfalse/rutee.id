import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Link as MLink,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

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
          const arr = Array.isArray(res.data?.contacts)
            ? res.data.contacts
            : [];
          setContacts(arr);
        }
      } catch (err) {
        console.error(err);
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

  const list = limit ? contacts.slice(0, limit) : contacts;

  return (
    <Card sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ({contacts.length}) Kontak
        </Typography>

        {loading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : contacts.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Belum ada data kontak.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {list.map((c, i) => (
              <Box key={i}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {c.contact_type || "-"}
                </Typography>
                {c.contact_value ? (
                  c.contact_value.startsWith("http") ||
                  c.contact_value.includes("@") ? (
                    <MLink
                      href={
                        c.contact_value.startsWith("http")
                          ? c.contact_value
                          : `mailto:${c.contact_value}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {c.contact_value}
                    </MLink>
                  ) : (
                    <Typography variant="body2">{c.contact_value}</Typography>
                  )
                ) : (
                  <Typography variant="body2">-</Typography>
                )}

                <Box
                  sx={{ mt: 0.5, display: "flex", gap: 1, flexWrap: "wrap" }}
                >
                  {c.created_at && (
                    <Chip
                      size="small"
                      label={`Dibuat: ${dayjs(c.created_at).format(
                        "DD MMM YYYY"
                      )}`}
                    />
                  )}
                  {c.updated_at && (
                    <Chip
                      size="small"
                      label={`Update: ${dayjs(c.updated_at).format(
                        "DD MMM YYYY"
                      )}`}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
