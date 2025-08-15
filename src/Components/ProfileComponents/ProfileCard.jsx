import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CircularProgress,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LanguageList from "./LanguageList";
import SkillList from "./SkillList";
import ExperienceList from "./ExperienceList";
import CertificateList from "./CertificateList";
import ProjectList from "./ProjectList";
import UserPostPage from "./UserPostPage";
import ModalProfileCard from "./ModalProfileCard";

export default function ProfileCard({
  user_id,
  isOwner,
  onEditClickSection,
  onEditProfileClick,
}) {
  const [profileData, setProfileData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState(null);

  const navigate = useNavigate();

  const handleViewAllClickSection = (section) => {
    setModalSection(section);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalSection(null);
  };

  // Fetch profile + contact
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      try {
        if (!token) throw new Error("Token tidak ditemukan.");
        const url = `https://rutee.id/dapur/profile/get-profile.php?user_id=${encodeURIComponent(
          user_id
        )}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.profile) {
          setProfileData(response.data.profile);
          if (response.data.profile.contact) {
            setContactData(response.data.profile.contact);
          }
        } else throw new Error("Data profil tidak ditemukan.");
      } catch (err) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    }

    if (user_id) fetchProfile();
    else {
      setError("User ID tidak valid");
      setLoading(false);
    }
  }, [user_id]);

  if (loading)
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
        <Typography mt={2} color="text.secondary" fontStyle="italic">
          Memuat profil...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={6} fontWeight="medium">
        {error}
      </Typography>
    );

  if (!profileData) return null;

  const renderSectionHeader = (title, section) => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={1.5}
      pt={1}
    >
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
      {isOwner ? (
        <Button
          size="small"
          variant="text"
          onClick={() => onEditClickSection && onEditClickSection(section)}
        >
          <EditOutlinedIcon fontSize="small" />
        </Button>
      ) : (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleViewAllClickSection(section)}
        >
          Lihat Semua
        </Button>
      )}
    </Box>
  );

  return (
    <Box>
      <Card
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mt: 5,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* Kolom kiri: Data Diri */}
          <Box
            sx={{
              flexBasis: 320,
              flexShrink: 0,
              pr: { md: 4 },
              order: { xs: 2, md: 1 },
            }}
          >
            <Box mb={2}>
              {renderSectionHeader("Bahasa", "languages")}
              <LanguageList limit={2} user_id={user_id} />
            </Box>
            <Box mb={2}>
              {renderSectionHeader("Keahlian", "skills")}
              <SkillList limit={2} user_id={user_id} />
            </Box>
            <Box mb={2}>
              {renderSectionHeader("Pengalaman", "experiences")}
              <ExperienceList limit={2} user_id={user_id} />
            </Box>
            <Box mb={2}>
              {renderSectionHeader("Sertifikat", "certificates")}
              <CertificateList limit={2} user_id={user_id} />
            </Box>
            <Box mb={2}>
              {renderSectionHeader("Proyek", "projects")}
              <ProjectList limit={2} user_id={user_id} />
            </Box>
          </Box>

          {/* Kolom kanan: Cover + Profil + Postingan */}
          <Box sx={{ flex: 1, order: { xs: 1, md: 2 } }}>
            <Box sx={{ position: "relative", mb: 10 }}>
              {profileData.cover_image_url ? (
                <Box
                  component="img"
                  src={profileData.cover_image_url}
                  alt="Cover"
                  sx={{
                    width: "100%",
                    height: { xs: 180, sm: 220, md: 280 },
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)",
                  }}
                />
              ) : (
                <Box
                  height={{ xs: 180, sm: 220, md: 280 }}
                  bgcolor="grey.300"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius={3}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Tidak ada gambar cover
                  </Typography>
                </Box>
              )}

              <Avatar
                src={profileData.profile_image_url}
                alt={profileData.name || profileData.username}
                sx={{
                  width: { xs: 120, sm: 140, md: 160 },
                  height: { xs: 120, sm: 140, md: 160 },
                  border: "5px solid white",
                  bgcolor: "grey.400",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  position: "absolute",
                  bottom: -60,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              />
            </Box>

            <Box sx={{ textAlign: "center", mb: 4, px: { xs: 1, md: 0 } }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="text.primary"
                noWrap
                mb={2}
              >
                {profileData.name || profileData.username}
              </Typography>

              {profileData.bio && (
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ whiteSpace: "pre-line", mb: 1, px: { xs: 1, md: 0 } }}
                >
                  {profileData.bio}
                </Typography>
              )}
              {profileData.country && (
                <Typography
                  variant="body2"
                  color="text.secondary.dark"
                  mb={2}
                  sx={{ px: { xs: 1, md: 0 } }}
                >
                  {profileData.city} {profileData.province},{" "}
                  {profileData.country}
                </Typography>
              )}
              {/* Bagian tombol Contact Info */}
              <Box mb={2}>
                {isOwner ? (
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() =>
                      onEditClickSection && onEditClickSection("contacts")
                    }
                    sx={{ textTransform: "none" }}
                  >
                    Edit Contact Info
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewAllClickSection("contact")}
                    sx={{ textTransform: "none" }}
                  >
                    Lihat Contact Info
                  </Button>
                )}
              </Box>

              {isOwner && onEditProfileClick && (
                <Button
                  variant="contained"
                  size="medium"
                  onClick={onEditProfileClick}
                  sx={{
                    textTransform: "none",
                    px: 5,
                    mb: { xs: 2, md: 0 },
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  Edit Profil
                </Button>
              )}
            </Box>

            <Box>
              <UserPostPage limit={2} user_id={user_id} />
              <Box textAlign="center" mt={2}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/user-post")}
                  sx={{ textTransform: "none" }}
                >
                  Lihat Semua Post
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Modal */}
      <ModalProfileCard
        open={modalOpen}
        onClose={handleCloseModal}
        section={modalSection}
        user_id={user_id}
        contactData={contactData}
      />
    </Box>
  );
}
