import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Clock3,
  Dot,
  Heart,
  MapPin,
  MessageCircleMore,
  PawPrint,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  buildPetThreadPath,
  getDaysSinceUpload,
} from "../feeds/utils/feed-utils";
import PetImageCarousel from "../feeds/components/pet-image-carousel";

const PetCard = ({ pet, onOpenDetails }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const handleOpenDetails = () => {
    if (onOpenDetails) {
      onOpenDetails();
      return;
    }

    navigate(buildPetThreadPath(pet));
  };

  return (
    <article className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_18px_48px_rgba(2,24,19,0.08)] transition-transform duration-300 hover:-translate-y-1 h-fit">
      <div className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold">
            {pet.rescuerName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h2 className="text-sm font-semibold">{pet.rescuerName}</h2>
            <div className="flex flex-wrap items-center text-xs text-slate-500">
              <span>
                {getDaysSinceUpload(pet.uploadedAt).replace("Uploaded ", "")}
              </span>
              <Dot />
              <span>{pet.location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative bg-[#eef8f2]">
        <PetImageCarousel
          images={pet.images}
          alt={`${pet.name} photos`}
          className="h-92"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
            {pet.petType}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
              pet.available
                ? "bg-[#e8fff3] text-[#0d7a4c]"
                : "bg-[#fff2dc] text-[#996515]"
            }`}
          >
            {pet.status}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041612]/95 via-[#041612]/78 to-transparent px-5 pb-5 pt-12 text-white sm:px-6">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="mt-3 text-2xl font-bold text-white">{pet.name}</h2>
              <p className="mt-1 text-sm text-white/80">{pet.label}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-primary/8 px-3 py-1 font-medium text-primary">
              {pet.interestedCount} interested
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              {pet.activeChats} are talking
            </span>
          </div>

          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:border-primary/25 hover:text-primary"
          >
            {isExpanded ? "Hide details" : "More details"}
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
            />
          </button>
        </div>

        {isExpanded ? (
          <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
            <p className="text-sm leading-6 text-slate-600">
              {pet.description}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                icon={<PawPrint className="size-4" />}
                value={pet.breed || pet.color}
              />
              <DetailItem
                icon={<Clock3 className="size-4" />}
                value={pet.age}
              />
              <DetailItem
                icon={<Users className="size-4" />}
                value={pet.gender}
              />
              <DetailItem
                icon={<MapPin className="size-4" />}
                value={pet.location}
              />
            </div>

            <div className="rounded-[24px] bg-[#f8faf8] p-4">
              <p className="text-sm font-medium text-slate-900">
                Rescue context
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {pet.rescueNote}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
              <div className="flex items-center gap-4">
                <span>{getDaysSinceUpload(pet.uploadedAt)}</span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="size-4 text-primary/65" />
                  Shortlist
                </span>
              </div>

              <Button
                type="button"
                size="sm"
                className="rounded-full px-4"
                onClick={handleOpenDetails}
              >
                <MessageCircleMore className="size-4" />
                Open details
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
};

const DetailItem = ({ icon, value }) => {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-primary/8 bg-white px-3 py-3">
      <span className="text-primary">{icon}</span>
      <span className="truncate text-sm">{value}</span>
    </div>
  );
};

export default PetCard;
