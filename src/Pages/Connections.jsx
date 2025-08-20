// src/components/Connections.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Avatar,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useParams } from "react-router-dom";

// Komponen tombol follow/unfollow
import FollowToggleButton from "../Components/ButtonComponents/FollowTogglePage";
import FeatureButton from "../Components/FeatureButton";

const API_URL = "https://rutee.id/dapur/user/connections.php";

export default function Connections() {
  const { userId } = useParams();
  const { user_id: loggedInUserId, token } = useAuth();

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const fetchData = async () => {
    if (!userId || !token) return;

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resFollowers, resFollowing, resConnections] = await Promise.all([
        axios.get(`${API_URL}?followers=${userId}`, { headers }),
        axios.get(`${API_URL}?following=${userId}`, { headers }),
        axios.get(`${API_URL}?connections=${userId}`, { headers }),
      ]);

      setFollowers(resFollowers.data.followers || []);
      setFollowing(resFollowing.data.following || []);
      setConnections(resConnections.data.connections || []);
    } catch (err) {
      console.error("❌ Error fetchData:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, token]);

  const renderUserList = (list) => {
    if (!list || list.length === 0)
      return <Typography textAlign="center">Belum ada user</Typography>;

    return (
      <Stack spacing={2}>
        {list.map((user) => {
          const userIdField = user.follower_id || user.following_id || user.id;

          return (
            <Paper
              key={userIdField}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              {/* Avatar + Nama */}
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={user.avatar || ""}
                  sx={{ width: 48, height: 48 }}
                />
                <Typography fontWeight="bold">
                  {user.display_name || user.username}
                </Typography>
              </Box>

              {/* Tombol follow/unfollow */}
              {userIdField !== loggedInUserId && (
                <FollowToggleButton
                  currentUserId={loggedInUserId}
                  targetUserId={userIdField}
                />
              )}
            </Paper>
          );
        })}
      </Stack>
    );
  };

  if (loading)
    return (
      <Box textAlign="center" mt={3}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        {" "}
        <Tab label={`Connections (${connections?.length || 0})`} />
        <Tab label={`Followers (${followers?.length || 0})`} />
        <Tab label={`Following (${following?.length || 0})`} />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && renderUserList(followers)}
        {tabIndex === 1 && renderUserList(following)}
        {tabIndex === 2 && renderUserList(connections)}
      </Box>
      <FeatureButton />
    </Box>
  );
}
