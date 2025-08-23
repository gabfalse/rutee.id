import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

export default function JobListPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 15;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("https://rutee.id/dapur/api/jobs.php");
      const jobsData = res.data.data || [];
      setJobs(jobsData);
    } catch (err) {
      console.error("❌ Error fetching jobs:", err);
      setError(err.message || "Terjadi kesalahan saat memuat lowongan kerja.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2} color="text.secondary">
          Loading Jobs...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  if (!jobs.length)
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="text.secondary">
          There are no job postings yet
        </Typography>
      </Box>
    );

  return (
    <Box>
      <Navbar />
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: { xs: 2, sm: 3 } }}>
        {/* Tombol Kembali */}
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back
        </Button>

        <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
          Job Listings
        </Typography>

        <Stack spacing={2}>
          {currentJobs.map((job, idx) => (
            <Paper
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              {/* LEFT: Logo + Job info */}
              <Box
                sx={{ display: "flex", alignItems: "center", flex: 1, gap: 2 }}
              >
                {job.company_image || job.logo || job.company_logo ? (
                  <Avatar
                    src={job.company_image || job.logo || job.company_logo}
                    alt={job.company}
                    variant="rounded"
                    sx={{ width: 64, height: 64 }}
                  />
                ) : (
                  <Avatar
                    alt={job.company}
                    variant="rounded"
                    sx={{ width: 64, height: 64, bgcolor: "primary.light" }}
                  >
                    {job.company?.charAt(0)}
                  </Avatar>
                )}
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.company} • {job.location}
                  </Typography>
                  {job.posted_time && (
                    <Typography variant="body2" color="text.secondary">
                      Posted {job.posted_time} • Source: {job.source}
                    </Typography>
                  )}
                  {job.skills?.length > 0 && (
                    <Box
                      sx={{
                        mt: 0.5,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {job.skills.map((skill, i) => (
                        <Chip key={i} label={skill} size="small" />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* RIGHT: Apply button */}
              <Button
                variant="contained"
                onClick={() => window.open(job.link, "_blank")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  ml: 2,
                  flexShrink: 0,
                }}
              >
                View
              </Button>
            </Paper>
          ))}
        </Stack>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}
          >
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Typography variant="body2" sx={{ alignSelf: "center" }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
}
