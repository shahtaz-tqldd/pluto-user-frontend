import React from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MultiSelectFilter = ({
  label,
  options = [],
  selectedValues = [],
  onChange,
  className,
  align = "end",
}) => {
  const selectedCount = selectedValues.length;

  const handleCheckedChange = (value, checked) => {
    if (checked) {
      onChange([...selectedValues, value]);
      return;
    }

    onChange(selectedValues.filter((item) => item !== value));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className ?? "pl-3 pr-2"}>
          <div className="flx gap-2">
            <span>
              {label}
              {selectedCount > 0 ? ` (${selectedCount})` : ""}
            </span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="min-w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {options.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No options available
          </div>
        ) : (
          options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) =>
                handleCheckedChange(option.value, checked)
              }
              onSelect={(event) => event.preventDefault()}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))
        )}

        {selectedCount > 0 ? (
          <>
            <DropdownMenuSeparator />
            <button
              type="button"
              className="w-full rounded-sm px-2 py-1.5 text-left text-sm text-primary transition-colors hover:bg-accent"
              onClick={() => onChange([])}
            >
              Clear
            </button>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelectFilter;
