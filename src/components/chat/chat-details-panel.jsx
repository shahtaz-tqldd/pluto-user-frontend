import React from "react";
import { CalendarDays, MapPin, PawPrint, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatDetailsPanel = ({ conversation }) => {
  return (
    <aside className="hidden min-h-0 w-[19rem] shrink-0 border-l border-primary/10 bg-white p-4 xl:block">
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-primary/10 bg-[#fcfdfb]">
          <img
            src={conversation.petImage}
            alt=""
            className="h-40 w-full object-cover"
          />
          <div className="space-y-3 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Pet profile
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">
                {conversation.petName}
              </h3>
              <p className="text-sm text-slate-500">
                {conversation.petType} · {conversation.petAge}
              </p>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <DetailRow icon={MapPin} text={conversation.location} />
              <DetailRow icon={CalendarDays} text={conversation.meetup} />
              <DetailRow icon={ShieldCheck} text={conversation.status} />
            </div>

            <Button className="h-10 w-full rounded-full shadow-none">
              <PawPrint className="size-4" />
              View pet profile
            </Button>
          </div>
        </div>

        <section className="rounded-2xl border border-primary/10 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-950">
            Adoption checklist
          </h3>
          <div className="mt-3 space-y-3">
            {conversation.checklist.map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 text-sm text-slate-600"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                  <span className="size-2 rounded-full bg-primary" />
                </span>
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

const DetailRow = ({ icon, text }) => {
  const DetailIcon = icon;

  return (
    <div className="flex items-start gap-2">
      <DetailIcon className="mt-0.5 size-4 shrink-0 text-primary" />
      <span>{text}</span>
    </div>
  );
};

export default ChatDetailsPanel;
