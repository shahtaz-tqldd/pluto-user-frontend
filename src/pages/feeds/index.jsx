import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  buildPetThreadPath,
  filterPets,
  normalizePetListResponse,
} from "./utils/feed-utils";
import {
  buildFeedFilterSearch,
  defaultFeedFilters,
  getFeedFiltersFromSearch,
} from "./utils/feed-filter-state";
import EmptyFeedState from "./components/empty-feed-state";
import RightSidebar from "./components/right-sidebar";
import LeftSideBar from "./components/left-sidebar";

import { usePetListQuery } from "@/features/pets/petApiSlice";
import PetCard from "../pets/pet-card";

const SHORTLIST_STORAGE_KEY = "pawpal-shortlisted-strays";

const getStoredShortlistIds = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsedIds = JSON.parse(
      window.localStorage.getItem(SHORTLIST_STORAGE_KEY) || "[]",
    );

    return Array.isArray(parsedIds) ? parsedIds.map(String) : [];
  } catch {
    return [];
  }
};

const FeedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shortlistIds, setShortlistIds] = React.useState(getStoredShortlistIds);
  const filters = React.useMemo(
    () => getFeedFiltersFromSearch(location.search),
    [location.search],
  );

  const { data, isError, isLoading } = usePetListQuery();
  const pets = React.useMemo(() => normalizePetListResponse(data), [data]);

  const filteredPets = filterPets(pets, {
    searchTerm: filters.searchTerm,
    quickFilter: "all",
    petType: filters.petType,
    breed: "all",
    area: filters.area,
    size: filters.size,
    location: filters.location,
    radiusKm: filters.radiusKm,
    color: filters.color,
  });

  const shortlistedPets = React.useMemo(() => {
    const shortlist = new Set(shortlistIds);
    return pets.filter((pet) => shortlist.has(String(pet.id)));
  }, [pets, shortlistIds]);

  const navigateToFilteredFeed = React.useCallback(
    (nextFilters) => {
      const search = buildFeedFilterSearch(nextFilters);

      navigate(
        {
          pathname: "/feeds",
          search: search ? `?${search}` : "",
        },
        { replace: true },
      );
    },
    [navigate],
  );

  const handleFilterChange = (filterId, value) => {
    navigateToFilteredFeed({
      ...filters,
      [filterId]: value,
    });
  };

  const toggleShortlist = (petId) => {
    setShortlistIds((currentIds) => {
      const petIdString = String(petId);
      const nextIds = currentIds.includes(petIdString)
        ? currentIds.filter((id) => id !== petIdString)
        : [petIdString, ...currentIds];

      window.localStorage.setItem(
        SHORTLIST_STORAGE_KEY,
        JSON.stringify(nextIds),
      );

      return nextIds;
    });
  };

  const resetFeedFilters = () => {
    navigateToFilteredFeed(defaultFeedFilters);
  };

  return (
    <div className="py-4">
      <div className="flex flex-col gap-4 xl:flex-row">
        <LeftSideBar
          className="w-full xl:w-[23rem] xl:max-w-sm"
          filters={filters}
          pets={pets}
          shortlistedPets={shortlistedPets}
          resultCount={filteredPets.length}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFeedFilters}
          onOpenPet={(pet) => navigate(buildPetThreadPath(pet))}
        />

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
                  isShortlisted={shortlistIds.includes(String(pet.id))}
                  onToggleShortlist={() => toggleShortlist(pet.id)}
                  onOpenDetails={() => navigate(buildPetThreadPath(pet))}
                />
              ))
            ) : (
              <EmptyFeedState onReset={resetFeedFilters} />
            )}
          </section>
        </div>

        <RightSidebar
          pets={filteredPets.length > 0 ? filteredPets : pets}
          className="w-full xl:w-[23rem] xl:max-w-sm"
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
