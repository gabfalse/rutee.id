import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileCard from "../Components/ProfileComponents/ProfileCard";
import { useAuth } from "../Context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user_id: authUserId, isAuthenticated } = useAuth();
  const { user_id: paramUserId } = useParams();

  if (!isAuthenticated || !authUserId) {
    return <p>Anda harus login untuk melihat profil.</p>;
  }

  const targetUserId = paramUserId || authUserId;
  const isOwner = targetUserId === authUserId;

  const handleEditProfile = () => navigate("/profile/edit");
  const handleEditSection = (section) => navigate(`/${section}/edit`);
  const handleViewAllSection = (section) => navigate(`/${section}`);

  return (
    <ProfileCard
      user_id={targetUserId}
      isOwner={isOwner}
      onEditProfileClick={isOwner ? handleEditProfile : undefined}
      onEditClickSection={isOwner ? handleEditSection : undefined}
      onViewAllClickSection={!isOwner ? handleViewAllSection : undefined}
    />
  );
}
