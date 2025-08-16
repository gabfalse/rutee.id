import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

export default function FollowerCount({ targetUserId }) {
  const [followerCount, setFollowerCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchFollowers = async () => {
    if (!targetUserId || !token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://rutee.id/dapur/user/follow-status.php?target_id=${targetUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFollowerCount(res.data.followerCount ?? 0);
      setFollowers(res.data.followers ?? []);
    } catch (err) {
      console.error(
        "[DEBUG] Error fetching followers:",
        err.response?.data ?? err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [targetUserId]);

  const handleOpenModal = async () => {
    await fetchFollowers();
    setOpenModal(true);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpenModal} disabled={loading}>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          `Followers (${followerCount})`
        )}
      </Button>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Followers ({followerCount})</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <CircularProgress />
          ) : followers.length > 0 ? (
            <List>
              {followers.map((f) => (
                <ListItem key={f.id}>
                  <ListItemText
                    primary={f.name || f.username}
                    secondary={f.username}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>Belum ada follower</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
