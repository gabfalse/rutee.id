import React, { useState } from "react";
import { Button } from "@mui/material";

export default function FollowButton({
  initialFollowing = false,
  onFollowChange,
}) {
  const [following, setFollowing] = useState(initialFollowing);

  const handleClick = () => {
    // Misal: panggil API untuk follow/unfollow di sini
    const newStatus = !following;
    setFollowing(newStatus);
    if (onFollowChange) onFollowChange(newStatus);
  };

  return (
    <Button
      variant={following ? "outlined" : "contained"}
      color={following ? "secondary" : "primary"}
      onClick={handleClick}
      size="small"
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
