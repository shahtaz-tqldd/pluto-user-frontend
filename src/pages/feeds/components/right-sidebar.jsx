import React from "react";
import FeedSummary from "./feed-summary";
import { MessageCircleMore } from "lucide-react";
import { cn } from "@/lib/utils";

const RightSidebar = ({ pets, className }) => {
  const chatThreads = pets
    .slice()
    .sort((left, right) => right.activeChats - left.activeChats)
    .slice(0, 5)
    .map((pet, index) => ({
      id: pet.id,
      petName: pet.name,
      rescuerName: pet.rescuerName,
      location: pet.location,
      unreadCount: Math.max(1, pet.activeChats - index),
      status: pet.available ? "Open for adoption" : "Under review",
    }));

  return (
    <aside className={cn("hidden xl:block", className)}>
      <div className="sticky top-5 max-h-[calc(100vh-2.5rem)] custom-scrollbar space-y-4 pr-1">
        <FeedSummary />
        <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="mb-2 inline-flex rounded-2xl bg-primary/8 p-2 text-primary">
              <MessageCircleMore className="size-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Conversations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Stay close to active rescuers and ongoing adoption threads.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {chatThreads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition hover:bg-[#f7faf8]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {thread.petName}
                    </span>
                    <span className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                      Thread
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {thread.rescuerName}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {thread.location}
                  </p>
                </div>
                <div className="space-y-2 text-right">
                  <span className="inline-flex min-w-7 justify-center rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white">
                    {thread.unreadCount}
                  </span>
                  <p className="text-[11px] text-slate-400">{thread.status}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default RightSidebar;
