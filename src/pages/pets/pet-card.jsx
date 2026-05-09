import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  Clock3,
  Dot,
  Heart,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  buildPetThreadPath,
  getDaysSinceUpload,
} from "../feeds/utils/feed-utils";
import PetImageCarousel from "../feeds/components/pet-image-carousel";

const PetCard = ({
  pet,
  variant = "default",
  isShortlisted = false,
  onToggleShortlist,
  onOpenDetails,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isFeedVariant = variant === "feed";
  const rescuerName =
    pet?.rescuer?.name || pet.rescuerName || "Community rescuer";
  const rescuerUsername = pet?.rescuer?.username;
  const petTitle = pet.title || pet.name || "Unnamed pet";
  const species = formatLabel(pet.species || pet.petType || "Pet");
  const location = pet.current_location || pet.location || "Location not set";
  const images = pet.primary_image
    ? [pet.primary_image, ...(pet.images || [])]
    : pet.images || [];
  const age = pet.age || formatAge(pet.age_months);
  const size = formatLabel(pet.size || "Size not set");
  const gender = formatLabel(pet.gender || "Gender not set");
  const temperament = pet.temperament || "Temperament not shared";
  const description = pet.description || pet.story || "No story added yet.";
  const rescueNote =
    pet.rescueNote || pet.medical_notes || "No extra notes yet.";
  const uploadedAt = pet.created_at || pet.uploadedAt || new Date();
  const isAvailable = pet.available ?? pet.status === "AVAILABLE";
  const activeChats =
    pet.activeChats ?? pet.active_chats ?? pet.active_conversation_count ?? 0;
  const interestedCount = pet.interestedCount ?? pet.interested_count ?? 0;
  const handleOpenDetails = () => {
    if (onOpenDetails) {
      onOpenDetails();
      return;
    }

    navigate(buildPetThreadPath(pet));
  };

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[30px] bg-white shadow-[0_18px_48px_rgba(2,24,19,0.08)] h-fit",
        isFeedVariant &&
          "lg:grid lg:min-h-[26rem] lg:grid-cols-[minmax(18rem,40%)_1fr] lg:grid-rows-[auto_1fr]",
      )}
    >
      <div
        className={cn(
          "p-3",
          isFeedVariant && "lg:order-2 lg:px-6 lg:pb-0 lg:pt-5",
        )}
      >
        <div className="flex items-center gap-3">
          {pet?.rescuer?.profile_picture ? (
            <img
              src={pet?.rescuer?.profile_picture}
              className="h-10 w-10 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold">
              {rescuerName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
          <div>
            {rescuerUsername ? (
              <Link to={`/profile/${rescuerUsername}`}>
                <h2 className="text-sm font-semibold">{rescuerName}</h2>
              </Link>
            ) : (
              <h2 className="text-sm font-semibold">{rescuerName}</h2>
            )}
            <div className="flex flex-wrap items-center text-xs text-slate-500">
              <span>
                {getDaysSinceUpload(uploadedAt).replace("Uploaded ", "")}
              </span>
              <Dot />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "relative bg-[#eef8f2]",
          isFeedVariant && "lg:order-1 lg:row-span-2 lg:min-h-[26rem]",
        )}
      >
        <PetImageCarousel
          images={images}
          alt={`${petTitle} photos`}
          className={cn("h-92", isFeedVariant && "lg:h-full")}
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div></div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
              isAvailable
                ? "bg-[#e8fff3] text-[#0d7a4c]"
                : "bg-[#fff2dc] text-[#996515]"
            }`}
          >
            {activeChats} are talking
          </span>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041612]/95 via-[#041612]/78 to-transparent px-5 pb-5 pt-12 text-white sm:px-6",
            isFeedVariant && "lg:hidden",
          )}
        >
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex gap-2.5 items-end">
                <h2 className="mt-3 text-2xl font-bold text-white">
                  {petTitle}
                </h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur mb-1.5">
                  {species}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/80">{age}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <CompactPill>{gender}</CompactPill>
                <CompactPill>{size}</CompactPill>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              className="rounded-full px-4"
              onClick={handleOpenDetails}
            >
              <ArrowUpRight className="size-4" />
              Open Thread
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "p-4",
          isFeedVariant &&
            "lg:order-3 lg:flex lg:flex-col lg:px-6 lg:pb-6 lg:pt-4",
        )}
      >
        {isFeedVariant ? (
          <div className="hidden lg:block">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-3xl font-bold leading-tight text-slate-950">
                    {petTitle}
                  </h2>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {species}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <CompactPill tone="solid">{gender}</CompactPill>
                  <CompactPill tone="solid">{size}</CompactPill>
                  <CompactPill tone="solid">{age}</CompactPill>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#f8faf8] px-3 py-3">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/70">
                  Temperament
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-slate-800">
                  {temperament}
                </p>
              </div>
            </div>

            <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
              {description}
            </p>

            <div className="flex gap-6 py-5">
              <StatusBadge
                checked={pet.vaccinated}
                label="Vaccinated"
                icon={<ShieldCheck className="size-4" />}
              />
              <StatusBadge
                checked={pet.sterilized}
                label="Sterilized"
                icon={<PawPrint className="size-4" />}
              />
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3",
            isFeedVariant &&
              "lg:mt-auto lg:border-t lg:border-slate-100 lg:pt-5",
          )}
        >
          <div className="text-xs flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleShortlist}
              aria-pressed={isShortlisted}
              aria-label={
                isShortlisted
                  ? `Remove ${petTitle} from shortlist`
                  : `Shortlist ${petTitle}`
              }
              className={cn(
                "flex items-center gap-2 rounded-full border px-2 py-2 transition",
                isShortlisted
                  ? "border-[#ffca3a] bg-[#fff6d8] text-[#8a5b00]"
                  : "border-primary/40 text-primary hover:bg-primary/5",
              )}
            >
              <Heart
                size={14}
                className={cn(isShortlisted && "fill-current")}
              />
              <span className="sr-only">Shortlist</span>
            </button>

            <div className="flex flex-col">
              <span className="text-slate-600 font-medium">
                {interestedCount} interested
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="shrink-0 rounded-full px-4"
            onClick={handleOpenDetails}
          >
            <ArrowUpRight className="size-4" />
            Open Thread
          </Button>

          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:border-primary/25 hover:text-primary",
              isFeedVariant && "lg:hidden",
            )}
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
            <p className="text-sm leading-6 text-slate-600">{description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                icon={<Sparkles className="size-4" />}
                value={temperament}
              />
              <DetailItem icon={<Clock3 className="size-4" />} value={age} />
              <StatusBadge
                checked={pet.vaccinated}
                label="Vaccinated"
                icon={<ShieldCheck className="size-4" />}
              />
              <StatusBadge
                checked={pet.sterilized}
                label="Sterilized"
                icon={<PawPrint className="size-4" />}
              />
              <DetailItem
                icon={<MapPin className="size-4" />}
                value={location}
              />
            </div>

            <div className="rounded-[24px] bg-[#f8faf8] p-4">
              <p className="text-sm font-medium text-slate-900">
                Rescue context
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {rescueNote}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
};

const formatLabel = (value) =>
  value
    ? value
        .toString()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "";

const formatAge = (ageMonths) => {
  const months = Number(ageMonths);

  if (!Number.isFinite(months)) {
    return "Age not set";
  }

  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (!remainingMonths) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  return `${years}y ${remainingMonths}m`;
};

const CompactPill = ({ children, tone = "glass" }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "solid"
          ? "bg-slate-100 text-slate-700"
          : "bg-white/10 text-white backdrop-blur",
      )}
    >
      {children}
    </span>
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

const StatusBadge = ({ checked, icon, label }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-medium",
        checked
          ? "text-[#0d7a4c]"
          : "text-slate-500",
      )}
    >
      <span className={cn(checked ? "text-[#0d7a4c]" : "text-slate-400")}>
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </div>
  );
};

export default PetCard;
