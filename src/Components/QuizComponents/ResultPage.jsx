import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import API from "../../Config/API";
import Navbar from "../Navbar";
import html2canvas from "html2canvas";

const ResultPage = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [typeDetail, setTypeDetail] = useState(null);
  const [lang, setLang] = useState("en"); // 'en' atau 'id'

  const paperRef = useRef(null); // untuk screenshot

  const fetchTypeDetail = async (type, language = "en") => {
    try {
      const resType = await axios.get(
        `${API.PERSONALITY_TYPE}?type=${encodeURIComponent(
          type
        )}&lang=${language}`
      );
      if (resType.data?.success && resType.data?.data) {
        setTypeDetail(resType.data.data);
      } else {
        setTypeDetail(null);
      }
    } catch (err) {
      console.error("❌ Error fetching personality type:", err);
      setTypeDetail(null);
    }
  };

  const fetchResult = async (language = "en") => {
    if (!token) return;
    setLoading(true);
    try {
      const resResult = await axios.get(API.PERSONALITY_RESULTS, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userResult = resResult.data?.data;
      if (!resResult.data?.success || !userResult) {
        setResult(null);
        setTypeDetail(null);
        return;
      }

      setResult(userResult);
      await fetchTypeDetail(userResult.type, language);
    } catch (err) {
      console.error("❌ Error fetching personality result:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult(lang);
  }, [token, lang]);

  const handleDownloadPNG = async () => {
    if (!paperRef.current) return;

    try {
      const canvas = await html2canvas(paperRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = `${user?.display_name || "personality"}_result.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("❌ Error generating PNG:", err);
    }
  };

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

        {/* Tombol ganti bahasa */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Button
            variant={lang === "en" ? "contained" : "outlined"}
            onClick={() => setLang("en")}
          >
            English
          </Button>
          <Button
            variant={lang === "id" ? "contained" : "outlined"}
            onClick={() => setLang("id")}
          >
            Bahasa Indonesia
          </Button>
        </Stack>

        <Paper
          ref={paperRef}
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
            gap={4}
          >
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
                  style={{ width: "100%", display: "block" }}
                />
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

            <Box flex={1}>
              {typeDetail.description && (
                <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
                  <strong>{user?.display_name}</strong> {typeDetail.description}
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

          {/* Tombol download PNG */}
          <Box mt={4} display="flex" justifyContent="center">
            <Button variant="contained" onClick={handleDownloadPNG}>
              Download as PNG
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ResultPage;
