import React from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  ImageOff,
  MapPin,
  PawPrint,
  PawPrintIcon,
  UserRound,
} from "lucide-react";

import {
  useUserAdoptionListQuery,
  useUserRescuedListQuery,
} from "@/features/pets/petApiSlice";
import { cn, fallbackValue } from "@/lib/utils";
import PetCard from "../pets/pet-card";
import { normalizePetListResponse } from "../feeds/utils/feed-utils";
import ProfileReviews from "./components/profile-reviews";

const tabs = [
  { id: "posts", label: "My Posts" },
  { id: "rescued", label: "Rescued" },
  { id: "adoptions", label: "Adoptions" },
  { id: "about", label: "About" },
];

const isAdoptedPet = (pet) =>
  pet.rawPet?.status?.toString().toLowerCase() === "adopted";

const UserProfile = ({ profile, isSelfView = false }) => {
  const [activeTab, setActiveTab] = React.useState(
    isSelfView ? "posts" : "about",
  );
  const selectedTab = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : tabs[0].id;

  const rescuedQuery = useUserRescuedListQuery(undefined, {
    skip: !isSelfView || selectedTab === "adoptions" || selectedTab === "about",
  });
  const adoptionQuery = useUserAdoptionListQuery(undefined, {
    skip: !isSelfView || selectedTab !== "adoptions",
  });

  const rescuedPets = React.useMemo(
    () => normalizePetListResponse(rescuedQuery.data),
    [rescuedQuery.data],
  );
  const adoptionPets = React.useMemo(
    () => normalizePetListResponse(adoptionQuery.data),
    [adoptionQuery.data],
  );
  const postedPets = React.useMemo(
    () => rescuedPets.filter((pet) => !isAdoptedPet(pet)),
    [rescuedPets],
  );
  const completedRescues = React.useMemo(
    () => rescuedPets.filter((pet) => isAdoptedPet(pet)),
    [rescuedPets],
  );

  const activePets =
    selectedTab === "posts"
      ? postedPets
      : selectedTab === "rescued"
        ? completedRescues
        : selectedTab === "adoptions"
          ? adoptionPets
          : [];
  const activeQuery =
    selectedTab === "adoptions" ? adoptionQuery : rescuedQuery;

  return (
    <section className="grid grid-cols-3 gap-5">
      <div className="col-span-2 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-primary/10 bg-white p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  selectedTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-primary/5 hover:text-primary",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {selectedTab === "about" ? (
          <AboutPanel profile={profile} isSelfView={isSelfView} />
        ) : activeQuery.isLoading ? (
          <PetGridSkeleton />
        ) : activeQuery.isError ? (
          <EmptyState message="Could not load pets right now." />
        ) : activePets.length === 0 ? (
          <EmptyState message={getEmptyMessage(selectedTab)} />
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {activePets.map((pet) =>
              selectedTab === "posts" ? (
                <PetCard key={pet.id} pet={pet} />
              ) : (
                <RescueHistoryCard key={pet.id} pet={pet} tab={selectedTab} />
              ),
            )}
          </div>
        )}
      </div>
      <ProfileReviews profile={profile} isSelfView={isSelfView} />
    </section>
  );
};

const AboutPanel = ({ profile }) => (
  <div className="">
    <article className="rounded-[30px] border border-primary/10 bg-white p-5 shadow-[0_18px_48px_rgba(2,24,19,0.08)]">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserRound className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Profile Details</h2>
          <p className="text-sm text-slate-500">
            {fallbackValue(profile?.location, "Location not set")}
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        {fallbackValue(
          profile?.shortBio,
          "This member is building their Pawpal profile.",
        )}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ProfileFact label="Email" value={profile?.email || "Not shared"} />
        <ProfileFact label="Phone" value={profile?.phone || "Not shared"} />
        <ProfileFact
          label="Status"
          value={profile?.isVerified ? "Verified" : "Not verified"}
        />
        <ProfileFact label="Public Trust" value={profile?.trustScore} />
      </div>
    </article>
  </div>
);

const ProfileFact = ({ label, value }) => (
  <div className="rounded-2xl border border-primary/8 bg-[#f8faf8] px-4 py-3">
    <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-800">
      {value || "Not set"}
    </p>
  </div>
);

const RescueHistoryCard = ({ pet, tab }) => {
  const completedAt =
    pet.rawPet?.adopted_at || pet.rawPet?.updated_at || pet.rawPet?.created_at;
  const primaryImage = pet.images[0];
  const personLabel = tab === "adoptions" ? "Posted by" : "Adopted by";
  const personName =
    tab === "adoptions"
      ? pet.rescuerName
      : pet.rawPet?.adopter_name || pet.rawPet?.adopted_by_name || "Not set";

  return (
    <article className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_18px_48px_rgba(2,24,19,0.08)]">
      <div className="relative bg-[#eef8f2]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={`${pet?.name} photo`}
            className="h-80 w-full object-cover"
          />
        ) : (
          <div className="flex h-80 w-full flex-col items-center justify-center text-primary/55">
            <ImageOff className="size-8" />
            <span className="mt-2 text-xs font-medium">No photo</span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
            {pet.petType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e8fff3] px-3 py-1 text-xs font-semibold text-[#0d7a4c] backdrop-blur">
            <CheckCircle2 className="size-3.5" />
            {tab === "adoptions" ? "Adopted" : "Rescued"}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041612]/95 via-[#041612]/78 to-transparent px-5 pb-5 pt-12 text-white sm:px-6">
          <h2 className="mt-3 text-2xl font-bold text-white">{pet?.name}</h2>
          <p className="mt-1 text-sm text-white/80">{pet.label}</p>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem
            icon={<PawPrint className="size-4" />}
            value={pet.breed || pet.color || pet.petType}
          />
          <DetailItem icon={<Clock3 className="size-4" />} value={pet.age} />
          <DetailItem
            icon={<MapPin className="size-4" />}
            value={pet.location}
          />
          <DetailItem
            icon={<CalendarCheck2 className="size-4" />}
            value={formatDate(completedAt)}
          />
        </div>

        <div className="rounded-[24px] bg-[#f8faf8] p-4">
          <p className="text-sm font-medium text-slate-900">{personLabel}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{personName}</p>
        </div>
      </div>
    </article>
  );
};

const DetailItem = ({ icon, value }) => (
  <div className="flex items-center gap-2 rounded-2xl border border-primary/8 bg-white px-3 py-3">
    <span className="text-primary">{icon}</span>
    <span className="truncate text-sm">{value || "Not set"}</span>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex min-h-100 items-center justify-center rounded-[30px] border border-dashed border-primary/20 bg-white px-6 py-12">
    <div className="flex flex-col items-center gap-4">
      <PawPrintIcon className="text-primary/40" />
      <p className="text-sm font-medium text-slate-700">{message}</p>
    </div>
  </div>
);

const PetGridSkeleton = () => (
  <div className="grid gap-5 xl:grid-cols-2">
    {Array.from({ length: 2 }).map((_, index) => (
      <div
        key={index}
        className="h-[520px] animate-pulse rounded-[30px] bg-slate-100"
      />
    ))}
  </div>
);

const getEmptyMessage = (tab) => {
  if (tab === "posts") return "No active pet posts yet.";
  if (tab === "rescued") return "No completed rescues yet.";
  return "No adoptions yet.";
};

const formatDate = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) {
    return "Date pending";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export default UserProfile;
