import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";

export default function BlockTogglePage({ blockedId }) {
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const token = localStorage.getItem("token"); // ambil JWT dari localStorage
  const API_BASE = "https://rutee.id/dapur/user";

  // ✅ Cek status awal (block-status.php)
  useEffect(() => {
    const checkStatus = async () => {
      if (!blockedId || !token) {
        setInitialLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/block-status.php`, {
          params: { blocked_id: blockedId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsBlocked(res.data.is_blocked);
      } catch (err) {
        console.error("Gagal cek status block:", err.response?.data || err);
      } finally {
        setInitialLoading(false);
      }
    };

    checkStatus();
  }, [blockedId, token]);

  // ✅ Toggle block/unblock (toggle-block.php)
  const toggleBlock = async () => {
    if (!token) {
      alert("Unauthorized");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/toggle-block.php`,
        { blocked_id: blockedId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsBlocked(res.data.status === "blocked");
    } catch (err) {
      console.error("Error toggle block:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: 20 }}>
        <CircularProgress size={24} />
      </div>
    );
  }

  return (
    <div style={{ padding: 2 }}>
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <Button
          variant={isBlocked ? "outlined" : "contained"}
          color={isBlocked ? "error" : "error"}
          onClick={toggleBlock}
        >
          {isBlocked ? "Unblock" : "Block"}
        </Button>
      )}
    </div>
  );
}
