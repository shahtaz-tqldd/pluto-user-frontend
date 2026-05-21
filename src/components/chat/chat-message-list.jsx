import React from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const ChatMessageList = ({
  messages,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}) => {
  const bottomRef = React.useRef(null);
  const [revealedMessageIds, setRevealedMessageIds] = React.useState({});

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const toggleTimestamp = (messageId) => {
    setRevealedMessageIds((current) => ({
      ...current,
      [messageId]: !current[messageId],
    }));
  };

  return (
    <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#fffaf5] px-4 py-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        {hasMore && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="mx-auto rounded-full border border-primary/15 bg-white px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? "Loading..." : "Load more messages"}
          </button>
        )}

        {messages.map((message) => {
          const isMine = Boolean(message.is_mine || message.sender === "me");
          const isTimestampRevealed = Boolean(revealedMessageIds[message.id]);

          return (
            <button
              key={message.id}
              type="button"
              onClick={() => toggleTimestamp(message.id)}
              className={cn(
                "flex flex-col text-left outline-none",
                isMine ? "items-end" : "items-start",
              )}
              aria-expanded={isTimestampRevealed}
            >
              <div
                className={cn(
                  "max-w-[82%] rounded-2xl text-sm sm:max-w-[68%]",
                  message.imageUrl ? "overflow-hidden p-1" : "px-4 py-3",
                  isMine
                    ? "rounded-br-md bg-primary text-white"
                    : "rounded-bl-md border border-primary/10 bg-white text-slate-700",
                )}
              >
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt={message.fileName || ""}
                    className="max-h-80 rounded-xl object-cover"
                  />
                )}
                {message.body && (
                  <p className={message.imageUrl ? "px-3 py-2" : ""}>
                    {message.body}
                  </p>
                )}
              </div>

              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out",
                  isTimestampRevealed
                    ? "mt-1 grid-rows-[1fr] opacity-100"
                    : "mt-0 grid-rows-[0fr] opacity-0",
                  isMine ? "justify-end pr-1" : "justify-start pl-1",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <span className="flex items-center gap-1.5 text-[10px] leading-none text-slate-400">
                    <span>{message.time}</span>
                    {isMine && (
                      <span className="flex size-4 items-center justify-center rounded-full border border-gray-200 bg-white text-primary">
                        <CheckCheck className="size-2.5" />
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;
