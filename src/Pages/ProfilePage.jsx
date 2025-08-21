import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileCard from "../Components/ProfileComponents/ProfileCard";
import { useAuth } from "../Context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const authUserId = user?.id;
  const { user_id: paramUserId } = useParams();

  if (!isAuthenticated || !authUserId) {
    return <p>Anda harus login untuk melihat profil.</p>;
  }

  const targetUserId = paramUserId || authUserId;
  const isOwner = String(targetUserId) === String(authUserId);

  const handleEditProfile = () => navigate("/profile/edit");
  const handleEditSection = (section) => navigate(`/profile/${section}/edit`);
  const handleViewAllSection = (section) =>
    navigate(`/profile/${targetUserId}/${section}`);

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
