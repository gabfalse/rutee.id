import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ChatSidebar from "../Components/ChatComponents/ChatSidebar";
import ChatRoom from "../Components/ChatComponents/ChatRoom";
import API from "../Config/API";

const ChatsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const { id: authId } = useAuth();

  // Fetch chat rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API.CHAT_GET_ROOMS, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok || !data.success)
          throw new Error(data.message || "Gagal memuat chat rooms");
        setRooms(data.rooms || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Handle new room from NewChatPage
  useEffect(() => {
    if (location.state?.newRoom) {
      const newRoom = location.state.newRoom;
      setRooms((prev) => [newRoom, ...prev]);
      setSelectedRoomId(newRoom.id);
      setMessages([]);
      setOtherUser(newRoom.other_user || null);
      navigate("/chats", { replace: true });
    }
  }, [location.state, navigate]);

  // Fetch messages when room selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedRoomId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API.CHAT_GET_MESSAGES}?room_id=${selectedRoomId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await res.json();
        if (data.success) {
          const formattedMessages = data.messages.map((msg) => ({
            id: msg.id,
            sender_id: msg.sender_id,
            message: msg.message,
            created_at: msg.created_at,
            sender_name: msg.sender_name || "Unknown",
            sender_avatar: msg.sender_avatar || "/default-avatar.png",
            isOwn: String(msg.sender_id) === String(authId),
          }));
          setMessages(formattedMessages);

          const room = rooms.find((r) => r.id === selectedRoomId);
          setOtherUser(room?.other_user || null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [selectedRoomId, rooms, authId]);

  const handleRoomClick = (roomId) => setSelectedRoomId(roomId);

  const handleBack = () => {
    if (selectedRoomId) {
      setSelectedRoomId(null);
      setMessages([]);
      setOtherUser(null);
    } else {
      navigate("/");
    }
  };

  const handleSend = (newMessage) => {
    setMessages((prev) => [
      ...prev,
      { ...newMessage, isOwn: String(newMessage.sender_id) === String(authId) },
    ]);
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedRoomId
          ? {
              ...room,
              lastMessageObj: newMessage,
              lastMessageText: newMessage.message,
            }
          : room
      )
    );
  };

  if (loading)
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box display="flex" flexDirection="row" height="100vh">
      {/* Sidebar */}
      {(!isMobile || (isMobile && !selectedRoomId)) && (
        <Box
          width={isMobile ? "100%" : selectedRoomId ? "40%" : "280px"}
          borderRight={isMobile ? "none" : "1px solid #e0e0e0"}
          borderBottom={isMobile ? "1px solid #e0e0e0" : "none"}
          flexShrink={0}
        >
          <ChatSidebar
            rooms={rooms}
            onRoomClick={handleRoomClick}
            onRoomDeleted={(deletedRoomId) => {
              setRooms((prev) => prev.filter((r) => r.id !== deletedRoomId));
              if (selectedRoomId === deletedRoomId) handleBack();
            }}
            onBack={handleBack}
          />
        </Box>
      )}

      {/* Chat area */}
      {selectedRoomId && (
        <Box flex={1} display="flex" flexDirection="column">
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={1}
            borderBottom="1px solid"
            borderColor="divider"
            bgcolor="background.paper"
          >
            <Box display="flex" alignItems="center">
              {isMobile && (
                <IconButton onClick={handleBack}>
                  <ArrowBackIcon />
                </IconButton>
              )}
              {otherUser && (
                <Box
                  display="flex"
                  alignItems="center"
                  ml={1}
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/profile/${otherUser.id}`)}
                >
                  <Avatar
                    src={otherUser.avatar || otherUser.profile_url || ""}
                    alt={otherUser.username || otherUser.name || "User"}
                    sx={{ width: 36, height: 36, mr: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {otherUser.name || "Unknown"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* ChatRoom */}
          <ChatRoom
            initialMessages={messages.map((msg) => ({
              ...msg,
              sender_avatar: msg.sender_avatar || "/default-avatar.png",
              sender_name: msg.sender_name || "Unknown",
            }))}
            onSendExternal={handleSend}
            roomId={selectedRoomId}
          />
        </Box>
      )}
    </Box>
  );
};

export default ChatsPage;
