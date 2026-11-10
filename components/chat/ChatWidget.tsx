"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  UserCheck,
  Calendar,
  RotateCcw,
} from "lucide-react";
import {
  MAX_CHAT_CONVERSATION_MESSAGES,
  MAX_CHAT_MESSAGE_LENGTH,
  type ChatTurn,
} from "@/lib/gemini";
import { SPRING_PLAYFUL, usePrefersReducedMotion } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/overlays/WhatsAppButton";
import { cn } from "@/lib/utils";

const INITIAL_ASSISTANT_MESSAGE: ChatTurn = {
  role: "assistant",
  content:
    "Hello! I am the EliavaTech assistant. Ask me about our services, founding client pricing, 4-step process, or timelines—or share your name, email, and need for a custom quote.",
};

const QUICK_PROMPTS = [
  "What are your website prices?",
  "How does WhatsApp automation work?",
  "How long does a typical launch take?",
  "I want a custom quote",
] as const;

export interface ChatWidgetProps {
  mode?: "floating" | "full";
  className?: string;
}

export function ChatWidget({ mode = "floating", className }: ChatWidgetProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [open, setOpen] = React.useState(mode === "full");
  const [sessionId] = React.useState(
    () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
  const [messages, setMessages] = React.useState<ChatTurn[]>([
    INITIAL_ASSISTANT_MESSAGE,
  ]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const [showFallback, setShowFallback] = React.useState(false);
  const [fallbackNote, setFallbackNote] = React.useState<string | null>(null);

  const [leadOpen, setLeadOpen] = React.useState(false);
  const [leadName, setLeadName] = React.useState("");
  const [leadEmail, setLeadEmail] = React.useState("");
  const [leadNeed, setLeadNeed] = React.useState("");
  const [leadSaved, setLeadSaved] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, streaming, showFallback, leadOpen]);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || streaming) return;

    if (text === "I want a custom quote") {
      setLeadOpen(true);
    }

    const nextMessages: ChatTurn[] = [
      ...messages,
      { role: "user", content: text.slice(0, MAX_CHAT_MESSAGE_LENGTH) },
    ];

    if (nextMessages.length > MAX_CHAT_CONVERSATION_MESSAGES) {
      setShowFallback(true);
      setFallbackNote(
        "Maximum conversation length reached. Please continue on WhatsApp or book a free consultation call."
      );
      return;
    }

    setMessages(nextMessages);
    setInput("");
    setStreaming(true);
    setShowFallback(false);
    setFallbackNote(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: nextMessages.slice(1), // exclude initial greeting
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || contentType.includes("application/json")) {
        const errData = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setShowFallback(true);
        setFallbackNote(
          errData?.error ||
            "Live AI response is unavailable right now. Reach us directly via WhatsApp or book a call below."
        );
        setStreaming(false);
        return;
      }

      if (!res.body) {
        setShowFallback(true);
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantReply += decoder.decode(value, { stream: true });
        const snapshot = assistantReply;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: snapshot };
          return copy;
        });
      }

      if (!assistantReply.trim()) {
        setShowFallback(true);
      }
    } catch {
      setShowFallback(true);
      setFallbackNote(
        "Connection interrupted. You can message us directly on WhatsApp or book a consultation below."
      );
    } finally {
      setStreaming(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim() || !leadNeed.trim()) return;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: [{ role: "user", content: leadNeed.slice(0, 400) }],
          leadCapture: {
            name: leadName.trim(),
            email: leadEmail.trim(),
            need: leadNeed.trim(),
          },
        }),
      });
      if (res.ok) {
        setLeadSaved(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Thank you, ${leadName.trim()}. I have saved your details (${leadEmail.trim()}) for our founding team. We will reply within one business day.`,
          },
        ]);
      } else {
        setShowFallback(true);
      }
    } catch {
      setShowFallback(true);
    }
  };

  const panelContent = (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-card border border-border bg-surface text-text shadow-[var(--shadow-card-hover)]",
        mode === "full" ? "w-full" : "w-[350px] sm:w-[390px] max-w-[calc(100vw-2rem)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles strokeWidth={1.5} className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-small font-semibold text-text">
                EliavaTech Assistant
              </span>
              <Badge variant="primary" size="sm" dot>AI Grounded</Badge>
            </div>
            <p className="text-[11px] text-text-muted">Services, founding pricing &amp; timelines</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLeadOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-pill border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-surface-2"
          >
            <UserCheck strokeWidth={1.5} className="h-3 w-3" />
            <span>Get Quote</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMessages([INITIAL_ASSISTANT_MESSAGE]);
              setShowFallback(false);
              setFallbackNote(null);
            }}
            aria-label="Reset conversation"
            className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-text-muted hover:text-text"
          >
            <RotateCcw strokeWidth={1.5} className="h-3.5 w-3.5" />
          </button>
          {mode === "floating" && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat assistant"
              className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-text-muted hover:text-text"
            >
              <X strokeWidth={1.5} className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "flex flex-col gap-3 overflow-y-auto bg-bg p-4",
          mode === "full" ? "h-[340px]" : "h-[320px]"
        )}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={cn(
              "max-w-[86%] rounded-card px-3.5 py-2.5 text-xs sm:text-small leading-relaxed whitespace-pre-wrap",
              m.role === "assistant"
                ? "mr-auto border border-border bg-surface text-text"
                : "ml-auto bg-primary text-white"
            )}
          >
            {m.content}
          </div>
        ))}

        {streaming && (
          <div className="mr-auto inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3.5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:240ms]" />
          </div>
        )}

        {leadOpen && !leadSaved && (
          <form onSubmit={handleLeadSubmit} className="rounded-card border border-primary/40 bg-surface p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs font-semibold text-primary">Request a Quote</span>
              <button type="button" onClick={() => setLeadOpen(false)} className="text-xs text-text-muted">Close</button>
            </div>
            <input
              type="text"
              required
              placeholder="Your Name *"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="w-full rounded-input border border-border bg-bg px-3 py-1.5 text-xs text-text"
            />
            <input
              type="email"
              required
              placeholder="Business Email *"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              className="w-full rounded-input border border-border bg-bg px-3 py-1.5 text-xs text-text"
            />
            <input
              type="text"
              required
              placeholder="Project Need *"
              value={leadNeed}
              onChange={(e) => setLeadNeed(e.target.value)}
              className="w-full rounded-input border border-border bg-bg px-3 py-1.5 text-xs text-text"
            />
            <Button type="submit" variant="primary" size="sm" fullWidth>Submit Details</Button>
          </form>
        )}

        {showFallback && (
          <div className="rounded-card border border-gold/40 bg-surface p-4 space-y-3">
            <p className="text-xs text-text-muted">
              {fallbackNote || "Connect with our founding team directly on WhatsApp or book a free consultation:"}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <WhatsAppButton variant="inline" label="Chat on WhatsApp" />
              <Link href="/contact#main-content">
                <Button variant="secondary" size="sm" leftIcon={<Calendar strokeWidth={1.5} className="h-3.5 w-3.5" />}>
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border bg-surface-2/60 px-3 py-2">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => sendMessage(q)}
            disabled={streaming}
            className="shrink-0 rounded-pill border border-border bg-surface px-2.5 py-1 text-[11px] text-text-muted hover:text-text"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="border-t border-border bg-surface p-3 space-y-2"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_CHAT_MESSAGE_LENGTH}
            placeholder="Ask about services, pricing, or timelines..."
            aria-label="Ask the EliavaTech AI assistant"
            className="flex-1 rounded-pill border border-border bg-bg px-3.5 py-2 text-xs text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            aria-label="Send message"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-primary text-white disabled:opacity-45 hover:bg-primary-hover"
          >
            <Send strokeWidth={1.5} className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-text-muted">
          Conversations may be stored to improve our service.
        </p>
      </form>
    </div>
  );

  if (mode === "full") {
    return panelContent;
  }

  return (
    <div className="fixed bottom-20 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 16 }}
            transition={SPRING_PLAYFUL}
            style={{ transformOrigin: "bottom right" }}
          >
            {panelContent}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Toggle EliavaTech AI assistant"
        className="glass-surface inline-flex items-center gap-2.5 rounded-pill border border-primary/50 px-4 py-3 text-small font-medium text-text shadow-[var(--shadow-card-hover)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
          <Sparkles strokeWidth={1.5} className="h-4 w-4" />
        </span>
        <span className="hidden sm:inline text-xs font-medium text-text">
          {open ? "Close Assistant" : "AI Assistant"}
        </span>
      </button>
    </div>
  );
}

export default ChatWidget;
