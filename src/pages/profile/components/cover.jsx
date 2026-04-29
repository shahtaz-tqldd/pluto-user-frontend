import React from "react";

import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  HeartHandshake,
  MapPin,
  PawPrint,
  ShieldCheck,
} from "lucide-react";
import CreatePetPostDialog from "@/features/pets/components/create-pet-post-dialog";

import { Button } from "@/components/ui/button";
import { fallbackValue, getInitials } from "@/lib/utils";
import { formatJoinedDate } from "@/lib/date-time";
import UpdateProfileDialog from "./update-profile-dialog";

const ProfileCover = ({ profile, isRescuer, isSelfView }) => {
  const displayName = fallbackValue(profile.name, "Guest User");
  const displayBio = fallbackValue(
    profile.shortBio,
    isRescuer
      ? "Rescue profile details are being updated."
      : "Adopter profile details are being updated.",
  );
  const displayLocation = fallbackValue(profile.location, "Location not set");
  const displayJobTitle = fallbackValue(
    profile.jobTitle,
    isRescuer ? "Community rescuer" : "Adopter",
  );

  return (
    <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_16px_44px_rgba(2,24,19,0.06)]">
      <div className="relative min-h-[170px] overflow-hidden bg-[#edf7f1]">
        {profile.cover ? (
          <img
            src={profile.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,214,107,0.55),transparent_28%),linear-gradient(135deg,rgba(0,79,59,0.96),rgba(19,129,91,0.82)_48%,rgba(255,248,240,0.92))]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,24,19,0.58),rgba(2,24,19,0.18)_55%,rgba(255,255,255,0.18))]" />
      </div>

      <div className="-mt-16 p-4 sm:p-5">
        <div className="relative flex flex-col gap-6 rounded-[26px] border border-white/80 bg-white/95 p-4 shadow-[0_12px_30px_rgba(2,24,19,0.08)] backdrop-blur sm:p-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[28px] border-4 border-white bg-[#eef8f2] shadow-[0_20px_40px_rgba(2,24,19,0.12)]">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-primary">
                  {getInitials(displayName)}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold capitalize text-primary">
                    {isRescuer ? "Rescuer" : "Adopter"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {profile.isVerified ? (
                      <BadgeCheck className="size-3.5 text-primary" />
                    ) : (
                      <ShieldCheck className="size-3.5 text-slate-400" />
                    )}
                    {profile.isVerified ? "Verified" : "Not verified"}
                  </span>
                </div>

                <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                  {displayName}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <BriefcaseBusiness className="size-4 text-primary/60" />
                  {displayJobTitle}
                </p>
              </div>

              <p className="max-w-3xl text-sm leading-6 text-slate-600">
                {displayBio}
              </p>

              <div className="text-sm text-slate-500 flex gap-x-8 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary/60" />
                  {displayLocation}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-primary/60" />
                  {formatJoinedDate(profile.joinedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            {isSelfView ? (
              <>
                {isRescuer && (
                  <CreatePetPostDialog
                    title="Upload rescue post"
                    description="Add a new rescue listing with the care details adopters rely on before sending a request."
                    trigger={
                      <Button className="rounded-full px-4">
                        <PawPrint className="size-4" />
                        Upload pet
                      </Button>
                    }
                  />
                )}
                <UpdateProfileDialog profile={profile} />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="rounded-full border-primary/15 bg-white/80 px-4 text-slate-700"
                >
                  <HeartHandshake className="size-4 text-primary" />
                  Leave feedback
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCover;
