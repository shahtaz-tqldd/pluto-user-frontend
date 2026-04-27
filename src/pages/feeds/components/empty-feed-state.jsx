import React from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyFeedState = ({ onReset }) => {
  return (
    <div className="rounded-[28px] border border-dashed border-primary/20 bg-white/85 px-6 py-12 text-center shadow-[0_16px_50px_rgba(2,24,19,0.05)]">
      <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/8 p-4 text-primary">
        <SearchX className="size-6" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">No pets match these filters.</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
        Try removing a few filters or resetting the search to bring more rescued
        pets back into the feed.
      </p>
      <Button type="button" onClick={onReset} className="mt-6 rounded-full px-5">
        Reset feed filters
      </Button>
    </div>
  );
};

export default EmptyFeedState;
