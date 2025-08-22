import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Avatar,
  TextField,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import API from "../../Config/API";

import { careerOptions as careerOptionsList } from "./EditProfileCareers";

export default function EditProfile() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [careerOptions, setCareerOptions] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    gender: "",
    birthdate: null,
    country: "",
    province: "",
    city: "",
    profile_image_url: "",
    cover_image_url: "",
    career: [],
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  // Ambil profile user
  useEffect(() => {
    if (!token) return;

    axios
      .get(API.PROFILE_GET, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.profile || {};
        setProfile({
          ...profile,
          name: data.name || "",
          bio: data.bio || "",
          gender: data.gender || "",
          birthdate:
            data.birthdate && dayjs(data.birthdate).isValid()
              ? dayjs(data.birthdate)
              : null,
          country: data.country || "",
          province: data.province || "",
          city: data.city || "",
          profile_image_url: data.profile_image_url || "",
          cover_image_url: data.cover_image_url || "",
          career: data.career
            ? Array.isArray(data.career)
              ? data.career
              : [data.career]
            : [],
        });
      })
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setCareerOptions(careerOptionsList);
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "profile") setProfileImageFile(file);
    else setCoverImageFile(file);
  };

  const uploadImage = async (file, type) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    const res = await axios.post(API.PROFILE_UPLOAD_IMAGE, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.file_url;
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      let profileImageUrl = profile.profile_image_url;
      let coverImageUrl = profile.cover_image_url;

      if (profileImageFile)
        profileImageUrl = await uploadImage(profileImageFile, "profile");
      if (coverImageFile)
        coverImageUrl = await uploadImage(coverImageFile, "cover");

      await axios.post(
        API.PROFILE_EDIT_PROFILE,
        {
          ...profile,
          career: profile.career.join(", "), // kirim sebagai string
          profile_image_url: profileImageUrl,
          cover_image_url: coverImageUrl,
          birthdate:
            profile.birthdate && dayjs(profile.birthdate).isValid()
              ? dayjs(profile.birthdate).format("YYYY-MM-DD")
              : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        sx={{
          maxWidth: 800,
          margin: "auto",
          padding: 3,
          mt: 4,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        {/* Cover & Avatar */}
        <Box
          sx={{
            height: 200,
            backgroundImage: `url(${
              coverImageFile
                ? URL.createObjectURL(coverImageFile)
                : profile.cover_image_url
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            position: "relative",
            mb: 8,
          }}
        >
          <IconButton
            color="primary"
            component="label"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          >
            <PhotoCameraIcon />
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => handleFileChange(e, "cover")}
            />
          </IconButton>

          <Avatar
            src={
              profileImageFile
                ? URL.createObjectURL(profileImageFile)
                : profile.profile_image_url
            }
            sx={{
              width: 120,
              height: 120,
              position: "absolute",
              bottom: -60,
              left: 20,
              border: "4px solid white",
            }}
          />
          <IconButton
            color="primary"
            component="label"
            sx={{
              position: "absolute",
              bottom: -50,
              left: 120,
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          >
            <PhotoCameraIcon />
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => handleFileChange(e, "profile")}
            />
          </IconButton>
        </Box>

        {/* Form */}
        <Box display="flex" flexDirection="column" gap={2} mt={4}>
          <TextField
            label="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Professional Summary"
            multiline
            rows={3}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            fullWidth
          />
          <TextField
            label="Gender"
            select
            value={profile.gender}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
            <option value="other">Lainnya</option>
          </TextField>

          <DatePicker
            label="Birth date"
            value={profile.birthdate}
            onChange={(newValue) =>
              setProfile({
                ...profile,
                birthdate:
                  newValue && dayjs(newValue).isValid() ? newValue : null,
              })
            }
            format="DD/MM/YYYY"
            slotProps={{ textField: { fullWidth: true, error: false } }}
          />

          <TextField
            label="Country"
            value={profile.country}
            onChange={(e) =>
              setProfile({ ...profile, country: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Province"
            value={profile.province}
            onChange={(e) =>
              setProfile({ ...profile, province: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="City"
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            fullWidth
          />

          <Autocomplete
            multiple
            freeSolo
            filterSelectedOptions
            options={careerOptions}
            value={profile.career}
            onChange={(event, newValue) => {
              const filtered = newValue.slice(0, 2);
              setProfile((prev) => ({ ...prev, career: filtered }));
              filtered.forEach((val) => {
                if (!careerOptions.includes(val)) {
                  setCareerOptions((prev) => [...prev, val]);
                }
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Careers (maks 2)"
                placeholder="Type and select or enter career"
                fullWidth
              />
            )}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Save Change"}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
