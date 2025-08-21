import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItemButton,
  Avatar,
  Stack,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Add, ArrowBack, MoreVert } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatSidebar = ({ rooms, onRoomClick, onBack, onRoomDeleted }) => {
  const [roomsWithLastMsg, setRoomsWithLastMsg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLastMessages = async () => {
      setLoading(true);
      try {
        const updatedRooms = await Promise.all(
          rooms.map(async (room) => {
            try {
              const res = await axios.get(
                "https://rutee.id/dapur/chat/get-messages.php",
                {
                  params: { room_id: room.id },
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const messages = res.data.success ? res.data.messages : [];
              const lastMsg =
                messages.length > 0 ? messages[messages.length - 1] : null;

              return {
                ...room,
                lastMessageObj: lastMsg,
                lastMessageText: lastMsg ? lastMsg.message : "No messages yet",
                lastMessageTime: lastMsg
                  ? new Date(lastMsg.created_at)
                  : new Date(0),
              };
            } catch {
              return {
                ...room,
                lastMessageObj: null,
                lastMessageText: "No messages yet",
                lastMessageTime: new Date(0),
              };
            }
          })
        );

        updatedRooms.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        setRoomsWithLastMsg(updatedRooms);
      } catch (err) {
        console.error("Gagal mengambil pesan terakhir:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastMessages();
  }, [rooms, token]);

  const handleNewChat = () => {
    navigate("/chats/new");
  };

  const handleMenuClick = (event, room) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoom(room);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoom(null);
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;

    try {
      await axios.post(
        "https://rutee.id/dapur/chat/delete-room.php",
        { room_id: selectedRoom.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove room dari list
      setRoomsWithLastMsg((prev) =>
        prev.filter((r) => r.id !== selectedRoom.id)
      );
      if (onRoomDeleted) onRoomDeleted(selectedRoom.id);
    } catch (err) {
      console.error("Gagal hapus room:", err);
    } finally {
      handleMenuClose();
      setConfirmOpen(false);
    }
  };

  return (
    <Box
      sx={{
        borderRight: "1px solid #ddd",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          {onBack && (
            <IconButton
              onClick={onBack} // akan memanggil handleSidebarBack di ChatsPage
              size="small"
              sx={{ mr: 1 }}
              aria-label="Kembali"
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h6">Chats</Typography>
        </Box>
        <Button
          size="small"
          startIcon={<Add />}
          onClick={handleNewChat}
          variant="outlined"
        >
          New
        </Button>
      </Box>
      <Divider />

      {/* List Chat */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List>
            {roomsWithLastMsg.length > 0 ? (
              roomsWithLastMsg.map((room) => {
                const displayName =
                  room.name || room.other_user?.name || "Unknown";
                const avatarSrc =
                  room.avatar ||
                  room.other_user?.avatar ||
                  "/default-avatar.png";

                return (
                  <ListItemButton
                    key={room.id}
                    sx={{ py: 1.5 }}
                    onClick={() => onRoomClick(room.id)} // klik chat room
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ flex: 1 }}
                    >
                      <Avatar src={avatarSrc} alt={displayName} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle1" noWrap>
                          {displayName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {room.lastMessageText || "No messages yet"}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Menu Hapus */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // ⬅️ cegah klik chat
                        handleMenuClick(e, room);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </ListItemButton>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No chats yet
              </Typography>
            )}
          </List>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => setConfirmOpen(true)}>Delete Chat</MenuItem>
      </Menu>

      {/* Konfirmasi hapus */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete This message?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Batal</Button>
          <Button onClick={handleDeleteRoom} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatSidebar;
