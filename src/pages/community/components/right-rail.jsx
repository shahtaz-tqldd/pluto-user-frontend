import { cn } from "@/lib/utils";
import { Map, MapPin, Navigation } from "lucide-react";

const tagPillClass = "bg-white text-slate-700";
const dogImage =
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=520&q=80";

const trendingTopics = [
  ["#urgent-foster", 236],
  ["#lostfound", 184],
  ["#adoption", 142],
  ["#vet-help", 98],
  ["#dogrescue", 76],
];

const CommunityRightRail = ({ className }) => {
  return (
    <aside
      className={cn(
        "custom-scrollbar space-y-4 xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:overflow-y-auto xl:overscroll-contain",
        className,
      )}
    >
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
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-3 text-base font-bold text-slate-950">
            <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <MapPin className="size-5" />
            </span>
            Nearby rescue activity
          </h2>
          <button type="button" className="text-sm font-bold text-blue-700">
            View map
          </button>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-blue-50/70 p-3">
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
          <Map className="size-4 shrink-0 text-blue-600" />
        </div>
      </section>
    </aside>
  );
};

export default CommunityRightRail;
