import React, { useState } from "react";
import { Box, Button, TextField, Paper, CircularProgress } from "@mui/material";

// Ekspor careerOptions tanpa duplikat
export const careerOptions = Array.from(
  new Set([
    // Developer & IT
    "Software Developer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Mobile App Developer",
    "Game Developer",
    "AI Engineer",
    "Machine Learning Specialist",
    "Data Scientist",
    "Data Analyst",
    "DevOps Engineer",
    "Cloud Engineer",
    "Cybersecurity Specialist",
    "Blockchain Developer",
    "Blockchain Consultant",
    "NFT Artist",
    "Crypto Trader", // pastikan hanya 1 kali
    "IT Support",
    "System Administrator",
    "Network Engineer",

    // Design
    "UI/UX Designer",
    "Graphic Designer",
    "Motion Designer",
    "Animator",
    "Video Editor",
    "Photographer",
    "Illustrator",
    "Product Designer",
    "Interior Designer",
    "Fashion Designer",

    // Content & Media
    "Content Writer",
    "Copywriter",
    "Technical Writer",
    "Blogger",
    "Journalist",
    "Editor",
    "Social Media Manager",
    "Digital Marketing Specialist",
    "SEO Specialist",
    "Content Strategist",
    "Influencer Marketing Specialist",
    "Podcaster",
    "Streamer",
    "YouTuber",
    "Vlogger",

    // Education & Training
    "Online Tutor",
    "Language Teacher Online",
    "Music Teacher Online",
    "Art Teacher Online",
    "Course Creator",
    "Instructional Designer",
    "Corporate Trainer",
    "Coach / Mentor",
    "Researcher Online",

    // Business & Management
    "Project Manager",
    "Product Manager",
    "Business Analyst",
    "Business Development Manager",
    "Customer Success Manager",
    "Brand Manager",
    "Operations Manager",
    "HR Consultant (Remote)",
    "Finance Consultant Online",
    "Legal Consultant Online",
    "Entrepreneur",
    "Startup Founder",

    // Sales & Marketing
    "Sales Executive",
    "Affiliate Marketer",
    "E-commerce Manager",
    "Marketing Analyst",
    "Event Organizer",
    "PR Specialist",
    "Community Manager",
    "Advertising Specialist",
    "Growth Hacker",

    // Freelance & Remote
    "Freelance Consultant",
    "Virtual Assistant",
    "Transcriptionist",
    "Translator",
    "Voice Actor",
    "Remote Customer Support",
    "Online Moderator",
    "Online Researcher",
    "Freelance Photographer",
    "Freelance Videographer",

    // Finance & Crypto
    "Accountant",
    "Financial Analyst",
    "Investment Analyst",
    "Trader",
    "Fintech Consultant",

    // Health & Wellness
    "Nutritionist Online",
    "Fitness Coach Online",
    "Yoga Instructor Online",
    "Therapist Online",
    "Counselor Online",
    "Life Coach Online",

    // Miscellaneous
    "Travel Blogger",
    "Event Planner",
    "Interior Decorator",
    "Pet Trainer Online",
    "Game Tester",
    "App Tester",
    "Mystery Shopper",
    "Product Reviewer",
    "Voiceover Artist",
    "Music Producer Online",
  ])
);

export default function EditProfileCareer() {
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Karir berhasil disimpan: " + career);
    }, 1000);
  };

  return (
    <Paper sx={{ maxWidth: 800, margin: "auto", padding: 3, mt: 4 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Pilih Karir"
          select
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          SelectProps={{ native: true }}
          fullWidth
        >
          <option value="">-- Pilih Karir --</option>
          {careerOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </TextField>

        <TextField
          label="Atau isi sendiri"
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Simpan Karir"}
        </Button>
      </Box>
    </Paper>
  );
}
