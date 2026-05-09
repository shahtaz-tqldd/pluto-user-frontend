import React from "react";
import {
  Cat,
  Dog,
  MapPin,
  PawPrint,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn, getInitials } from "@/lib/utils";
import {
  buildAreaOptions,
  buildTypeOptions,
} from "@/pages/feeds/utils/feed-utils";
import { getActiveFeedFilterCount } from "@/pages/feeds/utils/feed-filter-state";

const radiusOptions = [1, 3, 5, 10, 15];

const fallbackTypeOptions = ["Cat", "Dog", "Rabbit", "Other"];
const sizeOptions = ["Small", "Medium", "Large"];
const fallbackColorOptions = ["Black", "White", "Brown", "Ginger"];

const LeftSideBar = ({
  className,
  filters,
  pets = [],
  resultCount = 0,
  onFilterChange,
  onResetFilters,
}) => {
  const typeOptions = React.useMemo(() => {
    const options = buildTypeOptions(pets);
    return options.length > 0 ? options : fallbackTypeOptions;
  }, [pets]);

  const areaOptions = React.useMemo(() => buildAreaOptions(pets), [pets]);

  const colorOptions = React.useMemo(() => {
    const options = [
      ...new Set(pets.map((pet) => pet.color).filter(Boolean)),
    ].sort((left, right) => left.localeCompare(right));

    return options.length > 0 ? options : fallbackColorOptions;
  }, [pets]);

  const activeFilterCount = getActiveFeedFilterCount(filters);
  const radiusIndex = Math.max(
    0,
    radiusOptions.indexOf(Number(filters.radiusKm)),
  );
  const selectedRadius = radiusOptions[radiusIndex] ?? 5;
  const sliderProgress = (radiusIndex / (radiusOptions.length - 1)) * 100;
  const isNearbyMode = filters.location === "nearby";

  return (
    <aside className={cn("block", className)}>
      <div className="custom-scrollbar xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)]">
        <section className="">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-3 inline-flex rounded-2xl bg-primary/8 p-2 text-primary">
                  <SlidersHorizontal className="size-4" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Find nearby strays
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {resultCount} matches in this feed
                </p>
              </div>

              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex size-10 items-center justify-center rounded-full border border-primary/10 text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                aria-label="Reset feed filters"
                title="Reset filters"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>

            {activeFilterCount > 0 ? (
              <span className="mt-4 inline-flex rounded-full bg-[#fff4c7] px-3 py-1 text-xs font-semibold text-[#7c5400]">
                {activeFilterCount} active filters
              </span>
            ) : null}
          </div>

          <div className="space-y-5 px-5 py-5">
            <label className="relative block">
              <span className="sr-only">Search stray pets</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary/55" />
              <Input
                value={filters.searchTerm}
                onChange={(event) =>
                  onFilterChange("searchTerm", event.target.value)
                }
                placeholder="Search strays or areas"
                className="h-11 rounded-full border-primary/15 bg-[#fcfdfb] pl-11 pr-4 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </label>

            <FilterBlock title="Discovery">
              <div className="grid grid-cols-2 gap-2">
                <FilterChip
                  active={isNearbyMode}
                  label="Nearby"
                  icon={<MapPin className="size-4" />}
                  onClick={() => onFilterChange("location", "nearby")}
                />
                <FilterChip
                  active={!isNearbyMode}
                  label="Anywhere"
                  icon={<PawPrint className="size-4" />}
                  onClick={() => onFilterChange("location", "anywhere")}
                />
              </div>

              <div
                className={cn(
                  "mt-4 rounded-[24px] border border-primary/10 bg-[#f7faf8] p-4 transition",
                  !isNearbyMode && "opacity-55",
                )}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Location radius
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Bumble-style distance control
                    </p>
                  </div>
                  <span className="rounded-full bg-[#ffcf36] px-3 py-1 text-sm font-bold text-[#4b3900]">
                    {selectedRadius}km
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={radiusOptions.length - 1}
                  step="1"
                  value={radiusIndex}
                  disabled={!isNearbyMode}
                  onChange={(event) =>
                    onFilterChange(
                      "radiusKm",
                      String(radiusOptions[Number(event.target.value)]),
                    )
                  }
                  className="radius-slider"
                  style={{ "--range-progress": `${sliderProgress}%` }}
                  aria-label="Location radius"
                />

                <div className="mt-3 flex justify-between text-[11px] font-semibold text-slate-400">
                  {radiusOptions.map((option) => (
                    <span key={option}>{option}km</span>
                  ))}
                </div>
              </div>
            </FilterBlock>

            <FilterBlock title="Pet type">
              <div className="grid grid-cols-2 gap-2">
                <FilterChip
                  active={filters.petType === "all"}
                  label="Any pet"
                  icon={<PawPrint className="size-4" />}
                  onClick={() => onFilterChange("petType", "all")}
                />
                {typeOptions.map((type) => (
                  <FilterChip
                    key={type}
                    active={filters.petType === type}
                    label={type}
                    icon={
                      type === "Cat" ? (
                        <Cat className="size-4" />
                      ) : (
                        <Dog className="size-4" />
                      )
                    }
                    onClick={() => onFilterChange("petType", type)}
                  />
                ))}
              </div>
            </FilterBlock>

            <FilterBlock title="Size">
              <div className="grid grid-cols-2 gap-2">
                <FilterChip
                  active={filters.size === "all"}
                  label="Any size"
                  onClick={() => onFilterChange("size", "all")}
                />
                {sizeOptions.map((size) => (
                  <FilterChip
                    key={size}
                    active={filters.size === size}
                    label={size}
                    onClick={() => onFilterChange("size", size)}
                  />
                ))}
              </div>
            </FilterBlock>

            <FilterBlock title="Area">
              <select
                value={filters.area}
                onChange={(event) => onFilterChange("area", event.target.value)}
                className="h-11 w-full rounded-2xl border border-primary/15 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
              >
                <option value="all">All areas</option>
                {areaOptions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </FilterBlock>

            <FilterBlock title="Color">
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={filters.color === "all"}
                  label="Any"
                  compact
                  onClick={() => onFilterChange("color", "all")}
                />
                {colorOptions.map((color) => (
                  <FilterChip
                    key={color}
                    active={filters.color === color}
                    label={color}
                    compact
                    swatch={getColorSwatch(color)}
                    onClick={() => onFilterChange("color", color)}
                  />
                ))}
              </div>
            </FilterBlock>
          </div>
        </section>
      </div>
    </aside>
  );
};

const FilterBlock = ({ title, children }) => (
  <div>
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
      {title}
    </h3>
    {children}
  </div>
);

const FilterChip = ({
  active,
  label,
  icon,
  swatch,
  compact = false,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
      compact ? "px-3 py-2" : "px-3 py-3",
      active
        ? "border-primary bg-primary text-white shadow-[0_12px_28px_rgba(0,79,59,0.18)]"
        : "border-primary/10 bg-white text-slate-700 hover:border-primary/25 hover:bg-primary/5 hover:text-primary",
    )}
  >
    {swatch ? (
      <span
        className="size-3 shrink-0 rounded-full border border-black/10"
        style={{ backgroundColor: swatch }}
      />
    ) : null}
    {icon}
    <span className="truncate">{label}</span>
  </button>
);

const PetThumb = ({ pet }) => {
  const image = pet.images?.[0] || pet.image;

  if (image) {
    return (
      <img
        src={image}
        alt=""
        className="size-12 shrink-0 rounded-2xl object-cover"
      />
    );
  }

  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#d7efe2] text-sm font-semibold text-primary">
      {getInitials(pet.name)}
    </span>
  );
};

const getColorSwatch = (color) => {
  const swatches = {
    black: "#111827",
    white: "#ffffff",
    brown: "#8b5e34",
    ginger: "#d97706",
    orange: "#f97316",
    gray: "#9ca3af",
    grey: "#9ca3af",
  };

  return swatches[color.toLowerCase()] || "#d7efe2";
};

export default LeftSideBar;
