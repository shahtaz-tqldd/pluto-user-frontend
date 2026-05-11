import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn, getInitials } from "@/lib/utils";

const ChatConversationList = ({
  conversations,
  activeConversationId,
  searchTerm,
  onSearchChange,
  onSelectConversation,
}) => {
  return (
    <aside className="flex h-full min-h-0 flex-col border-b border-primary/10 bg-white lg:w-[21rem] lg:border-b-0 lg:border-r">
      <div className="shrink-0 space-y-4 border-b border-primary/10 p-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-950">
            Messages
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Adoption chats and rescue updates
          </p>
        </div>

        <label className="relative block">
          <span className="sr-only">Search conversations</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/60" />
          <Input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search people or pets"
            className="h-11 rounded-full border-primary/15 bg-[#fcfdfb] pl-10 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </label>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {conversations.length > 0 ? (
          conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl p-3 text-left transition",
                  isActive
                    ? "bg-primary text-white shadow-[0_14px_34px_rgba(209,70,28,0.22)]"
                    : "bg-white hover:bg-primary/5",
                )}
              >
                <Avatar
                  name={conversation.personName}
                  src={conversation.avatar}
                  className={isActive ? "bg-white/20 text-white" : ""}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">
                      {conversation.personName}
                    </span>
                    <span
                      className={cn(
                        "ml-auto shrink-0 text-xs",
                        isActive ? "text-white/75" : "text-slate-400",
                      )}
                    >
                      {conversation.lastTime}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1 block truncate text-xs font-medium",
                      isActive ? "text-white/80" : "text-primary",
                    )}
                  >
                    {conversation.petName}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block truncate text-sm",
                      isActive ? "text-white/80" : "text-slate-500",
                    )}
                  >
                    {conversation.lastMessage}
                  </span>
                </span>
                {conversation.unread > 0 && (
                  <span
                    className={cn(
                      "mt-7 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isActive
                        ? "bg-white text-primary"
                        : "bg-[#ffcf36] text-slate-950",
                    )}
                  >
                    {conversation.unread}
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/20 px-4 py-8 text-center text-sm text-slate-500">
            No conversations found.
          </div>
        )}
      </div>
    </aside>
  );
};

const Avatar = ({ name, src, className }) => {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="size-11 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full bg-[#d7efe2] text-sm font-semibold text-primary",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
};

export default ChatConversationList;
