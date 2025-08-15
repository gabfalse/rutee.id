import React, { useState } from "react";
import { Button } from "@mui/material";

export default function BlockButton({ initialBlocked = false, onBlockChange }) {
  const [blocked, setBlocked] = useState(initialBlocked);

  const handleClick = () => {
    // Misal: panggil API untuk block/unblock di sini
    const newStatus = !blocked;
    setBlocked(newStatus);
    if (onBlockChange) onBlockChange(newStatus);
  };

  return (
    <Button
      variant={blocked ? "contained" : "outlined"}
      color={blocked ? "error" : "primary"}
      onClick={handleClick}
      size="small"
    >
      {blocked ? "Blocked" : "Block"}
    </Button>
  );
}
