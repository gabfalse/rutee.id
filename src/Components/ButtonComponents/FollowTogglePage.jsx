import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import axios from "axios";

export default function FollowTogglePage({ currentUserId, targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followers, setFollowers] = useState([]);
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
          setFollowerCount(res.data.followerCount ?? 0);
          setFollowers(res.data.followers ?? []);
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
          setFollowerCount((prev) => prev + 1);
          if (res.data.newFollower) {
            setFollowers((prev) => [res.data.newFollower, ...prev]);
          }
        } else if (res.data.status === "unfollowed") {
          setIsFollowing(false);
          setFollowerCount((prev) => Math.max(prev - 1, 0));
          setFollowers((prev) => prev.filter((f) => f.id !== currentUserId));
        }
      }
    } catch (err) {
      console.error(
        "[DEBUG] Gagal toggle follow:",
        err.response?.data ?? err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip
      title={
        <div>
          <Typography variant="subtitle2">
            Followers ({followerCount})
          </Typography>
          {followers.length > 0 ? (
            followers.map((f) => (
              <Typography key={f.id} variant="body2">
                {f.name || f.username || "Unnamed"}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">Belum ada follower</Typography>
          )}
        </div>
      }
      arrow
      placement="top"
    >
      <span>
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
      </span>
    </Tooltip>
  );
}
