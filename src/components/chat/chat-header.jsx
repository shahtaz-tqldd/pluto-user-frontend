import React from "react";
import {
  Ban,
  Flag,
  Info,
  MoreVertical,
  Phone,
  Trash2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

const ChatHeader = ({ conversation, isDetailsOpen, onToggleDetails }) => {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-primary/10 bg-white px-4 py-3">
      <div className="relative">
        {conversation.avatar ? (
          <img
            src={conversation.avatar}
            alt=""
            className="size-11 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-11 items-center justify-center rounded-full bg-[#d7efe2] text-sm font-semibold text-primary">
            {getInitials(conversation.personName)}
          </span>
        )}
        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-bold text-slate-950">
          {conversation.personName}
        </h2>
        <p className="truncate text-xs text-slate-500">
          Asking about {conversation.petName} · {conversation.status}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden rounded-full text-slate-600 hover:bg-primary/5 hover:text-primary sm:inline-flex"
          aria-label="Start phone call"
        >
          <Phone className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden rounded-full text-slate-600 hover:bg-primary/5 hover:text-primary sm:inline-flex"
          aria-label="Start video call"
        >
          <Video className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full text-slate-600 hover:bg-primary/5 hover:text-primary"
              aria-label="More chat actions"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit rounded-xl p-1">
            <DropdownMenuItem
              onClick={onToggleDetails}
              className="rounded-lg px-3 py-2 text-sm"
            >
              <Info className="size-4" />
              {isDetailsOpen ? "Hide details" : "View details"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm">
              <Ban className="size-4" />
              Block
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm">
              <Flag className="size-4" />
              Report
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="rounded-lg px-3 py-2 text-sm"
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;
