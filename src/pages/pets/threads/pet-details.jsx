import React from "react";

import PetImageCarousel from "@/pages/feeds/components/pet-image-carousel";
import { getDaysSinceUpload } from "@/pages/feeds/utils/feed-utils";
import { cn, titleCase } from "@/lib/utils";

const PetDetails = ({ pet }) => {
  const images = [
    pet.primary_image,
    ...(Array.isArray(pet.images)
      ? pet.images
          .slice()
          .sort((left, right) => left.sort_order - right.sort_order)
          .map((image) => image.image_url)
      : []),
  ].filter(Boolean);

  const uniqueImages = [...new Set(images)];
  const species = titleCase(pet.species);
  const gender = titleCase(pet.gender);
  const size = titleCase(pet.size);
  const status = titleCase(pet.status);
  const available = pet.status === "AVAILABLE";
  const uploadedLabel = getDaysSinceUpload(pet.created_at);

  const careFacts = [
    { label: "Age", value: pet.age },
    { label: "Gender", value: gender },
    { label: "Size", value: size },
    { label: "Color", value: pet.color || "Not set" },
  ];

  const healthFacts = [
    { label: "Vaccinated", value: pet.vaccinated ? "Yes" : "Not confirmed" },
    { label: "Sterilized", value: pet.sterilized ? "Yes" : "Not confirmed" },
  ];

  return (
    <section className="min-w-0 overflow-hidden rounded-[28px] border border-primary/10 bg-white shadow-[0_18px_48px_rgba(2,24,19,0.08)] lg:col-span-3">
      <div className="relative h-[420px] bg-[#eef8f2]">
        <PetImageCarousel
          key={pet.id}
          images={uniqueImages}
          alt={`${pet.title} photos`}
          className="h-full"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold backdrop-blur",
              available
                ? "bg-[#e8fff3]/95 text-[#0d7a4c]"
                : "bg-[#fff2dc]/95 text-[#996515]",
            )}
          >
            {status}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
            {species}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041612]/95 via-[#041612]/72 to-transparent px-6 pb-6 pt-16 text-white">
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {pet.title || "Unnamed pet"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/80">
            {pet.temperament}
          </p>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div>
          <p className="text-sm font-semibold">{pet.current_location}</p>
          <span className="text-xs text-slate-500">{uploadedLabel}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {careFacts.map((item) => (
            <InfoTile key={item.label} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-8 rounded-[24px] border border-primary/10 bg-[#f8faf8] p-4">
          {healthFacts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-start justify-between gap-4 last:border-0 last:pb-0"
            >
              <span className="text-sm text-slate-500">{fact.label}</span>
              <span className="text-right text-sm font-semibold text-slate-900">
                {fact.value}
              </span>
            </div>
          ))}
        </div>

        <SectionBlock title="Story" content={pet.story} />
        <SectionBlock title="Medical notes" content={pet.medical_notes} />
      </div>
    </section>
  );
};

export default PetDetails;

const InfoTile = ({ label, value }) => (
  <div className="rounded-[22px] border border-primary/10 bg-[#f8faf8] p-4">
    <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-800">
      {value || "Not set"}
    </p>
  </div>
);

const SectionBlock = ({ title, content }) => (
  <div className="rounded-[24px] border border-primary/10 bg-white p-5">
    <h3 className="text-base font-bold text-slate-900">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-600">
      {content || "Not set"}
    </p>
  </div>
);
