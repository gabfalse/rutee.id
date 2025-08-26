import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionsEN from "../Components/QuizComponents/Question"; // English
import QuestionsID from "../Components/QuizComponents/QuestionId"; // Indonesia
import {
  Box,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import { Male, Female } from "@mui/icons-material";
import { useAuth } from "../Context/AuthContext";

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const QuizPage = () => {
  const { user, loading, personalityResult } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [quizStarted, setQuizStarted] = useState(false);
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("en"); // default English
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);

  // ===== Redirect jika sudah ada hasil tes =====
  useEffect(() => {
    if (!loading && personalityResult) {
      navigate("/result");
    }
  }, [personalityResult, loading, navigate]);

  const startQuiz = () => {
    const Questions = language === "id" ? QuestionsID : QuestionsEN;

    const qShuffled = shuffleArray(
      Questions.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }))
    );
    setShuffledQuestions(qShuffled);
    setAnswers(Array(qShuffled.length).fill(null));
    setCurrent(0);
    setQuizStarted(true);
  };

  const handleSelect = (idx) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);

    if (current < shuffledQuestions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      navigate("/calculate", {
        state: { answers: updated, gender, language, shuffledQuestions },
      });
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ===== Tampilan sebelum quiz dimulai =====
  if (!quizStarted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          px: 3,
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {language === "id" ? "Temukan Dirimu" : "Find Your True Self"}
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {language === "id"
            ? "Jawab pertanyaan dengan jujur"
            : "Answer the question with honesty"}
        </Typography>

        <Divider sx={{ my: 2, width: "100%" }}>
          {language === "id" ? "Pilih Bahasa" : "Choose Language"}
        </Divider>
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant={language === "id" ? "contained" : "outlined"}
            onClick={() => setLanguage("id")}
            color="primary"
          >
            Indonesia
          </Button>
          <Button
            variant={language === "en" ? "contained" : "outlined"}
            onClick={() => setLanguage("en")}
            color="primary"
          >
            English
          </Button>
        </Stack>

        <Divider sx={{ my: 2, width: "100%" }}>
          {language === "id" ? "Pilih Jenis Kelamin" : "Choose Your Gender"}
        </Divider>
        <Stack direction="row" spacing={2} mb={3}>
          <Button
            startIcon={<Male />}
            variant={gender === "male" ? "contained" : "outlined"}
            onClick={() => setGender("male")}
            color="primary"
          >
            {language === "id" ? "Laki-laki" : "Male"}
          </Button>
          <Button
            startIcon={<Female />}
            variant={gender === "female" ? "contained" : "outlined"}
            onClick={() => setGender("female")}
            color="primary"
          >
            {language === "id" ? "Perempuan" : "Female"}
          </Button>
        </Stack>

        <Button
          variant="contained"
          size="large"
          onClick={startQuiz}
          disabled={!gender}
          sx={{ mb: 2 }}
        >
          {language === "id" ? "Mulai Tes" : "Take the Test"}
        </Button>

        {personalityResult && (
          <Button
            variant="text"
            onClick={() => navigate("/result")}
            sx={{ mt: 1 }}
          >
            {language === "id" ? "Lihat Hasil" : "View Result"}
          </Button>
        )}
      </Box>
    );
  }

  // Guard untuk mencegah undefined
  const q = shuffledQuestions[current];
  if (!q) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        px: 2,
        py: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 700,
          width: "100%",
          p: 4,
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Box sx={{ textAlign: "left", mb: 2 }}>
          <Button
            onClick={handlePrev}
            variant="outlined"
            color="primary"
            size="small"
            disabled={current === 0}
          >
            {language === "id" ? "Pertanyaan Sebelumnya" : "Previous Question"}
          </Button>
        </Box>

        <Typography variant="h6" color="primary" gutterBottom>
          {language === "id"
            ? `Pertanyaan ${current + 1} dari ${shuffledQuestions.length}`
            : `Question ${current + 1} of ${shuffledQuestions.length}`}
        </Typography>
        <Typography fontWeight={600} fontSize="1.15rem" mb={3}>
          {q.question}
        </Typography>

        <Stack spacing={1} component="ul" sx={{ listStyle: "none", p: 0 }}>
          {q.options.map((opt, idx) => {
            const isSelected = answers[current] === idx;
            return (
              <Box
                key={idx}
                component="li"
                onClick={() => handleSelect(idx)}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: isSelected ? "bold" : "normal",
                  border: "2px solid",
                  borderColor: isSelected
                    ? theme.palette.primary.main
                    : theme.palette.divider,
                  backgroundColor: isSelected ? "#fff" : "transparent",
                  color: isSelected
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? "#f0f0f0"
                      : theme.palette.action.hover,
                  },
                }}
              >
                {opt.text}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default QuizPage;
