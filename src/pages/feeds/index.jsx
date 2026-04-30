import React from "react";
import { useNavigate } from "react-router-dom";
import {
  buildPetThreadPath,
  filterPets,
  normalizePetListResponse,
} from "./utils/feed-utils";
import PetCard from "./components/pet-card";
import EmptyFeedState from "./components/empty-feed-state";
import RightSidebar from "./components/right-sidebar";
import LeftSideBar from "./components/left-sidebar";

import { usePetListQuery } from "@/features/pets/petApiSlice";
import FeedHeader from "./components/header";

const quickFilterOptions = [
  {
    id: "all",
    label: "All Pets",
    description: "See the full rescue feed.",
  },
  {
    id: "nearby",
    label: "Nearby",
    description: "Prioritize pets close to you.",
  },
  {
    id: "latest",
    label: "Latest Uploaded",
    description: "Show the newest rescue listings first.",
  },
  {
    id: "available",
    label: "Available Only",
    description: "Hide pets already in adoption review.",
  },
];

const FeedPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [quickFilter, setQuickFilter] = React.useState("all");
  const [petType, setPetType] = React.useState("all");
  const [area, setArea] = React.useState("all");

  const { data, isError, isLoading } = usePetListQuery();
  const pets = React.useMemo(() => normalizePetListResponse(data), [data]);

  const filteredPets = filterPets(pets, {
    searchTerm,
    quickFilter,
    petType,
    breed: "all",
    area,
  });

  return (
    <div className="py-6">
      <FeedHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        options={quickFilterOptions}
        activeFilter={quickFilter}
        onChange={setQuickFilter}
      />
      <div className="flex gap-4 mt-5">
        <LeftSideBar className="max-w-sm w-full" />

        <div className="min-w-0 flex-1 space-y-5 pb-8">
          <section className="space-y-5">
            {isLoading ? (
              <FeedStatusCard message="Loading pets..." />
            ) : isError ? (
              <FeedStatusCard message="Could not load pets right now." />
            ) : filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onOpenDetails={() => navigate(buildPetThreadPath(pet))}
                />
              ))
            ) : (
              <EmptyFeedState
                onReset={() => {
                  setSearchTerm("");
                  setQuickFilter("all");
                  setPetType("all");
                  setArea("all");
                }}
              />
            )}
          </section>
        </div>

        <RightSidebar
          pets={filteredPets.length > 0 ? filteredPets : pets}
          className="max-w-sm w-full"
        />
      </div>
    </div>
  );
};

const FeedStatusCard = ({ message }) => {
  return (
    <div className="rounded-[28px] border border-primary/10 bg-white px-6 py-10 text-center text-sm font-medium text-slate-500 shadow-[0_16px_50px_rgba(2,24,19,0.05)]">
      {message}
    </div>
  );
};

export default FeedPage;
