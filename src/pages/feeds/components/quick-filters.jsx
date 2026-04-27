import React from "react";
import { cn } from "@/lib/utils";

const QuickFilters = ({ options, activeFilter, onChange }) => {
  return (
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
            <p className="text-xs text-nowrap font-semibold">{option.label}</p>
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilters;
