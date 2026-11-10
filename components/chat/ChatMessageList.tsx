"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RotateCcw, Calendar, AlertCircle } from "lucide-react";
import { type ChatErrorType, type ChatTurn } from "@/lib/gemini";
import { EASE_STANDARD, MOTION_DURATION, usePrefersReducedMotion } from "@/lib/motion";
import { Logo } from "@/components/brand/Logo";
import { WhatsAppButton } from "@/components/overlays/WhatsAppButton";
import { ChatMarkdown } from "./ChatMarkdown";
import { WelcomeSuggestionsGrid } from "./ChatWelcomeAndChips";
import { ChatLeadCard } from "./ChatLeadCard";
import { cn } from "@/lib/utils";

export interface TimedChatMessage extends ChatTurn {
  id: string;
  time: string;
}

export interface InlineChatError {
  type: ChatErrorType;
  message: string;
  failedPrompt: string;
}

export interface ChatMessageListProps {
  messages: TimedChatMessage[];
  streaming: boolean;
  waitingFirstToken: boolean;
  inlineError: InlineChatError | null;
  onRetry: (prompt: string) => void;
  onSelectSuggestion: (prompt: string) => void;
  leadOpen: boolean;
  onCloseLead: () => void;
  onLeadSuccess: (lead: { name: string; email: string; need: string }) => void;
}

export function ChatMessageList({
  messages,
  streaming,
  waitingFirstToken,
  inlineError,
  onRetry,
  onSelectSuggestion,
  leadOpen,
  onCloseLead,
  onLeadSuccess,
}: ChatMessageListProps) {
  const reduced = usePrefersReducedMotion();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const userScrolledUpRef = React.useRef(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    userScrolledUpRef.current = el.scrollHeight - el.scrollTop - el.clientHeight > 56;
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || userScrolledUpRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streaming, waitingFirstToken, inlineError, leadOpen]);

  const hasUserStartedChatting = messages.some((m) => m.role === "user");

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      aria-live="polite"
      className="thin-scrollbar chat-messages-mask flex-1 overflow-y-auto px-4 py-4 space-y-4"
    >
      {messages.map((msg, idx) => {
        const isAssistant = msg.role === "assistant";
        const showCaret =
          isAssistant && streaming && !waitingFirstToken && idx === messages.length - 1;

        return (
          <motion.div
            key={msg.id}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
            className={cn("group flex flex-col gap-1", isAssistant ? "items-start" : "items-end")}
          >
            <div className={cn("flex items-end gap-2.5 max-w-[85%]", !isAssistant && "flex-row-reverse")}>
              {isAssistant && (
                <span className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
                  <Logo variant="monogram" size="sm" className="scale-[0.58]" />
                </span>
              )}

              <div
                style={!isAssistant ? { backgroundImage: "var(--gradient-primary)" } : undefined}
                className={cn(
                  "rounded-card px-4 py-3",
                  isAssistant
                    ? "border border-border bg-surface-2 text-text"
                    : "text-[15px] leading-[1.6] text-on-primary shadow-xs"
                )}
              >
                {isAssistant ? (
                  <ChatMarkdown content={msg.content} showCaret={showCaret} />
                ) : (
                  <p className="whitespace-pre-wrap text-[15px] leading-[1.6] text-on-primary">
                    {msg.content}
                  </p>
                )}
              </div>
            </div>

            <span
              className={cn(
                "px-1 text-[11px] text-text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100",
                isAssistant && "pl-9"
              )}
            >
              {msg.time}
            </span>
          </motion.div>
        );
      })}

      {/* Welcome 2x2 suggestion cards (disappear once user starts chatting) */}
      {!hasUserStartedChatting && (
        <div className="pl-8">
          <WelcomeSuggestionsGrid
            onSelect={(prompt) => {
              userScrolledUpRef.current = false;
              onSelectSuggestion(prompt);
            }}
            disabled={streaming}
          />
        </div>
      )}

      {/* Three-dot typing indicator before the first token arrives */}
      {waitingFirstToken && (
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end gap-2.5"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
            <Logo variant="monogram" size="sm" className="scale-[0.58]" />
          </span>
          <div className="inline-flex items-center gap-1.5 rounded-card border border-border bg-surface-2 px-4 py-3.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:240ms]" />
          </div>
        </motion.div>
      )}

      {/* Small inline notice under the failed message */}
      {inlineError && (
        <motion.div
          role="alert"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
          className="ml-auto max-w-[90%] rounded-card border border-border bg-surface-2 p-3.5 space-y-2.5"
        >
          <div className="flex items-start gap-2 text-xs text-text-muted">
            <AlertCircle
              strokeWidth={1.5}
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
            />
            <p className="leading-relaxed">{inlineError.message}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onRetry(inlineError.failedPrompt)}
              className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:border-primary/50 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RotateCcw strokeWidth={1.5} className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
            <WhatsAppButton variant="compact" label="Chat on WhatsApp" />
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:border-primary/50 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Calendar strokeWidth={1.5} className="h-3.5 w-3.5 text-primary" />
              <span>Book Consultation</span>
            </Link>
          </div>
        </motion.div>
      )}

      {/* In-chat Lead Capture Card */}
      {leadOpen && (
        <ChatLeadCard onClose={onCloseLead} onSuccess={onLeadSuccess} />
      )}
    </div>
  );
}

export default ChatMessageList;
