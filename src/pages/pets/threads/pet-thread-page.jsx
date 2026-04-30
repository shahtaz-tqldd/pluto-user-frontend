import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  Lock,
  MessageCircle,
  PawPrint,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePetDetailsQuery } from "@/features/pets/petApiSlice";
import PetImageCarousel from "@/pages/feeds/components/pet-image-carousel";
import { getDaysSinceUpload } from "@/pages/feeds/utils/feed-utils";
import { cn } from "@/lib/utils";

const titleCase = (value) =>
  value
    ? value
        .toString()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "";

const getStoredStatus = (petId) => {
  if (typeof window === "undefined") return "idle";

  return window.localStorage.getItem(`pet-adoption-status-${petId}`) || "idle";
};

const setStoredStatus = (petId, status) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(`pet-adoption-status-${petId}`, status);
};

const PetThreadPage = () => {
  const { petId } = useParams();

  return <PetThreadContent key={petId} petId={petId} />;
};

const PetThreadContent = ({ petId }) => {
  const { user } = useSelector((state) => state.auth);
  const { data, isError, isLoading } = usePetDetailsQuery(petId);

  const pet = data?.data || null;
  const [requestStatus, setRequestStatus] = React.useState(() =>
    getStoredStatus(petId),
  );
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  const updateRequestStatus = (status) => {
    setRequestStatus(status);
    setStoredStatus(petId, status);

    if (status === "accepted") {
      setMessages([
        {
          id: "system-accepted",
          author: pet?.rescuer_name || "Post owner",
          body: "Your adoption request has been accepted. Share your home details and preferred visit time.",
          align: "left",
        },
      ]);
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (!draft.trim() || requestStatus !== "accepted") return;

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        author: user?.name || user?.username || "You",
        body: draft.trim(),
        align: "right",
      },
    ]);
    setDraft("");
  };

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
    { label: "Species", value: species },
    { label: "Age", value: pet.age },
    { label: "Gender", value: gender },
    { label: "Size", value: size },
    { label: "Color", value: pet.color || "Not set" },
    { label: "Location", value: pet.current_location },
  ];
  const healthFacts = [
    { label: "Vaccinated", value: pet.vaccinated ? "Yes" : "Not confirmed" },
    { label: "Sterilized", value: pet.sterilized ? "Yes" : "Not confirmed" },
    { label: "Temperament", value: pet.temperament || "Not set" },
    { label: "Uploaded", value: uploadedLabel },
  ];

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
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
              <p className="text-sm font-medium text-white/75">
                Adoption profile
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                {pet.title || "Unnamed pet"}
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/80">
                {species} {gender ? `, ${gender}` : ""}{" "}
                {size ? `, ${size}` : ""}. Posted by {pet.rescuer_name}.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {careFacts.map((item) => (
                  <InfoTile key={item.label} {...item} />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <MetricTile
                  label="Interested"
                  value={pet.interested_count ?? 0}
                />
                <MetricTile
                  label="Active chats"
                  value={pet.active_conversation_count ?? 0}
                />
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <SectionBlock title="Story" content={pet.story} />
              <div className="space-y-3 rounded-[24px] border border-primary/10 bg-[#f8faf8] p-4">
                {healthFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-start justify-between gap-4 border-b border-primary/8 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-500">{fact.label}</span>
                    <span className="text-right text-sm font-semibold text-slate-900">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <SectionBlock title="Medical notes" content={pet.medical_notes} />
          </div>
        </section>

        <aside className="sticky top-5 overflow-hidden rounded-[28px] border border-primary/10 bg-white shadow-[0_18px_48px_rgba(2,24,19,0.08)] lg:col-span-2">
          <div className="border-b border-primary/10 bg-[#f8faf8] p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-white">
                <MessageCircle className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Adoption thread
                </h2>
                <p className="text-sm text-slate-500">
                  {pet.rescuer_name || "Post owner"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <RequestPanel
              status={requestStatus}
              onRequest={() => updateRequestStatus("pending")}
              onAccept={() => updateRequestStatus("accepted")}
            />

            <div className="flex h-[520px] flex-col rounded-[24px] border border-primary/10 bg-[#fbfdfb]">
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                {requestStatus !== "accepted" ? (
                  <LockedThread />
                ) : (
                  messages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                  ))
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="flex gap-2 border-t border-primary/10 p-3"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={requestStatus !== "accepted"}
                  placeholder={
                    requestStatus === "accepted"
                      ? "Write a message"
                      : "Chat unlocks after acceptance"
                  }
                  className="min-w-0 flex-1 rounded-full border border-primary/10 bg-white px-4 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary/40 disabled:bg-slate-100"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full"
                  disabled={requestStatus !== "accepted" || !draft.trim()}
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const InfoTile = ({ label, value }) => (
  <div className="rounded-[22px] border border-primary/10 bg-[#f8faf8] p-4">
    <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-800">
      {value || "Not set"}
    </p>
  </div>
);

const MetricTile = ({ label, value }) => (
  <div className="rounded-[22px] bg-primary px-4 py-3 text-white">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs font-semibold text-white/75">{label}</p>
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

const RequestPanel = ({ status, onRequest, onAccept }) => {
  if (status === "accepted") {
    return (
      <div className="rounded-[24px] border border-[#bfe8d0] bg-[#f0fff6] p-4 text-[#0d7a4c]">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="size-4" />
          Request accepted
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="space-y-3 rounded-[24px] border border-[#f4d7a7] bg-[#fff9ed] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#996515]">
          <CalendarDays className="size-4" />
          Adoption request sent
        </div>
        <Button
          type="button"
          className="w-full rounded-full"
          onClick={onAccept}
        >
          <CheckCircle2 className="size-4" />
          Accept request
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-[24px] border border-primary/10 bg-[#f8faf8] p-4">
      <p className="text-sm leading-6 text-slate-600">
        Send an adoption request before starting a direct conversation with the
        post owner.
      </p>
      <Button type="button" className="w-full rounded-full" onClick={onRequest}>
        <PawPrint className="size-4" />
        Request adoption
      </Button>
    </div>
  );
};

const LockedThread = () => (
  <div className="flex h-full flex-col items-center justify-center px-6 text-center text-slate-500">
    <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
      <Lock className="size-5" />
    </div>
    <p className="text-sm font-semibold text-slate-800">Thread locked</p>
    <p className="mt-2 text-sm leading-6">
      The conversation opens after the adoption request is accepted.
    </p>
  </div>
);

const ChatBubble = ({ message }) => (
  <div
    className={cn(
      "flex",
      message.align === "right" ? "justify-end" : "justify-start",
    )}
  >
    <div
      className={cn(
        "max-w-[82%] rounded-[22px] px-4 py-3 text-sm shadow-sm",
        message.align === "right"
          ? "bg-primary text-white"
          : "border border-primary/10 bg-white text-slate-700",
      )}
    >
      <p className="text-xs font-semibold opacity-70">{message.author}</p>
      <p className="mt-1 leading-6">{message.body}</p>
    </div>
  </div>
);

const PageStatus = ({ icon, message }) => (
  <div className="py-6">
    <div className="flex items-center justify-center gap-2 rounded-[28px] border border-primary/10 bg-white px-6 py-10 text-center text-sm font-medium text-slate-500 shadow-[0_16px_50px_rgba(2,24,19,0.05)]">
      {icon}
      {message}
    </div>
  </div>
);

export default PetThreadPage;
