import {
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const personalityData = [
  {
    type: "SOLARIETH",
    nickname: "Visionary & Strategic",
  },
  { type: "VARNETH", nickname: "Analytical & Detail-Oriented" },
  {
    type: "NIVARETH",
    nickname: "Collaborative & Empathetic",
  },
  { type: "ZERYTH", nickname: "Principled & High Integrity" },
  {
    type: "AERYTH",
    nickname: "Creative & Innovative",
  },
  { type: "THARITH", nickname: "Stable & Diligent" },
  { type: "ELARITH", nickname: "Adaptive & Flexible" },
  { type: "LUNARETH", nickname: "Independent & Proactive" },
];

const PersonalityCarousel = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    swipeToSlide: true,
  };

  const handleClick = () => {
    navigate("/quiz");
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
        pt: 4,
        pb: 6,
        px: { xs: 2, sm: 4 },
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Check Your Personality Type Now!
      </Typography>

      <Slider {...settings}>
        {personalityData.map(({ type, nickname }) => (
          <Box key={type} sx={{ px: 1 }}>
            <Card
              sx={{
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: 3,
                mx: "auto",
                maxWidth: "90vh",
                px: 3,
                py: 4,
                textAlign: "center",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
              >
                ARE YOU {type}?
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 3, px: { xs: 1, sm: 6 } }}
              >
                {nickname}
              </Typography>

              <CardMedia
                component="img"
                image={`https://rutee.id/images/personality/${type}.png?${new Date().getTime()}`}
                alt={type}
                sx={{
                  width: "100%",
                  height: { xs: "50vh", sm: 320 },
                  objectFit: "contain",
                  mb: 3,
                }}
              />
              <Button
                onClick={handleClick}
                variant="contained"
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: 3,
                  px: 6,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Ikuti Tes
              </Button>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PersonalityCarousel;
