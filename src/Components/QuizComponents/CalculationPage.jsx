import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const CalculationPage = () => {
  const { user, token, personalityResult } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [progressText, setProgressText] = useState(
    "⏳ Memproses hasil kuis..."
  );

  const answers = location.state?.answers;
  const gender = location.state?.gender;
  const shuffledQuestions = location.state?.shuffledQuestions;

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const processResult = async () => {
    if (personalityResult) {
      setProgressText("✅ Anda sudah pernah tes. Mengarahkan ke hasil...");
      await delay(1000);
      navigate("/result");
      return;
    }

    if (!user?.id || !answers || !gender || !shuffledQuestions) {
      setProgressText("❌ Data tidak lengkap. Silakan ulangi kuis.");
      return;
    }

    if (!token) {
      setProgressText("❌ Token tidak tersedia. Silakan login ulang.");
      return;
    }

    try {
      setProgressText("🔍 Menganalisis tipe kepribadian...");
      await delay(1000);

      // Hitung skor berdasarkan type
      const scoreMap = {};
      answers.forEach((ans, idx) => {
        const selected = shuffledQuestions[idx]?.options[ans];
        if (!selected) return;
        const type = selected.type;
        scoreMap[type] = (scoreMap[type] || 0) + 1;
      });

      const sorted = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]);
      const finalType = sorted[0]?.[0];
      if (!finalType) throw new Error("Gagal menentukan tipe kepribadian.");

      setProgressText("💾 Menyimpan hasil...");
      await delay(1000);

      let imageUrl =
        gender?.toLowerCase() === "female"
          ? `https://rutee.id/images/personality-female/${finalType}.png`
          : `https://rutee.id/images/personality/${finalType}.png`;

      const payload = {
        type: finalType,
        image_url: imageUrl,
        gender,
      };

      const save = await axios.post(
        "https://rutee.id/dapur/personality/personality-results.php",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (!save.data?.success)
        throw new Error(save.data?.error || "Gagal menyimpan hasil.");

      navigate("/result");
    } catch (err) {
      console.error("ERROR:", err.message);
      setProgressText("⚠️ Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    processResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, personalityResult]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "radial-gradient(circle at top, #1a1a2e, #121212)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        px: 3,
      }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        style={{
          border: "6px solid #ffffff33",
          borderTop: "6px solid #00f0ff",
          borderRadius: "50%",
          width: 60,
          height: 60,
          marginBottom: 24,
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          fontSize={{ xs: 16, md: 20 }}
          textAlign="center"
          sx={{ maxWidth: 400 }}
        >
          <AutoAwesomeIcon
            fontSize="small"
            sx={{ color: "primary.main", mr: 1 }}
          />
          {progressText}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default CalculationPage;
