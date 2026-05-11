import React from "react";
import { ImagePlus, Paperclip, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatComposer = ({ value, onChange, onSend }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSend();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-primary/10 bg-white p-3 sm:p-4"
    >
      <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden rounded-full text-slate-500 hover:bg-primary/5 hover:text-primary sm:inline-flex"
          aria-label="Attach file"
        >
          <Paperclip className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden rounded-full text-slate-500 hover:bg-primary/5 hover:text-primary sm:inline-flex"
          aria-label="Attach image"
        >
          <ImagePlus className="size-4" />
        </Button>

        <div className="flex min-h-12 flex-1 items-end gap-2 rounded-2xl border border-primary/15 bg-[#fcfdfb] px-3 py-2 focus-within:ring-2 focus-within:ring-primary/15">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Write a message..."
            className="max-h-28 min-h-8 flex-1 resize-none bg-transparent py-1 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full text-slate-500 hover:bg-primary/5 hover:text-primary"
            aria-label="Add emoji"
          >
            <Smile className="size-4" />
          </Button>
        </div>

        <Button
          type="submit"
          size="icon"
          className="size-12 rounded-full shadow-none"
          disabled={!value.trim()}
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatComposer;
