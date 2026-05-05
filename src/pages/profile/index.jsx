import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelfProfile, getProfileByUsername } from "./data/profile-data";
import ProfileCover from "./components/cover";
import UserProfile from "./user-profile";

const getUserUsername = (user) => {
  if (user?.username) {
    return user.username;
  }

  const fallbackName =
    user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`;

  const fallback = fallbackName.trim().toLowerCase().replace(/\s+/g, "-");

  return fallback || "my-profile";
};

const ProfilePage = () => {
  const { username = "" } = useParams();
  const { user } = useSelector((state) => state.auth);
  const currentUsername = getUserUsername(user);
  const isSelfView = !username || username === currentUsername;
  const profile =
    (isSelfView ? createSelfProfile(user, currentUsername) : null) ||
    getProfileByUsername(username) ||
    createSelfProfile(user, username || currentUsername);

  return (
    <div className="space-y-4 py-6">
      <ProfileCover profile={profile} isSelfView={isSelfView} />

      <div className="mt-4">
        <UserProfile profile={profile} />
      </div>
    </div>
  );
};

export default ProfilePage;
