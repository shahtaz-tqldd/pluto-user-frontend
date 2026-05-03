import React from "react";
import { useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { usePetDetailsQuery } from "@/features/pets/petApiSlice";
import PetDetails from "./pet-details";
import CurrentThread from "./threads";

const PetThreadPage = () => {
  const { petId } = useParams();

  return <PetThreadContent key={petId} petId={petId} />;
};

const PetThreadContent = ({ petId }) => {
  const { data, isError, isLoading } = usePetDetailsQuery(petId);

  const pet = data?.data || null;

  if (isLoading) {
    return (
      <PageStatus
        icon={<LoaderCircle className="size-5 animate-spin" />}
        message="Loading pet details..."
      />
    );
  }

  if (isError) {
    return <PageStatus message="Could not load pet details right now." />;
  }

  if (!pet) {
    return <PageStatus message="Pet details were not found." />;
  }

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
        <PetDetails pet={pet} />
        <CurrentThread pet={pet} petId={petId} />
      </div>
    </div>
  );
};

const PageStatus = ({ icon, message }) => (
  <div className="py-6">
    <div className="flex items-center justify-center gap-2 rounded-[28px] border border-primary/10 bg-white px-6 py-10 text-center text-sm font-medium text-slate-500 shadow-[0_16px_50px_rgba(2,24,19,0.05)]">
      {icon}
      {message}
    </div>
  </div>
);

export default PetThreadPage;
