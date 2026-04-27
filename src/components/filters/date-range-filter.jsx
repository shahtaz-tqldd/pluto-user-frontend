import React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRangeFromPreset } from "./date-range-filter.utils";

const DEFAULT_OPTIONS = [
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "custom", label: "Custom Range" },
];

const DateRangeFilter = ({
  defaultValue,
  onChange,
  className = "",
  options = DEFAULT_OPTIONS,
}) => {
  const [preset, setPreset] = React.useState(
    defaultValue?.preset ?? "this_week",
  );
  const [customRange, setCustomRange] = React.useState({
    dateFrom: defaultValue?.dateFrom ?? "",
    dateTo: defaultValue?.dateTo ?? "",
  });
  const onChangeRef = React.useRef(onChange);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    const range = getRangeFromPreset(preset, customRange);
    const isValid =
      preset !== "custom" ||
      (!range.dateFrom || !range.dateTo ? false : range.dateFrom <= range.dateTo);

    onChangeRef.current?.({
      preset,
      dateFrom: range.dateFrom,
      dateTo: range.dateTo,
      isValid,
    });
  }, [customRange, preset]);

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${className}`}>
      <Select value={preset} onValueChange={setPreset}>
        <SelectTrigger className="min-w-[180px] bg-white">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {preset === "custom" ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="date"
            value={customRange.dateFrom}
            onChange={(event) =>
              setCustomRange((prev) => ({
                ...prev,
                dateFrom: event.target.value,
              }))
            }
            className="min-w-[160px] bg-white"
            aria-label="Start date"
          />
          <Input
            type="date"
            value={customRange.dateTo}
            onChange={(event) =>
              setCustomRange((prev) => ({
                ...prev,
                dateTo: event.target.value,
              }))
            }
            className="min-w-[160px] bg-white"
            aria-label="End date"
          />
        </div>
      ) : null}
    </div>
  );
};

export default DateRangeFilter;
