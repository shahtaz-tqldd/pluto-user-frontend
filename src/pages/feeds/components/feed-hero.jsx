import React from "react";
import {
  BadgeCheck,
  MessageSquareText,
  Search,
} from "lucide-react";

const FeedHero = ({ totalPets, availablePets }) => {
  return (
    <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_16px_46px_rgba(2,24,19,0.08)]">
      <div className="bg-[radial-gradient(circle_at_top_left,_rgba(0,79,59,0.14),_transparent_42%),linear-gradient(180deg,_#ffffff_0%,_#f5fbf7_100%)] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
            Pet Discovery
          </span>
          <span className="inline-flex rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            Scroll, compare, connect
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <h1 className="max-w-2xl text-2xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
            Rescue stories, adoption signals, and active conversations in one stream.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Browse available pets the way people browse social content: one post at
            a time, with enough context to decide whether to open a conversation.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <HeroStat
            icon={<Search className="size-4" />}
            label="Live in feed"
            value={totalPets}
          />
          <HeroStat
            icon={<BadgeCheck className="size-4" />}
            label="Available now"
            value={availablePets}
          />
          <HeroStat
            icon={<MessageSquareText className="size-4" />}
            label="Demand visible"
            value="Chats + interest"
          />
        </div>
      </div>
    </section>
  );
};

const HeroStat = ({ icon, label, value }) => {
  return (
    <div className="rounded-[24px] border border-primary/10 bg-white/85 p-4">
      <div className="mb-3 inline-flex rounded-2xl bg-primary/8 p-2 text-primary">
        {icon}
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
};

export default FeedHero;
