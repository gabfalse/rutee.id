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

  // jika tidak ada param, berarti user buka profilnya sendiri
  const targetUserId = paramUserId || authUserId;

  // true kalau profil yang dilihat adalah profil sendiri
  const isOwner = String(targetUserId) === String(authUserId);

  // handler untuk owner
  const handleEditProfile = () => navigate("/profile/edit");
  const handleEditSection = (section) => navigate(`/profile/${section}/edit`);

  // handler untuk visitor
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
