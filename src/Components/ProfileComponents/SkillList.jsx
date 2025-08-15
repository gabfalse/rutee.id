import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function SkillList({ limit, user_id }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage

    if (!token || !user_id) {
      console.warn("⚠ Token atau user_id belum tersedia, hentikan request.");
      setLoading(false);
      setErrorMsg("Token atau user_id tidak tersedia");
      setSkills([]);
      return;
    }

    axios
      .get(
        `https://rutee.id/dapur/profile/get-profile.php?user_id=${encodeURIComponent(
          user_id
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.skills && Array.isArray(res.data.skills)) {
          setSkills(res.data.skills);
          setErrorMsg(null);
        } else {
          setSkills([]);
          setErrorMsg(null);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat skill:", err);
        setErrorMsg(
          err.response?.data?.error || err.message || "Gagal memuat skill"
        );
        setSkills([]);
      })
      .finally(() => setLoading(false));
  }, [user_id]);

  const displayedSkills = limit ? skills.slice(0, limit) : skills;

  return (
    <Card sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ({skills.length}) Skills
        </Typography>

        {loading ? (
          <CircularProgress size={24} />
        ) : errorMsg ? (
          <Typography color="error">{errorMsg}</Typography>
        ) : skills.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Belum ada data skill.
          </Typography>
        ) : (
          <List dense>
            {displayedSkills.map((skill, idx) => (
              <ListItem key={idx} divider>
                <ListItemText
                  primary={skill.skill_name || skill.name || "-"}
                  secondary={
                    <>
                      {skill.level
                        ? `Level: ${skill.level}`
                        : "Level tidak tersedia"}
                      {skill.proof_url && (
                        <Link
                          href={skill.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mr: 1 }}
                        >
                          Proof
                        </Link>
                      )}
                      {skill.certificate_url && (
                        <Link
                          href={skill.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Certificate
                        </Link>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
