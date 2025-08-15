import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import LanguageList from "./LanguageList";
import SkillList from "./SkillList";
import ExperienceList from "./ExperienceList";
import CertificateList from "./CertificateList";
import ProjectList from "./ProjectList";

import axios from "axios";

export default function ModalProfileCard({ open, onClose, section, user_id }) {
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    const fetchContacts = async () => {
      if (section !== "contact") return;

      if (!user_id) {
        setError("User ID tidak tersedia.");
        setContactData([]);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak tersedia. Silakan login ulang.");
        setContactData([]);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `https://rutee.id/dapur/profile/get-profile.php?user_id=${encodeURIComponent(
            user_id
          )}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (isMounted) {
          if (res.data && Array.isArray(res.data.contacts)) {
            setContactData(res.data.contacts);
          } else if (res.data && Array.isArray(res.data.contact)) {
            setContactData(res.data.contact);
          } else {
            setContactData([]);
            console.warn("Properti contact tidak ditemukan atau bukan array.");
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data kontak:", err);
        if (isMounted) {
          setError("Gagal memuat data kontak.");
          setContactData([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchContacts();

    return () => {
      isMounted = false;
    };
  }, [open, section, user_id]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {section?.toUpperCase() || "DETAIL"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {section === "languages" && <LanguageList user_id={user_id} />}
        {section === "skills" && <SkillList user_id={user_id} />}
        {section === "experiences" && <ExperienceList user_id={user_id} />}
        {section === "certificates" && <CertificateList user_id={user_id} />}
        {section === "projects" && <ProjectList user_id={user_id} />}
        {section === "contact" && (
          <Box>
            {loading && (
              <Box textAlign="center" py={2}>
                <CircularProgress />
                <Typography mt={1} fontStyle="italic">
                  Memuat kontak...
                </Typography>
              </Box>
            )}
            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}
            {!loading && !error && contactData.length === 0 && (
              <Typography color="text.secondary" textAlign="center">
                Belum ada kontak.
              </Typography>
            )}
            {!loading && !error && contactData.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {contactData.map((c, idx) => (
                  <Typography key={c.id || idx}>
                    {c.contact_type}:{" "}
                    {["website", "linkedin"].includes(
                      c.contact_type.toLowerCase()
                    ) ? (
                      <a
                        href={c.contact_value}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {c.contact_value}
                      </a>
                    ) : (
                      c.contact_value
                    )}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
