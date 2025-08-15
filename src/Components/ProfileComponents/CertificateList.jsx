import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import axios from "axios";

export default function CertificateList({ limit, user_id }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user_id) {
      console.warn("⚠ Token atau user_id belum tersedia, hentikan request.");
      setLoading(false);
      setCertificates([]);
      return;
    }

    axios
      .get(
        `https://rutee.id/dapur/profile/get-profile.php?user_id=${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (Array.isArray(res.data.certificates)) {
          setCertificates(res.data.certificates);
        } else {
          setCertificates([]);
        }
      })
      .catch((err) => {
        console.error("❌ Gagal memuat sertifikat:", err);
        if (err.response) {
          setErrorMsg(
            err.response.data?.error || `Server error (${err.response.status})`
          );
        } else {
          setErrorMsg(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [user_id]);

  const displayedCertificates = limit
    ? certificates.slice(0, limit)
    : certificates;

  return (
    <Card sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ({certificates.length}) Sertifikat
        </Typography>

        {loading ? (
          <Typography color="text.secondary">Memuat...</Typography>
        ) : errorMsg ? (
          <Typography color="error">Error: {errorMsg}</Typography>
        ) : certificates.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Belum ada data sertifikat.
          </Typography>
        ) : (
          <List dense>
            {displayedCertificates.map((cert, index) => (
              <ListItem
                key={cert.id || index}
                sx={{ border: "1px solid", borderColor: "divider", mb: 2 }}
              >
                <ListItemText
                  primary={`${cert.name} (${cert.issued_by})`}
                  secondary={
                    <>
                      Terbit: {cert.issue_date}
                      <br />
                      {cert.certificate_url && (
                        <Link
                          href={cert.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ ml: 1 }}
                        >
                          Lihat Sertifikat
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
