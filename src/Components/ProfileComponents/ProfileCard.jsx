import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../Context/AuthContext"; // ✅ pakai AuthContext
import LanguageList from "./LanguageList";
import SkillList from "./SkillList";
import ExperienceList from "./ExperienceList";
import CertificateList from "./CertificateList";
import ProjectList from "./ProjectList";
import UserPostPage from "./UserPostPage";

export default function ProfileCard({ user_id }) {
  const { user_id: authUserId } = useAuth(); // ✅ id user yang login
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch profile
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

  // ✅ render header dengan cek owner via AuthContext
  // ...import dan state tetap sama

  // ✅ render header dengan cek owner via AuthContext
  const renderSectionHeader = (title, section) => {
    const isOwner = authUserId === user_id;

    // Owner langsung ke halaman edit, bukan lihat semua
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
          variant="outlined"
          onClick={() => navigate(navigateTo)}
          sx={{ textTransform: "none" }}
        >
          {isOwner ? (
            <Box display="flex" alignItems="center" gap={0.5}>
              <span className="material-icons">Edit</span>
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
            </Box>

            <Box>
              <UserPostPage limit={1} user_id={user_id} />
              <Box textAlign="center" mt={2}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/user-post/${user_id}`)}
                  sx={{ textTransform: "none" }}
                >
                  Lihat Semua Post
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
