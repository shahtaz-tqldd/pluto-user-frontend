import React from "react";
import {
  CalendarDays,
  Download,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";

const ChatDetailsPanel = ({ conversation, messages = [], onClose }) => {
  const [conversationSearch, setConversationSearch] = React.useState("");
  const searchValue = conversationSearch.trim().toLowerCase();
  const matchedMessages = searchValue
    ? messages.filter((message) =>
        message.body.toLowerCase().includes(searchValue),
      )
    : [];
  const sharedImages = conversation.sharedImages || [];
  const sharedFiles = conversation.sharedFiles || [];

  return (
    <aside className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm min-h-0 flex-col border-l border-primary/10 bg-white shadow-xl lg:static lg:w-[21rem] lg:shadow-none">
      <div className="flex shrink-0 items-center justify-between border-b border-primary/10 px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-slate-950">Details</h3>
          <p className="text-xs text-slate-500">Conversation profile</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:bg-primary/5 hover:text-primary"
          aria-label="Close details"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            {conversation.avatar ? (
              <img
                src={conversation.avatar}
                alt=""
                className="size-14 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#d7efe2] text-base font-semibold text-primary">
                {getInitials(conversation.personName)}
              </span>
            )}
            <div className="min-w-0">
              <h4 className="truncate text-base font-bold text-slate-950">
                {conversation.personName}
              </h4>
              <p className="truncate text-sm text-slate-500">
                Asking about {conversation.petName}
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-primary/10 bg-[#fcfdfb] p-3 text-sm text-slate-600">
            <DetailRow icon={MapPin} text={conversation.location} />
            <DetailRow icon={CalendarDays} text={conversation.meetup} />
            <DetailRow icon={ShieldCheck} text={conversation.status} />
          </div>
        </section>

        <section>
          <label className="relative block">
            <span className="sr-only">Search in conversation</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/60" />
            <Input
              value={conversationSearch}
              onChange={(event) => setConversationSearch(event.target.value)}
              placeholder="Search in conversation"
              className="h-11 rounded-full border-primary/15 bg-[#fcfdfb] pl-10 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </label>

          {searchValue && (
            <div className="mt-3 space-y-2">
              {matchedMessages.length > 0 ? (
                matchedMessages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-xl border border-primary/10 bg-white p-3 text-sm"
                  >
                    <p className="line-clamp-2 text-slate-700">{message.body}</p>
                    <p className="mt-1 text-xs text-slate-400">{message.time}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-primary/20 px-3 py-4 text-center text-sm text-slate-500">
                  No matching messages.
                </p>
              )}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-950">Shared images</h4>
            <span className="text-xs font-semibold text-slate-400">
              {sharedImages.length}
            </span>
          </div>
          {sharedImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {sharedImages.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt=""
                  className="aspect-square rounded-lg object-cover"
                />
              ))}
            </div>
          ) : (
            <EmptyState text="No shared images yet." />
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-950">Shared files</h4>
            <span className="text-xs font-semibold text-slate-400">
              {sharedFiles.length}
            </span>
          </div>
          <div className="space-y-2">
            {sharedFiles.length > 0 ? (
              sharedFiles.map((file) => <FileRow key={file} name={file} />)
            ) : (
              <EmptyState text="No shared files yet." />
            )}
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

const FileRow = ({ name }) => (
  <button
    type="button"
    className="flex w-full items-center gap-3 rounded-xl border border-primary/10 bg-white p-3 text-left transition hover:bg-primary/5"
  >
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <FileText className="size-4" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-semibold text-slate-700">
        {name}
      </span>
      <span className="text-xs text-slate-400">Shared file</span>
    </span>
    <Download className="size-4 shrink-0 text-slate-400" />
  </button>
);

const EmptyState = ({ text }) => (
  <p className="rounded-xl border border-dashed border-primary/20 px-3 py-4 text-center text-sm text-slate-500">
    {text}
  </p>
);

export default ChatDetailsPanel;
