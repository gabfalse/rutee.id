import React, { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import API from "../../Config/API";

export default function FollowTogglePage({ currentUserId, targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ===== Cek status follow =====
  useEffect(() => {
    let isMounted = true;

    const fetchFollowStatus = async () => {
      if (!targetUserId || !token) return;

      try {
        const res = await axios.get(API.USER_FOLLOW_STATUS, {
          params: { target_id: targetUserId },
          ...axiosConfig,
        });

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
        API.USER_TOGGLE_FOLLOW,
        { following_id: targetUserId },
        axiosConfig
      );

      if (res.data) {
        setIsFollowing(res.data.status === "followed");
      }
    } catch (err) {
      console.error("Error toggle follow:", err.response?.data ?? err.message);
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
