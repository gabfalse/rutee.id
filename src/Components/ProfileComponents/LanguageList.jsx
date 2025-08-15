import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function levelToSymbol(level) {
  switch ((level || "").toLowerCase()) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "fluent":
      return "Fluent";
    case "native":
      return "Native";
    default:
      return level || "-";
  }
}

export default function LanguageList({ limit, user_id }) {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true; // flag untuk cleanup

    if (!user_id) {
      setLanguages([]);
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

    const fetchLanguages = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `https://rutee.id/dapur/profile/get-profile.php?user_id=${encodeURIComponent(
            user_id
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          if (res.data && Array.isArray(res.data.languages)) {
            setLanguages(res.data.languages);
            setError("");
          } else {
            setLanguages([]);
            setError("");
            console.warn(
              "Properti languages tidak ditemukan atau bukan array."
            );
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data bahasa:", err);
        if (isMounted) {
          setError("Gagal memuat data bahasa.");
          setLanguages([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLanguages();

    return () => {
      isMounted = false; // cleanup untuk hindari setState setelah unmount
    };
  }, [user_id]);

  const displayedLanguages = limit ? languages.slice(0, limit) : languages;

  return (
    <Card sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
      <CardContent variant="outlined">
        <Typography variant="h6" gutterBottom>
          ({languages.length}) Bahasa
        </Typography>

        {loading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : languages.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Belum ada data bahasa.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {displayedLanguages.map((lang, idx) => (
              <Chip
                key={idx}
                label={`${lang.language || "-"} (${levelToSymbol(lang.level)})`}
                sx={{ color: "secondary", backgroundColor: "primary.dark" }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
