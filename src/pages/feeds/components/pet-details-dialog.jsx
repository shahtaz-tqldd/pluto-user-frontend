import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle, PawPrint, ShieldCheck, Users } from "lucide-react";
import { getDaysSinceUpload } from "../utils/feed-utils";
import PetImageCarousel from "./pet-image-carousel";

const PetDetailsDialog = ({ pet, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[28px] border-primary/10 p-0 sm:max-w-3xl">
        {pet ? (
          <div className="grid gap-0 lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]">
            <div className="relative min-h-[260px] bg-[#eef8f2]">
              <PetImageCarousel
                key={pet.id}
                images={pet.images}
                alt={`${pet.name} photos`}
                className="min-h-[260px]"
              />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-800">
                  {pet.petType}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    pet.available
                      ? "bg-[#e8fff3] text-[#0d7a4c]"
                      : "bg-[#fff2dc] text-[#996515]"
                  }`}
                >
                  {pet.status}
                </span>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <DialogHeader className="space-y-2 text-left">
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {pet.name}
                </DialogTitle>
                <DialogDescription className="text-sm leading-6 text-slate-500">
                  {pet.label}. {getDaysSinceUpload(pet.uploadedAt)} by{" "}
                  {pet.rescuerName}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoTile title="Color" value={pet.color || pet.breed} icon={<PawPrint className="size-4" />} />
                <InfoTile title="Gender" value={pet.gender} icon={<Users className="size-4" />} />
                <InfoTile title="Age" value={pet.age} icon={<ShieldCheck className="size-4" />} />
                <InfoTile title="Location" value={pet.location} icon={<MapPin className="size-4" />} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DemandTile label="Interested adopters" value={pet.interestedCount} />
                <DemandTile label="Active conversations" value={pet.activeChats} />
              </div>

              <div className="space-y-4">
                <SectionBlock title="About this pet" content={pet.description} />
                <SectionBlock title="Rescue context" content={pet.rescueNote} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="rounded-full sm:flex-1">
                  <MessageCircle className="size-4" />
                  Start adoption conversation
                </Button>
                <Button variant="outline" className="rounded-full border-primary/15 sm:flex-1">
                  Save to shortlist
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

const InfoTile = ({ title, value, icon }) => {
  return (
    <div className="rounded-3xl border border-primary/10 bg-[#f8faf8] p-4">
      <div className="mb-3 inline-flex rounded-2xl bg-white p-2 text-primary shadow-sm">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
};

const DemandTile = ({ label, value }) => {
  return (
    <div className="rounded-3xl bg-primary px-5 py-4 text-white">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-white/75">{label}</p>
    </div>
  );
};

const SectionBlock = ({ title, content }) => {
  return (
    <div className="rounded-3xl border border-primary/10 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{content}</p>
    </div>
  );
};

export default PetDetailsDialog;
