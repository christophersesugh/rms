"use client";

import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { MessageCircleIcon, XIcon, SendIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// AI SDK v6 message part shapes (UIMessage.parts)
type TextPart = { type: "text"; text: string };
type ToolPart = {
  type: string; // "tool-checkAvailability", "tool-createReservation", ...
  toolCallId: string;
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
  output?: { message?: string; available?: boolean; status?: string };
  errorText?: string;
};

const suggestions = [
  "Book the next available workspace",
  "Find a venue for 100 people",
  "Show my reservations",
  "Change the date of a reservation",
  "Cancel a reservation",
];

const toolLabels: Record<string, string> = {
  searchResources: "Searching",
  findNextAvailable: "Finding next available",
  checkAvailability: "Checking availability",
  createReservation: "Booking",
  updateReservation: "Updating reservation",
  cancelReservation: "Cancelling reservation",
  listReservations: "Fetching reservations",
};

function ToolStatus({ part }: { part: ToolPart }) {
  const toolName = part.type.replace(/^tool-/, "");
  const label = toolLabels[toolName] ?? `Running ${toolName}`;

  if (part.state === "output-error") {
    return (
      <div className="text-xs mt-1 text-destructive">
        {part.errorText ?? "Something went wrong."}
      </div>
    );
  }

  if (part.state === "output-available") {
    const result = part.output;
    if (result?.message) {
      return (
        <div className="text-xs mt-1 text-muted-foreground">
          {result.message}
        </div>
      );
    }
    if (result?.available !== undefined) {
      return (
        <div className="text-xs mt-1 text-muted-foreground">
          {result.available ? "Available ✓" : "Not available"}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
      <Loader2Icon className="h-3 w-3 animate-spin" />
      <em>{label}...</em>
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const router = useRouter();
  const { messages, sendMessage, status, error } = useChat({
    // When the agent finishes a turn (it may have booked/updated/cancelled),
    // refresh server components so the visible page reflects the new state.
    onFinish: () => router.refresh(),
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBusy) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    if (isBusy) return;
    sendMessage({ text });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-2xl transition-transform duration-200 hover:scale-105 active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? <XIcon className="h-6 w-6" /> : <MessageCircleIcon className="h-6 w-6" />}
        </Button>
      </div>

      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-200 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Card className="w-80 md:w-96 max-w-[calc(100vw-2rem)] flex flex-col shadow-2xl glass-card" style={{ maxHeight: "min(70vh, 500px)" }}>
          <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-lg flex items-center">
              <MessageCircleIcon className="mr-2 h-5 w-5" /> ReserveSync AI
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <XIcon className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="text-center text-sm text-destructive">
                Chat unavailable. Check your API key or try again later.
              </div>
            )}
            {messages.length === 0 && !error ? (
              <div className="mt-6">
                <p className="text-center text-sm text-muted-foreground">
                  Hi! I can help you find and book venues and workspaces. Try one of these:
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSuggestion(s)}
                      disabled={isBusy}
                      className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary/70 disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (messages as any[]).map((m: any) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary/50 backdrop-blur-md rounded-bl-none"
                    }`}
                  >
                    {m.parts?.map((part: TextPart | ToolPart, i: number) => {
                      if (part.type === "text") {
                        return <span key={i}>{(part as TextPart).text}</span>;
                      }
                      if (part.type.startsWith("tool-")) {
                        const tool = part as ToolPart;
                        return <ToolStatus key={tool.toolCallId ?? i} part={tool} />;
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="p-3 border-t border-border shrink-0">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about venues..."
                className="flex-1 bg-background/50 border-border"
                disabled={isBusy}
                aria-label="Chat input"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isBusy}>
                {isBusy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
