import React from "react";
import CreatePetPostDialog from "@/features/pets/components/create-pet-post-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Users } from "lucide-react";

const FeedSummary = () => {
  const totalRescued = 200;
  const totalAdopted = 150;
  const stats = [
    {
      label: "Total Rescued",
      value: totalRescued,
      icon: <Sparkles className="size-4" />,
    },
    {
      label: "Total Adopted",
      value: totalAdopted,
      icon: <Users className="size-4" />,
    },
  ];

  return (
    <section className="rounded-[30px] border border-primary/10 bg-white p-6">
      <div className="grid gap-2 grid-cols-2 mb-6">
        {stats.map((stat) => (
          <article key={stat.label} className="">
            <p className="mb-1 text-sm text-slate-500">{stat.label}</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </p>
              <span className="text-sm opacity-60 pb-1">animals</span>
            </div>
          </article>
        ))}
      </div>
      <CreatePetPostDialog
        trigger={
          <Button className="h-11 rounded-full w-full px-4 shadow-none">
            <Plus className="size-4" />
            Upload a Pet
          </Button>
        }
      />
    </section>
  );
};

export default FeedSummary;
