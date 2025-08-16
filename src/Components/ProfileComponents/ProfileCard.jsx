// src/components/Profile/ProfileCard.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CircularProgress,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../Context/AuthContext";
import LanguageList from "./LanguageList";
import SkillList from "./SkillList";
import ExperienceList from "./ExperienceList";
import CertificateList from "./CertificateList";
import ProjectList from "./ProjectList";

import FollowTogglePage from "../ButtonComponents/FollowTogglePage";
import BlockTogglePage from "../ButtonComponents/BlockTogglePage";
import FollowerCount from "./FollowerCount";

export default function ProfileCard({ user_id }) {
  const { user_id: authUserId } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setProfileData(response.data.profile);
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
          {/* Cover + Avatar */}
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

          {/* Nama + Bio */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="text.primary"
              mb={1}
            >
              {profileData.name || profileData.username}
            </Typography>

            {profileData.bio && (
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ whiteSpace: "pre-line", mb: 1 }}
              >
                {profileData.bio}
              </Typography>
            )}
          </Box>

          {/* Tombol Aksi di bawah profil */}
          <Box
            mt={2} // jarak dari nama/bio
            display="flex"
            flexDirection="column" // vertikal
            alignItems="center" // center secara horizontal
            gap={1.5} // jarak antar tombol
          >
            <FollowerCount targetUserId={user_id} />

            {isOwner ? (
              <Button
                variant="contained"
                onClick={() => navigate("/profile/edit")}
              >
                Edit Profil
              </Button>
            ) : (
              <>
                <FollowTogglePage
                  currentUserId={authUserId}
                  targetUserId={user_id}
                />
                <BlockTogglePage
                  currentUserId={authUserId}
                  blockedId={user_id}
                />
              </>
            )}
          </Box>

          {/* Info Lain */}
          <Box mb={2}>
            {renderSectionHeader("Bahasa", "languages")}
            <LanguageList limit={2} user_id={user_id} readOnly />
          </Box>
          <Box mb={2}>
            {renderSectionHeader("Keahlian", "skills")}
            <SkillList limit={2} user_id={user_id} readOnly />
          </Box>
          <Box mb={2}>
            {renderSectionHeader("Pengalaman", "experiences")}
            <ExperienceList limit={1} user_id={user_id} readOnly />
          </Box>
          <Box mb={2}>
            {renderSectionHeader("Sertifikat", "certificates")}
            <CertificateList limit={1} user_id={user_id} readOnly />
          </Box>
          <Box mb={2}>
            {renderSectionHeader("Proyek", "projects")}
            <ProjectList limit={1} user_id={user_id} readOnly />
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
