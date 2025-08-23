import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import axios from "axios";
import API from "../Config/API";
import { useAuth } from "../Context/AuthContext";
import FeatureButton from "../Components/FeatureButton";

export default function CareerRecommendations() {
  const { token, personalityResult } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCareers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(API.CAREERS, { headers }); // 🔹 pakai dari config
      setData(Array.isArray(res.data.data) ? res.data.data : [res.data.data]);
    } catch (err) {
      console.error("❌ Error fetchCareers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCareers();
    } else if (personalityResult) {
      setData(
        Array.isArray(personalityResult)
          ? personalityResult
          : [personalityResult]
      );
    }
  }, [token, personalityResult]);

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (!data || data.length === 0)
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No personality result found</Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 5 } }}>
      {data.map((block, idx) => (
        <Box key={idx} sx={{ mb: 10 }}>
          {/* ===== Personality Detail ===== */}
          {block.personality_detail && (
            <Card
              sx={{
                mb: 6,
                borderRadius: 4,
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {block.image_url && (
                    <Box
                      component="img"
                      src={block.image_url}
                      alt={block.personality_detail.type}
                      sx={{
                        width: "100%",
                        maxWidth: 150,
                        height: "auto",
                        borderRadius: 3,
                        bgcolor: "grey.50",
                        p: 1,
                        mb: 3,
                      }}
                    />
                  )}

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: "primary.dark" }}
                  >
                    {block.personality_detail.type}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {block.personality_detail.description}
                  </Typography>

                  {block.personality_detail.strengths && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Strengths:</strong>{" "}
                      {block.personality_detail.strengths}
                    </Typography>
                  )}

                  {block.personality_detail.weaknesses && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Weaknesses:</strong>{" "}
                      {block.personality_detail.weaknesses}
                    </Typography>
                  )}

                  {block.personality_detail.suitable_roles && (
                    <Typography variant="body2">
                      <strong>Suitable Roles:</strong>{" "}
                      {block.personality_detail.suitable_roles}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* ===== Career Recommendations ===== */}
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "primary.main", mb: 3 }}
          >
            Recommended Careers for {block.type}
          </Typography>

          <Grid container spacing={4}>
            {(block.recommendations || []).map((rec, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  component="a"
                  href={rec.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            display: "block",
                            color: "text.primary",
                          }}
                        >
                          {rec.career}
                        </Typography>
                      </Box>

                      <Chip
                        label={rec.trait}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2, alignSelf: "flex-start" }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 6 }} />
        </Box>
      ))}

      <FeatureButton />
    </Box>
  );
}
