import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  Button,
  Dialog,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../Context/AuthContext";
import LanguageList from "./LanguageList";
import SkillList from "./SkillList";
import ExperienceList from "./ExperienceList";
import CertificateList from "./CertificateList";
import ProjectList from "./ProjectList";
import EducationList from "./EducationList";
import ContactList from "./ContactList";
import FollowTogglePage from "../ButtonComponents/FollowTogglePage";
import FollowerCount from "./FollowerCount";

export default function ProfileCard({ user_id }) {
  const { user_id: authUserId } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openImage, setOpenImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);

  const navigate = useNavigate();
  const isOwner = authUserId === user_id;

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan.");

        const url = `https://rutee.id/dapur/profile/get-profile.php?user_id=${encodeURIComponent(
          user_id
        )}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.profile) {
          const profileWithPersonality = {
            ...response.data.profile,
            personality: response.data.personality ?? null,
          };
          setProfileData(profileWithPersonality);
        } else {
          throw new Error("Data profil tidak ditemukan.");
        }
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

  // ================== Menu Handlers ==================
  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleEditProfile = () => {
    navigate("/profile/edit");
    handleMenuClose();
  };

  const handleArticleProfile = () => {
    if (isOwner) {
      navigate("/articles/owned");
    } else {
      navigate(`/articles/user/${user_id}`);
    }
    handleMenuClose();
  };

  const handleCheckResume = () => {
    navigate(`/resume/${user_id}`);
    handleMenuClose();
  };

  const handleContacts = () => {
    navigate(isOwner ? "/edit-contacts" : `/contacts/${user_id}`);
    handleMenuClose();
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Tautan profil disalin ke clipboard!");
    handleMenuClose();
  };

  const renderSectionHeader = (title, section) => {
    const navigateTo = isOwner ? `/edit-${section}` : `/${section}/${user_id}`;
    return (
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

        <Button
          size="small"
          onClick={() => navigate(navigateTo)}
          sx={{ textTransform: "none" }}
        >
          {isOwner ? (
            <Box display="flex" alignItems="center" gap={0.5}>
              <EditIcon fontSize="small" />
            </Box>
          ) : (
            "Lihat Semua"
          )}
        </Button>
      </Box>
    );
  };

  // ================== Personality Chip Style ==================
  const getPersonalityColor = (type) => {
    switch (type) {
      case "Fire":
        return "error";
      case "Water":
        return "info";
      case "Earth":
        return "success";
      case "Air":
        return "primary";
      default:
        return "secondary";
    }
  };

  return (
    <Box>
      <Card
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: 5,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
        }}
      >
        <Box>
          {/* Cover + Avatar + Menu Titik Tiga */}
          <Box sx={{ position: "relative", mb: 10 }}>
            {/* Tombol titik tiga */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                position: "absolute",
                bgcolor: "secondary.main",
                top: 8,
                right: 8,
                zIndex: 20,
              }}
            >
              <MoreVertIcon />
            </IconButton>

            {/* Menu Dropdown */}
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {isOwner && (
                <MenuItem onClick={handleEditProfile}>Edit Profil</MenuItem>
              )}
              <MenuItem onClick={handleArticleProfile}>
                {isOwner ? "Artikel Saya" : "Artikel " + profileData.name}
              </MenuItem>
              {isOwner && (
                <MenuItem onClick={handleCheckResume}>Cek Resume</MenuItem>
              )}
              <MenuItem onClick={handleContacts}>
                {isOwner ? "Edit Kontak" : "Lihat Kontak"}
              </MenuItem>
              <MenuItem onClick={handleShareProfile}>
                <ShareIcon fontSize="small" sx={{ mr: 1 }} /> Bagikan Profil
              </MenuItem>
            </Menu>

            {/* Cover */}
            {profileData.cover_image_url ? (
              <Box
                component="img"
                src={profileData.cover_image_url}
                alt="Cover"
                onClick={() => {
                  setImageUrl(profileData.cover_image_url);
                  setOpenImage(true);
                }}
                sx={{
                  width: "100%",
                  height: { xs: 180, sm: 220, md: 280 },
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)",
                  cursor: "pointer",
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
                <Typography variant="h6" color="text.secondary">
                  Tidak ada gambar cover
                </Typography>
              </Box>
            )}

            {/* Avatar */}
            <Avatar
              src={profileData.profile_image_url}
              alt={profileData.name || profileData.username}
              onClick={() => {
                if (profileData.profile_image_url) {
                  setImageUrl(profileData.profile_image_url);
                  setOpenImage(true);
                }
              }}
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
                cursor: profileData.profile_image_url ? "pointer" : "default",
              }}
            />
          </Box>

          {/* Nama + Personality + Bio */}
          <Box sx={{ textAlign: "center", mb: 3, mt: 5 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                {profileData.name || profileData.username}
              </Typography>
            </Box>
            <Box>
              {profileData.personality?.type && (
                <Chip
                  label={profileData.personality.type}
                  color="primary"
                  variant="containded"
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                    height: "20px",
                    borderRadius: "6px",
                  }}
                />
              )}
            </Box>

            {profileData.career && (
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {profileData.career}
              </Typography>
            )}
            {profileData.bio && (
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ whiteSpace: "pre-line", mt: 1 }}
              >
                {profileData.bio}
              </Typography>
            )}
          </Box>

          {/* Follower / Follow */}
          <Box
            mt={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1.5}
          >
            <FollowerCount targetUserId={user_id} />
            {!isOwner && (
              <FollowTogglePage
                currentUserId={authUserId}
                targetUserId={user_id}
              />
            )}
          </Box>

          {/* Sections */}
          <Box mb={2}>{renderSectionHeader("Bahasa", "languages")}</Box>
          <LanguageList limit={2} user_id={user_id} readOnly />

          <Box mb={2}>{renderSectionHeader("Keahlian", "skills")}</Box>
          <SkillList limit={2} user_id={user_id} readOnly />

          <Box mb={2}>{renderSectionHeader("Pendidikan", "educations")}</Box>
          <EducationList limit={3} userId={user_id} readOnly />

          <Box mb={2}>{renderSectionHeader("Pengalaman", "experiences")}</Box>
          <ExperienceList limit={1} user_id={user_id} readOnly />

          <Box mb={2}>{renderSectionHeader("Sertifikat", "certificates")}</Box>
          <CertificateList limit={1} user_id={user_id} readOnly />

          <Box mb={2}>{renderSectionHeader("Proyek", "projects")}</Box>
          <ProjectList limit={1} user_id={user_id} readOnly />
        </Box>
      </Card>

      {/* Modal Preview Gambar */}
      <Dialog open={openImage} onClose={() => setOpenImage(false)} fullScreen>
        <IconButton
          onClick={() => setOpenImage(false)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          component="img"
          src={imageUrl}
          alt="Preview"
          sx={{
            width: "100%",
            height: "100%",
            maxHeight: "100vh",
            objectFit: "contain",
          }}
        />
      </Dialog>
    </Box>
  );
}
