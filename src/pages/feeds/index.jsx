import React from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { petFeedData } from "./data/pet-feed-data";
import {
  buildAreaOptions,
  buildBreedOptions,
  buildTypeOptions,
  filterPets,
} from "./utils/feed-utils";
import QuickFilters from "./components/quick-filters";
import FeedSummary from "./components/feed-summary";
import PetCard from "./components/pet-card";
import PetDetailsDialog from "./components/pet-details-dialog";
import EmptyFeedState from "./components/empty-feed-state";
import RightSidebar from "./components/right-sidebar";
import LeftSideBar from "./components/left-sidebar";
import CreatePetPostDialog from "@/features/pets/components/create-pet-post-dialog";

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
  const [searchTerm, setSearchTerm] = React.useState("");
  const [quickFilter, setQuickFilter] = React.useState("all");
  const [petType, setPetType] = React.useState("all");
  const [breed, setBreed] = React.useState("all");
  const [area, setArea] = React.useState("all");
  const [selectedPet, setSelectedPet] = React.useState(null);

  const typeOptions = buildTypeOptions(petFeedData);
  const breedOptions = buildBreedOptions(petFeedData, petType);
  const areaOptions = buildAreaOptions(petFeedData);
  const activeBreed =
    breed === "all" || breedOptions.includes(breed) ? breed : "all";

  const filteredPets = filterPets(petFeedData, {
    searchTerm,
    quickFilter,
    petType,
    breed: activeBreed,
    area,
  });

  return (
    <>
      <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_16px_44px_rgba(2,24,19,0.06)]">
        <div className="bg-[linear-gradient(135deg,_rgba(244,251,247,0.96),_rgba(255,255,255,0.98))] p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg font-semibold text-primary">pawpal</h1>
                  <p className="text-xs text-slate-500">
                    finding home for stray animals
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <CreatePetPostDialog
                  trigger={
                    <Button className="h-11 rounded-full px-4 shadow-none">
                      <Plus className="size-4" />
                      Upload pet
                    </Button>
                  }
                />
                <div className="min-w-xs">
                  <label className="relative block">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary/45" />
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by pet name, breed, or location"
                      className="h-9 rounded-full border-primary/15 bg-[#fcfdfb] pl-10 text-sm shadow-none focus-visible:ring-primary/15"
                    />
                  </label>
                </div>
                <Select value={petType} onValueChange={setPetType}>
                  <SelectTrigger className="h-11 w-full rounded-full border-primary/15 bg-[#fcfdfb] shadow-none">
                    <SelectValue placeholder="Pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All pet types</SelectItem>
                    {typeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="h-11 w-full rounded-full border-primary/15 bg-[#fcfdfb] shadow-none">
                    <SelectValue placeholder="Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {areaOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <QuickFilters
              options={quickFilterOptions}
              activeFilter={quickFilter}
              onChange={setQuickFilter}
            />
          </div>
        </div>
      </section>

      <div className="flex gap-4">
        <LeftSideBar className="max-w-sm w-full" />

        <div className="min-w-0 flex-1 space-y-5 pb-8">
          <section className="space-y-5">
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onOpenDetails={() => setSelectedPet(pet)}
                />
              ))
            ) : (
              <EmptyFeedState
                onReset={() => {
                  setSearchTerm("");
                  setQuickFilter("all");
                  setPetType("all");
                  setBreed("all");
                  setArea("all");
                }}
              />
            )}
          </section>
        </div>

        <RightSidebar
          pets={filteredPets.length > 0 ? filteredPets : petFeedData}
          className="max-w-sm w-full"
        />
      </div>

      <PetDetailsDialog
        pet={selectedPet}
        open={Boolean(selectedPet)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPet(null);
          }
        }}
      />
    </>
  );
};

export default FeedPage;
