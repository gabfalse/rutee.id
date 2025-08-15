import React from "react";
import { Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

export default function MessageButton({ onMessage }) {
  return (
    <Button
      variant="contained"
      color="success"
      size="small"
      startIcon={<ChatIcon />}
      onClick={onMessage}
    >
      Pesan
    </Button>
  );
}
