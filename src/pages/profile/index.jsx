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
        <div className="lg:col-span-2"></div>
        <div className="lg:col-span-1">
          <ProfileReviews profile={profile} />
        </div>
      </div>

      {isRescuer ? (
        <RescuerProfile profile={profile} />
      ) : (
        <AdopterProfile profile={profile} />
      )}
    </div>
  );
};

const ProfileSection = ({ icon, title, description, children }) => {
  return (
    <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_16px_40px_rgba(2,24,19,0.05)]">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="mb-2 inline-flex rounded-2xl bg-primary/8 p-2 text-primary">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
};

const PetPreviewCard = ({ pet }) => {
  return (
    <article className="overflow-hidden rounded-[24px] border border-primary/10 bg-[#f8fbf9]">
      <img
        src={pet.image}
        alt={pet.name}
        className="h-48 w-full object-cover"
      />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{pet.name}</h3>
            <p className="text-sm text-slate-500">{pet.label}</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {pet.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-white px-3 py-1">{pet.petType}</span>
          <span className="rounded-full bg-white px-3 py-1">{pet.breed}</span>
          <span className="rounded-full bg-white px-3 py-1">
            {pet.location}
          </span>
        </div>
      </div>
    </article>
  );
};

const TimelineCard = ({ title, meta, detail }) => {
  return (
    <div className="rounded-[24px] border border-primary/10 bg-[#f8fbf9] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
            {meta}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
};

export default ProfilePage;
