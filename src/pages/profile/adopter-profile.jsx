import { useRescuerPetListQuery } from "@/features/pets/petApiSlice";
import React from "react";
import PetCard from "../pets/pet-card";
import { normalizePetListResponse } from "../feeds/utils/feed-utils";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  ImageOff,
  MapPin,
  PawPrint,
  PawPrintIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdopterProfile = () => {
  const [activeTab, setActiveTab] = React.useState("open");
  const openQuery = useRescuerPetListQuery(
    {
      status: "AVAILABLE",
      page: 1,
      pageSize: 12,
    },
    { skip: activeTab !== "open" },
  );
  const adoptedQuery = useRescuerPetListQuery(
    {
      status: "ADOPTED",
      page: 1,
      pageSize: 12,
    },
    { skip: activeTab !== "adopted" },
  );

  const openPets = React.useMemo(
    () => normalizePetListResponse(openQuery.data),
    [openQuery.data],
  );
  const adoptedPets = React.useMemo(
    () => normalizePetListResponse(adoptedQuery.data),
    [adoptedQuery.data],
  );

  const activePets =
    activeTab === "open"
      ? openPets
      : activeTab === "adopted"
        ? adoptedPets
        : [];
  const isLoading =
    activeTab === "open"
      ? openQuery.isLoading
      : activeTab === "adopted"
        ? adoptedQuery.isLoading
        : false;
  const isError =
    activeTab === "open"
      ? openQuery.isError
      : activeTab === "adopted"
        ? adoptedQuery.isError
        : false;

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-primary/10 bg-white p-1 shadow-sm">
          {[
            { id: "open", label: "Adopted Pets" },
            { id: "adopted", label: "About Me" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-primary/5 hover:text-primary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PetGridSkeleton />
      ) : isError ? (
        <EmptyState message="Could not load pets right now." />
      ) : activePets.length === 0 ? (
        <EmptyState
          message={
            activeTab === "open"
              ? "No pets are open for adoption yet."
              : activeTab === "adopted"
                ? "No adopted pets yet."
                : "No community updates yet."
          }
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {activePets.map((pet) =>
            activeTab === "open" ? (
              <PetCard key={pet.id} pet={pet} />
            ) : (
              <AdoptedPetCard key={pet.id} pet={pet} />
            ),
          )}
        </div>
      )}
    </section>
  );
};

const AdoptedPetCard = ({ pet }) => {
  const adoptedAt =
    pet.rawPet?.adopted_at || pet.rawPet?.updated_at || pet.rawPet?.created_at;
  const adopterName =
    pet.rawPet?.adopter_name ||
    pet.rawPet?.adopted_by_name ||
    "Adopter details";
  const primaryImage = pet.images[0];

  return (
    <article className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_18px_48px_rgba(2,24,19,0.08)]">
      <div className="relative bg-[#eef8f2]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={`${pet.name} photo`}
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
            Adopted
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041612]/95 via-[#041612]/78 to-transparent px-5 pb-5 pt-12 text-white sm:px-6">
          <h2 className="mt-3 text-2xl font-bold text-white">{pet.name}</h2>
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
            value={formatDate(adoptedAt)}
          />
        </div>

        <div className="rounded-[24px] bg-[#f8faf8] p-4">
          <p className="text-sm font-medium text-slate-900">Adopted by</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{adopterName}</p>
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
  <div className="rounded-[30px] border border-dashed border-primary/20 bg-white px-6 py-12 flex items-center justify-center min-h-100">
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

const formatDate = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) {
    return "Adoption date pending";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export default AdopterProfile;
