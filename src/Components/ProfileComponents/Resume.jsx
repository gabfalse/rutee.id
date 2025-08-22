// src/pages/Resume.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Divider, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import API from "../../Config/API";

const Resume = () => {
  const { user_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API.PROFILE_GET}?user_id=${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user_id, token]);

  const handleDownloadPDF = () => {
    if (!resumeRef.current) return;
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(resumeRef.current, {
      callback: function (pdf) {
        const fileName = `resume - ${data?.profile?.name || "user"}.pdf`;
        pdf.save(fileName);
      },
      x: 20,
      y: 20,
      width: 555,
      html2canvas: { scale: 0.9 },
    });
  };

  if (loading) return <CircularProgress />;
  if (!data) return <p>Error loading resume</p>;

  const {
    profile,
    contacts,
    educations,
    languages,
    skills,
    experiences,
    projects,
  } = data;

  const contactLine = contacts?.length
    ? contacts
        .map((c) => {
          const isEmail = c.contact_value.includes("@");
          return (
            <span key={c.contact_value}>
              {isEmail ? (
                <a href={`mailto:${c.contact_value}`}>{c.contact_value}</a>
              ) : c.contact_value.startsWith("http") ? (
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
            </span>
          );
        })
        .reduce(
          (prev, curr) => (prev.length === 0 ? [curr] : [...prev, " | ", curr]),
          []
        )
    : null;

  return (
    <Box
      p={3}
      sx={{
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
        color: "#000",
      }}
    >
      <Button
        onClick={handleDownloadPDF}
        sx={{
          mb: 2,
          backgroundColor: "black",
          color: "white",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        Download PDF
      </Button>

      <Box ref={resumeRef} sx={{ maxWidth: "595px", margin: "0 auto" }}>
        <style>{`
          .resume-template, .resume-template * {
            color: #000 !important;
            background-color: #fff !important;
            border-color: #000 !important;
            font-family: Arial, sans-serif !important;
            font-size: 12px !important;
          }
          .resume-template a { text-decoration: none !important; color: #000 !important; }
          .resume-template a[href^="mailto"] { color: #0066cc !important; }
          .resume-template .proof-url { color: blue !important; }
        `}</style>

        <Box className="resume-template">
          {/* Header: Name */}
          <header style={{ textAlign: "center", marginBottom: "16px" }}>
            <h1
              style={{
                fontSize: "70px",
                fontWeight: "bold",
                margin: "0 0 4px 0",
                lineHeight: "1.1",
              }}
            >
              {profile?.name}
            </h1>

            {contactLine && (
              <p style={{ fontSize: "12px", margin: 0 }}>{contactLine}</p>
            )}

            {profile?.city && profile?.province && profile?.country && (
              <p style={{ fontSize: "12px", margin: 0 }}>
                {profile.city}, {profile.province}, {profile.country}
              </p>
            )}
          </header>

          {profile?.bio && (
            <section>
              <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>
                Professional Summary
              </h2>
              <Divider sx={{ my: 0.5 }} />
              <p style={{ fontSize: "12px" }}>{profile.bio}</p>
            </section>
          )}

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Experiences */}
            {experiences?.length > 0 && (
              <section>
                <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Experience
                </h2>
                <Divider sx={{ my: 0.5 }} />
                {experiences.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: "8px" }}>
                    <p style={{ fontWeight: "bold", margin: 0 }}>
                      {exp.position} | {exp.company_name}
                    </p>
                    <p style={{ fontSize: "12px", margin: "0 0 2px 0" }}>
                      {exp.start_date} -{" "}
                      {exp.still_working ? "Present" : exp.end_date}
                    </p>
                    <p style={{ fontSize: "12px", margin: 0 }}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {educations?.length > 0 && (
              <section>
                <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Education
                </h2>
                <Divider sx={{ my: 0.5 }} />
                {educations.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: "8px" }}>
                    <p style={{ fontWeight: "bold", margin: 0 }}>
                      {edu.institution}
                    </p>
                    <p style={{ fontSize: "12px", margin: 0 }}>
                      {edu.major} | {edu.start_year} -{" "}
                      {edu.still_study ? "Present" : edu.end_year}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
              <section>
                <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Projects
                </h2>
                <Divider sx={{ my: 0.5 }} />
                {projects.map((p, idx) => (
                  <div key={idx} style={{ marginBottom: "8px" }}>
                    <p style={{ fontWeight: "bold", margin: 0 }}>
                      {p.title} {p.company ? `| ${p.company}` : ""}
                    </p>
                    {p.role && (
                      <p style={{ fontSize: "12px", margin: 0 }}>{p.role}</p>
                    )}
                    <p style={{ fontSize: "12px", margin: 0 }}>
                      {p.start_date} -{" "}
                      {p.still_on_project ? "Present" : p.end_date}
                    </p>
                    {p.description && (
                      <p style={{ fontSize: "12px", margin: 0 }}>
                        {p.description}
                      </p>
                    )}
                    {p.skills && (
                      <p style={{ fontSize: "12px", margin: 0 }}>
                        Skills: {p.skills}
                      </p>
                    )}
                    {p.proof_url && (
                      <p
                        className="proof-url"
                        style={{ fontSize: "12px", margin: 0 }}
                      >
                        {p.proof_url}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
              <section>
                <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>Skills</h2>
                <Divider sx={{ my: 0.5 }} />
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {skills.map((s, idx) => (
                    <li key={idx} style={{ fontSize: "12px" }}>
                      {s.skill_name} ({s.level})
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {languages?.length > 0 && (
              <section>
                <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Languages
                </h2>
                <Divider sx={{ my: 0.5 }} />
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {languages.map((lang, idx) => (
                    <li key={idx} style={{ fontSize: "12px" }}>
                      {lang.language} - {lang.level}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Resume;
