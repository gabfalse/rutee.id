import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import Navbar from "../Navbar";

const ResultPage = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [typeDetail, setTypeDetail] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!token) return;

      try {
        const resResult = await axios.get(
          "https://rutee.id/dapur/personality/personality-results.php",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (!resResult.data.success || !resResult.data.data) {
          setLoading(false);
          return;
        }

        const userResult = resResult.data.data;
        setResult(userResult);

        const resType = await axios.get(
          `https://rutee.id/dapur/personality/personality-type.php?type=${encodeURIComponent(
            userResult.type
          )}`
        );

        if (resType.data.success && resType.data.data) {
          setTypeDetail(resType.data.data);
        }
      } catch (error) {
        console.error("[DEBUG] Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [token]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!result || !typeDetail) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6" color="textSecondary">
          No personality data yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 5, px: 3, pb: 5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Your Personality Result
        </Typography>

        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            mt: 3,
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems={{ xs: "center", md: "flex-start" }}
            gap={4}
          >
            {/* Gambar personality */}
            {result.image_url && (
              <Box
                flexShrink={0}
                sx={{
                  position: "relative",
                  width: 220,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src={result.image_url}
                  alt={typeDetail.type}
                  style={{
                    width: "100%",
                    display: "block",
                  }}
                />
                {/* Nama kepribadian di atas foto */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    bgcolor: "secondary.main",
                    color: "primary.main",
                    textAlign: "center",
                    py: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {typeDetail.type}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Detail personality */}
            <Box flex={1}>
              {typeDetail.description && (
                <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
                  <strong>{user?.display_name}</strong> is{" "}
                  {typeDetail.description}
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />

              {typeDetail.strengths && (
                <Box mt={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Strength
                  </Typography>
                  <Typography variant="body2">
                    {typeDetail.strengths}
                  </Typography>
                </Box>
              )}

              {typeDetail.weaknesses && (
                <Box mt={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Weakness
                  </Typography>
                  <Typography variant="body2">
                    {typeDetail.weaknesses}
                  </Typography>
                </Box>
              )}

              {typeDetail.suitable_roles && (
                <Box mt={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Suitable roles:
                  </Typography>
                  <Typography variant="body2">
                    {typeDetail.suitable_roles}
                  </Typography>
                </Box>
              )}

              <Box mt={3}>
                <Typography variant="caption" color="textSecondary">
                  Result saved on{" "}
                  {new Date(result.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ResultPage;
