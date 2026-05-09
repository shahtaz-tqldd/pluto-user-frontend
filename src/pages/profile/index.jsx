import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelfProfile } from "./data/profile-data";
import ProfileCover from "./components/cover";
import UserProfile from "./user-profile";
import { useUserProfileQuery } from "@/features/user/userApiSlice";

const getUserUsername = (user) => {
  if (user?.username) {
    return user.username;
  }

  const fallbackName =
    user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`;

  const fallback = fallbackName.trim().toLowerCase().replace(/\s+/g, "-");

  return fallback || "my-profile";
};

const formatTrustScore = (averageRating) => {
  const rating = Number(averageRating);

  if (!Number.isFinite(rating) || rating <= 0) {
    return "No reviews";
  }

  return `${rating.toFixed(1)}/5`;
};

const createProfileFromApi = (profileData) => {
  if (!profileData) {
    return null;
  }

  const reviewCount = Number(profileData.review_count || 0);

  return {
    id: profileData.id,
    username: profileData.username,
    slug: profileData.username,
    role: "user",
    name: profileData?.name,
    avatar: profileData.avatar || "",
    cover: profileData.cover || "",
    shortBio: profileData.bio || "",
    location: profileData.location || "",
    email: "",
    phone: "",
    jobTitle: profileData.username ? `@${profileData.username}` : "",
    isVerified: Boolean(profileData.is_verified),
    joinedAt: profileData.created_at || "",
    joinedLabel: "Public profile",
    trustScore: formatTrustScore(profileData.average_rating),
    responseTime: "",
    stats: [
      { label: "Posts", value: "0" },
      { label: "Rescued", value: "0" },
      { label: "Adoptions", value: "0" },
      { label: "Reviews", value: String(reviewCount) },
    ],
    trustSignals: [],
    privateHighlights: [],
    availablePets: [],
    rescuedPets: [],
    adoptedHistory: [],
    adoptionHistory: [],
    activityMoments: [],
    reviews: [],
  };
};

const ProfilePage = () => {
  const { username = "" } = useParams();
  const { user } = useSelector((state) => state.auth);
  const currentUsername = getUserUsername(user);
  const requestedUsername = username || currentUsername;
  const { data, isLoading, isError } = useUserProfileQuery(requestedUsername, {
    skip: !requestedUsername,
  });

  const isSelfView = !username || username === currentUsername;
  const apiProfile = createProfileFromApi(data?.data);
  const profile =
    apiProfile || createSelfProfile(user, requestedUsername || currentUsername);

  return (
    <div className="space-y-4 py-6">
      {isLoading ? (
        <div className="rounded-[30px] border border-primary/10 bg-white p-5 text-sm font-medium text-slate-500">
          Loading profile...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-[30px] border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
          Could not load this profile right now.
        </div>
      ) : null}

      <ProfileCover profile={profile} isSelfView={isSelfView} />

      <div className="mt-4">
        <UserProfile profile={profile} isSelfView={isSelfView} />
      </div>
    </div>
  );
};

export default ProfilePage;
