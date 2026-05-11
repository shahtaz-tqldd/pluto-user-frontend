import React from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const ChatMessageList = ({ messages }) => {
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  return (
    <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#fffaf5] px-4 py-5">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        {messages.map((message) => {
          const isMine = message.sender === "me";

          return (
            <div
              key={message.id}
              className={cn(
                "flex",
                isMine ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[68%]",
                  isMine
                    ? "rounded-br-md bg-primary text-white"
                    : "rounded-bl-md border border-primary/10 bg-white text-slate-700",
                )}
              >
                <p>{message.body}</p>
                <div
                  className={cn(
                    "mt-2 flex items-center justify-end gap-1 text-[11px]",
                    isMine ? "text-white/75" : "text-slate-400",
                  )}
                >
                  <span>{message.time}</span>
                  {isMine && <CheckCheck className="size-3.5" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;
