import React from "react";
import { FolderOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn, getInitials } from "@/lib/utils";

const ChatConversationList = ({
  conversations,
  activeConversationId,
  activeTab,
  tabCounts,
  searchTerm,
  onTabChange,
  onSearchChange,
  onSelectConversation,
}) => {
  const tabs = [
    { value: "ongoing", label: "Ongoing" },
    { value: "request", label: "Request" },
    { value: "blocked", label: "Blocked" },
  ];

  return (
    <aside className="flex h-full min-h-0 flex-col border-b border-primary/10 lg:w-[22rem] lg:border-b-0 lg:border-r">
      <div className="shrink-0 space-y-4 border-b border-primary/10 py-3 pr-3">
        <div className="grid grid-cols-3 gap-1 rounded-full border border-primary/10 bg-[#f6faf7] p-1">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            const count = tabCounts?.[tab.value] || 0;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "flex h-9 min-w-0 items-center justify-center gap-1 rounded-full px-2 text-xs font-semibold transition",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-500 hover:bg-white hover:text-primary",
                )}
              >
                <span className="truncate">{tab.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "inline-flex min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                      isActive
                        ? "bg-white text-primary"
                        : "bg-[#ffcf36] text-slate-950",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <label className="relative block">
          <span className="sr-only">Search conversations</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/60" />
          <Input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search people"
            className="h-11 rounded-full border-primary/15 bg-[#fcfdfb] pl-10 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </label>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto py-3 pr-3">
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
                    ? "bg-primary/5 text-primary"
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
                    <span className="ml-auto shrink-0 text-[10px] text-slate-400">
                      {conversation.lastTime}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-slate-400">
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
          <div className="px-4 py-12 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
            <FolderOpen strokeWidth={1} size={32} />
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
