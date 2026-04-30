import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelfProfile, getProfileByUsername } from "./data/profile-data";
import ProfileCover from "./components/cover";
import RescuerProfile from "./rescuer-profile";
import AdopterProfile from "./adopter-profile";
import ProfileReviews from "./components/profile-reviews";

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

  const isRescuer = profile.role === "rescuer";

  return (
    <div className="space-y-4 py-6">
      <ProfileCover
        profile={profile}
        isRescuer={isRescuer}
        isSelfView={isSelfView}
      />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isRescuer ? (
            <RescuerProfile profile={profile} />
          ) : (
            <AdopterProfile profile={profile} />
          )}
        </div>
        <div className="lg:col-span-1">
          <ProfileReviews profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
