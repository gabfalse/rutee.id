import React, { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";

export default function FollowTogglePage({ currentUserId, targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ===== Cek status follow =====
  useEffect(() => {
    let isMounted = true;

    const fetchFollowStatus = async () => {
      if (!targetUserId || !token) return;

      try {
        const res = await axios.get(
          `https://rutee.id/dapur/user/follow-status.php?target_id=${targetUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && isMounted) {
          setIsFollowing(res.data.isFollowing ?? false);
        }
      } catch (err) {
        console.error(
          "[DEBUG] Gagal cek status follow:",
          err.response?.data ?? err.message
        );
      }
    };

    fetchFollowStatus();

    return () => {
      isMounted = false;
    };
  }, [currentUserId, targetUserId, token]);

  // ===== Toggle follow/unfollow =====
  const handleToggleFollow = async () => {
    if (!targetUserId || !token) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `https://rutee.id/dapur/user/toggle-follow.php`,
        { following_id: targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) {
        if (res.data.status === "followed") {
          setIsFollowing(true);
        } else if (res.data.status === "unfollowed") {
          setIsFollowing(false);
        }
      }
    } catch (err) {
      console.error("Error", err.response?.data ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outlined" : "contained"}
      color="primary"
      onClick={handleToggleFollow}
      disabled={loading || !targetUserId}
    >
      {loading ? (
        <CircularProgress size={20} />
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
}
