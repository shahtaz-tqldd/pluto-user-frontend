import React from "react";
import { MapPin, MessageSquareMore, Sparkles, Users } from "lucide-react";

const FeedSummary = ({ pets }) => {
  const availableCount = pets.filter((pet) => pet.available).length;
  const interestedCount = pets.reduce(
    (sum, pet) => sum + pet.interestedCount,
    0,
  );
  const activeChatCount = pets.reduce((sum, pet) => sum + pet.activeChats, 0);
  const nearbyCount = pets.filter((pet) => pet.isNearby).length;

  const stats = [
    {
      label: "Available right now",
      value: availableCount,
      icon: <Sparkles className="size-4" />,
    },
    {
      label: "Interested adopters",
      value: interestedCount,
      icon: <Users className="size-4" />,
    },
    {
      label: "Active conversations",
      value: activeChatCount,
      icon: <MessageSquareMore className="size-4" />,
    },
    {
      label: "Nearby matches",
      value: nearbyCount,
      icon: <MapPin className="size-4" />,
    },
  ];

  return (
    <section className="grid gap-2 grid-cols-2 rounded-[30px] border border-primary/10 bg-white p-6">
      {stats.map((stat) => (
        <article key={stat.label} className="">
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {stat.value}
          </p>
          <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
        </article>
      ))}
    </section>
  );
};

export default FeedSummary;
