import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const FeedHeader = ({
  searchTerm,
  setSearchTerm,
  options,
  activeFilter,
  onChange,
}) => {
  return (
    <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white">
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
              <div className="min-w-xs">
                <label className="relative block">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary/45" />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by pet name, type, or location"
                    className="h-9 rounded-full border-primary/15 bg-[#fcfdfb] pl-10 text-sm shadow-none focus-visible:ring-primary/15"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="custom-horizontal-scrollbar flex gap-2 overflow-x-auto pb-1">
            {options.map((option) => {
              const isActive = option.id === activeFilter;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange(option.id)}
                  className={cn(
                    "rounded-full border px-3 py-2 transition-all",
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-primary/10 bg-white text-slate-800 hover:border-primary/25 hover:bg-primary/3",
                  )}
                >
                  <p className="text-xs text-nowrap font-semibold">
                    {option.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedHeader;
