import React from "react";
import { cn } from "@/lib/utils";
import {
  Map,
  MapPin,
  Navigation,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const tagPillClass = "bg-white text-slate-700";
const dogImage =
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=520&q=80";

const CommunityRighSidebar = ({
  className,
  filters,
  postTypes = [],
  helpCategories = [],
  onFiltersChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(
    filters?.search || filters?.postType || filters?.helpCategory,
  );
  const showHelpCategories = filters?.postType === "HELP_SEEKING";

  return (
    <aside
      className={cn(
        "custom-scrollbar space-y-4 xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:overflow-y-auto xl:overscroll-contain",
        className,
      )}
    >
      <section className="px-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-3 text-base font-bold text-slate-950">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/5 text-primary">
              <SlidersHorizontal className="size-5" />
            </span>
            Filter posts
          </h2>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-primary"
            >
              <X className="size-4" />
              Clear
            </button>
          ) : null}
        </div>

        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters?.search || ""}
            onChange={(event) =>
              onFiltersChange?.({ search: event.target.value })
            }
            placeholder="Search community posts"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase text-slate-400">
            Post type
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <FilterChip
              label="All"
              active={!filters?.postType}
              onClick={() => onFiltersChange?.({ postType: "" })}
            />
            {postTypes.map((postType) => (
              <FilterChip
                key={postType.value}
                label={postType.label}
                icon={postType.icon}
                active={filters?.postType === postType.value}
                onClick={() => onFiltersChange?.({ postType: postType.value })}
              />
            ))}
          </div>
        </div>

        {showHelpCategories ? (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase text-slate-400">
              Help category
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterChip
                label="All help"
                active={!filters?.helpCategory}
                onClick={() => onFiltersChange?.({ helpCategory: "" })}
              />
              {helpCategories.map((category) => (
                <FilterChip
                  key={category.value}
                  label={category.label}
                  active={filters?.helpCategory === category.value}
                  onClick={() =>
                    onFiltersChange?.({ helpCategory: category.value })
                  }
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>
      {/* 
      <section className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-3 text-lg font-bold text-slate-950">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Navigation className="size-5" />
            </span>
            Trending topics
          </h2>
          <button type="button" className="text-sm font-bold text-blue-700">
            View all
          </button>
        </div>
        <div className="space-y-3">
          {trendingTopics.map(([topic, count]) => (
            <div
              key={topic}
              className="flex items-center justify-between gap-3"
            >
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-bold",
                  tagPillClass,
                )}
              >
                {topic}
              </span>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold",
                  tagPillClass,
                )}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </section> */}

      <section className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-3 text-base font-bold text-slate-950">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </span>
            Nearby rescue activity
          </h2>
          <button type="button" className="text-sm font-bold text-primary">
            View map
          </button>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-3">
          <img
            src={dogImage}
            alt=""
            className="size-14 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">
              Dog found near Gulshan 2
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              15m ago • 1.2 km away
            </p>
          </div>
          <Map className="size-4 shrink-0 text-primary" />
        </div>
      </section>
    </aside>
  );
};

const FilterChip = ({ label, icon: Icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition",
      active
        ? "border-primary bg-primary text-white shadow-[0_10px_24px_rgba(209,70,28,0.18)]"
        : "border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:text-primary",
    )}
  >
    {Icon ? <Icon className="size-3.5" /> : null}
    {label}
  </button>
);

export default CommunityRighSidebar;
