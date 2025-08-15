import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

export default function ExperienceList({ limit, useDebug, user_id }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user_id) {
      setLoading(false);
      setExperiences([]);
      return;
    }

    axios
      .get(
        `https://rutee.id/dapur/profile/get-profile.php?user_id=${user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const exps = Array.isArray(res.data.experiences)
          ? res.data.experiences
          : [];
        exps.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        setExperiences(limit ? exps.slice(0, limit) : exps);
      })
      .catch((err) => {
        setErrorMsg(
          err.response?.data?.error ||
            err.message ||
            `Server error (${err.response?.status})`
        );
      })
      .finally(() => setLoading(false));
  }, [user_id, useDebug, limit]);

  // Grup berdasarkan perusahaan
  const grouped = experiences.reduce((acc, exp) => {
    (acc[exp.company_name] = acc[exp.company_name] || []).push(exp);
    return acc;
  }, {});

  return (
    <Card sx={{ mb: 3, maxWidth: 700, mx: "auto" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ({experiences.length}) Pengalaman
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        ) : errorMsg ? (
          <Typography color="error">Error: {errorMsg}</Typography>
        ) : experiences.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Belum ada data pengalaman kerja.
          </Typography>
        ) : (
          Object.entries(grouped).map(([company, exps]) => (
            <Box key={company} sx={{ mb: 4, position: "relative" }}>
              {/* Header Perusahaan */}
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                  {company?.[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight="600">
                  {company}
                </Typography>
              </Box>

              <Box sx={{ position: "relative", pl: 5 }}>
                {exps.map((exp, idx) => (
                  <Box
                    key={exp.id || idx}
                    sx={{
                      mb: idx !== exps.length - 1 ? 3 : 0,
                      position: "relative",
                      paddingBottom: idx !== exps.length - 1 ? 3 : 0,
                    }}
                  >
                    {/* Dot */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: -30,
                        top: 10,
                        width: 10,
                        height: 10,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                        zIndex: 2,
                      }}
                    />

                    {/* Garis vertikal yang menempel ke dot */}
                    {idx !== exps.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: -26.9, // tepat di tengah dot (10px dot + 2px garis)
                          top: 10, // mulai tepat dari atas dot
                          height: "100%",
                          bgcolor: "primary.main",
                          width: 2,
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Konten */}
                    <Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        alignItems="center"
                      >
                        <Typography variant="subtitle1" fontWeight="500">
                          {exp.position}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {dayjs(exp.start_date).format("DD MMM YYYY")} –{" "}
                          {exp.still_working
                            ? "Sekarang"
                            : exp.end_date
                            ? dayjs(exp.end_date).format("DD MMM YYYY")
                            : ""}
                        </Typography>
                      </Box>

                      {exp.description && (
                        <Typography variant="body2" mt={0.5}>
                          {exp.description}
                        </Typography>
                      )}

                      {exp.proof_url && (
                        <Typography
                          component="a"
                          href={exp.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="caption"
                          color="primary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Lihat Bukti
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ mt: 3 }} />
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
}
