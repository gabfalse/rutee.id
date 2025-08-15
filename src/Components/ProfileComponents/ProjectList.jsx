import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function ProjectList({ limit, user_id }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user_id) {
      console.warn("⚠ Token atau user_id belum tersedia, hentikan request.");
      setLoading(false);
      setErrorMsg("Token atau user_id tidak tersedia");
      setProjects([]);
      return;
    }

    axios
      .get(
        `https://rutee.id/dapur/profile/get-profile.php?user_id=${encodeURIComponent(
          user_id
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (Array.isArray(res.data.projects)) {
          setProjects(res.data.projects);
          setErrorMsg(null);
        } else {
          setProjects([]);
          setErrorMsg(null);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat project:", err);
        setErrorMsg(
          err.response?.data?.error || err.message || "Gagal memuat project"
        );
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, [user_id]);

  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <Card sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ({projects.length}) Projects
        </Typography>

        {loading ? (
          <CircularProgress size={24} />
        ) : errorMsg ? (
          <Typography color="error">{errorMsg}</Typography>
        ) : projects.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Belum ada data project.
          </Typography>
        ) : (
          displayedProjects.map((proj, idx) => {
            const title = proj.role || "-";
            const description = proj.description || "-";
            const imageUrl = proj.proof_url || "";
            // Jika API nanti punya link_url dan collaborators, bisa ditambah di sini

            return (
              <Box
                key={proj.id || idx}
                mb={2}
                p={2}
                border="1px solid"
                borderColor="divider"
                boxShadow={1}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" mb={1}>
                  {description}
                </Typography>
                {imageUrl && (
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={title + " image"}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 150,
                      objectFit: "contain",
                      mb: 1,
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
