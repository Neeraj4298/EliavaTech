"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import {
  MAX_CHAT_CONVERSATION_MESSAGES,
  MAX_CHAT_MESSAGE_LENGTH,
  type ChatErrorType,
} from "@/lib/gemini";
import { EASE_STANDARD, SPRING_PLAYFUL, usePrefersReducedMotion } from "@/lib/motion";
import { trackChatStart } from "@/lib/analytics";
import { ChatHeader } from "./ChatHeader";
import {
  ChatMessageList,
  type InlineChatError,
  type TimedChatMessage,
} from "./ChatMessageList";
import {
  FollowUpChipsBar,
  getContextualFollowUpChips,
} from "./ChatWelcomeAndChips";
import { ChatLauncherGroup } from "./ChatLauncherGroup";
import { cn } from "@/lib/utils";

function formatNowTime(): string {
  try {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Just now";
  }
}

const GREETING_TEXT =
  "Hello! I am the EliavaTech assistant. Ask me about our services, founding client pricing, 4-step process, or timelines.";

export interface ChatWidgetProps {
  mode?: "floating" | "full";
  className?: string;
}

export function ChatWidget({ mode = "floating", className }: ChatWidgetProps) {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = React.useState(mode === "full");
  const [sessionId] = React.useState(
    () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
  const [messages, setMessages] = React.useState<TimedChatMessage[]>(() => [
    { id: "greeting", role: "assistant", content: GREETING_TEXT, time: "Now" },
  ]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const [waitingFirstToken, setWaitingFirstToken] = React.useState(false);
  const [inlineError, setInlineError] = React.useState<InlineChatError | null>(null);
  const [leadOpen, setLeadOpen] = React.useState(false);
  const [cookieOffset, setCookieOffset] = React.useState(0);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const launcherRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const measureBanner = () => {
      const banner = document.querySelector<HTMLElement>("[data-cookie-banner]");
      setCookieOffset(banner && banner.offsetHeight > 0 ? banner.offsetHeight + 12 : 0);
    };
    measureBanner();
    const observer = new MutationObserver(measureBanner);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    window.addEventListener("resize", measureBanner);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureBanner);
    };
  }, []);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [input]);

  React.useEffect(() => {
    if (mode !== "floating" || !open) return;
    const focusTimer = window.setTimeout(() => textareaRef.current?.focus(), 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        window.setTimeout(() => launcherRef.current?.focus(), 20);
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button:not(:disabled), [href], input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, open]);

  const closeAndReturnFocus = () => {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 20);
  };

  const resetChat = () => {
    setMessages([
      { id: "greeting", role: "assistant", content: GREETING_TEXT, time: formatNowTime() },
    ]);
    setInlineError(null);
    setLeadOpen(false);
    setInput("");
  };

  const sendMessage = async (textOverride?: string, isRetry = false) => {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;

    if (!messages.some((m) => m.role === "user")) {
      trackChatStart(mode === "floating" ? "floating_widget" : "contact_page_widget");
    }

    if (/\b(quote|estimate|proposal)\b/i.test(text)) {
      setLeadOpen(true);
    }

    const nextMessages: TimedChatMessage[] = isRetry
      ? messages
      : [
          ...messages,
          {
            id: `u_${Date.now()}`,
            role: "user",
            content: text.slice(0, MAX_CHAT_MESSAGE_LENGTH),
            time: formatNowTime(),
          },
        ];

    setMessages(nextMessages);
    if (!isRetry) setInput("");
    setStreaming(true);
    setWaitingFirstToken(true);
    setInlineError(null);

    try {
      const historyForApi = nextMessages
        .slice(1)
        .slice(-MAX_CHAT_CONVERSATION_MESSAGES)
        .map(({ role, content }) => ({
          role,
          content:
            role === "user"
              ? content.slice(0, MAX_CHAT_MESSAGE_LENGTH)
              : content.slice(0, 8000),
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: historyForApi,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || contentType.includes("application/json")) {
        const errData = (await res.json().catch(() => null)) as {
          error?: string;
          errorType?: ChatErrorType;
        } | null;

        const resolvedType: ChatErrorType =
          errData?.errorType ||
          (res.status === 429
            ? "rate_limited"
            : res.status === 400
            ? "invalid_request"
            : "unavailable");

        const friendlyCopy =
          resolvedType === "rate_limited"
            ? "You have sent several questions quickly. Please wait a moment and retry, or message us on WhatsApp."
            : resolvedType === "invalid_request"
            ? errData?.error || "Please shorten or rephrase your question and try again."
            : "Our assistant is momentarily unreachable. You can retry or connect with our team directly below.";

        setInlineError({
          type: resolvedType,
          message: friendlyCopy,
          failedPrompt: text,
        });
        setWaitingFirstToken(false);
        setStreaming(false);
        return;
      }

      if (!res.body) {
        setInlineError({
          type: "unavailable",
          message: "No stream received. Please retry or chat with us on WhatsApp.",
          failedPrompt: text,
        });
        setWaitingFirstToken(false);
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let replyText = "";
      let assistantId = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        replyText += chunk;
        const snapshot = replyText;

        if (!assistantId) {
          assistantId = `a_${Date.now()}`;
          setWaitingFirstToken(false);
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: snapshot,
              time: formatNowTime(),
            },
          ]);
        } else {
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = {
              ...copy[copy.length - 1],
              content: snapshot,
            };
            return copy;
          });
        }
      }

      if (!replyText.trim()) {
        setInlineError({
          type: "unavailable",
          message: "Our assistant returned an empty response. Please retry.",
          failedPrompt: text,
        });
      }
    } catch {
      setInlineError({
        type: "unavailable",
        message: "Connection interrupted. Please retry or message us on WhatsApp.",
        failedPrompt: text,
      });
    } finally {
      setWaitingFirstToken(false);
      setStreaming(false);
    }
  };

  const assistantReplies = messages.filter((m) => m.role === "assistant");
  const hasAssistantReplyAfterUser =
    messages.some((m) => m.role === "user") && assistantReplies.length > 1;
  const lastAssistantText =
    assistantReplies[assistantReplies.length - 1]?.content || "";
  const followUpChips =
    hasAssistantReplyAfterUser && !streaming
      ? getContextualFollowUpChips(lastAssistantText)
      : [];

  const canSend = !streaming && input.trim().length > 0;
  const nearCharLimit = input.length >= 400;

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        sendMessage();
      }
    }
  };

  const panelContent = (
    <div
      ref={panelRef}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      role={mode === "floating" ? "dialog" : "region"}
      aria-modal={mode === "floating" ? "true" : undefined}
      aria-label="EliavaTech AI Assistant"
      className={cn(
        "glass-surface flex flex-col overflow-hidden overscroll-contain border border-border text-text shadow-[var(--shadow-card-hover)] dark:shadow-[var(--glow-primary)]",
        mode === "full"
          ? "w-full h-[540px] rounded-[16px]"
          : "w-full h-[85dvh] max-h-[85dvh] rounded-t-[20px] rounded-b-none pb-[env(safe-area-inset-bottom)] sm:w-[400px] sm:h-[580px] sm:max-h-[calc(100dvh-120px)] sm:rounded-[16px] sm:pb-0",
        className
      )}
    >
      {mode === "floating" && (
        <button
          type="button"
          onClick={closeAndReturnFocus}
          aria-label="Drag or tap to close assistant"
          className="sm:hidden flex w-full items-center justify-center pt-2.5 pb-1 bg-surface-2/80"
        >
          <span className="h-1.5 w-12 rounded-pill bg-border" />
        </button>
      )}

      <ChatHeader mode={mode} onReset={resetChat} onClose={closeAndReturnFocus} />

      <ChatMessageList
        messages={messages}
        streaming={streaming}
        waitingFirstToken={waitingFirstToken}
        inlineError={inlineError}
        onRetry={(failedPrompt) => sendMessage(failedPrompt, true)}
        onSelectSuggestion={(prompt) => sendMessage(prompt)}
        leadOpen={leadOpen}
        onCloseLead={() => setLeadOpen(false)}
        onLeadSuccess={() => {}}
      />

      <FollowUpChipsBar
        chips={followUpChips}
        showQuoteButton={hasAssistantReplyAfterUser}
        onSelectChip={(prompt) => sendMessage(prompt)}
        onOpenQuote={() => setLeadOpen(true)}
        disabled={streaming}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="border-t border-border bg-surface/90 p-3 space-y-2"
      >
        <div className="relative flex items-end gap-2 rounded-input border border-border bg-bg px-3 py-2 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
          <textarea
            ref={textareaRef}
            data-lenis-prevent
            rows={1}
            value={input}
            onChange={(e) =>
              setInput(e.target.value.slice(0, MAX_CHAT_MESSAGE_LENGTH))
            }
            onKeyDown={handleTextareaKeyDown}
            maxLength={MAX_CHAT_MESSAGE_LENGTH}
            placeholder="Ask about services, pricing, or timelines..."
            aria-label="Message EliavaTech Assistant"
            style={{ outline: "none", boxShadow: "none" }}
            className="thin-scrollbar overscroll-contain max-h-[96px] min-h-[24px] flex-1 resize-none border-0 bg-transparent py-0.5 text-[15px] leading-[1.5] text-text placeholder:text-text-muted outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
          />

          <div className="flex shrink-0 items-center gap-2">
            {nearCharLimit && (
              <span
                aria-live="polite"
                className={cn(
                  "font-mono text-[11px]",
                  input.length >= MAX_CHAT_MESSAGE_LENGTH
                    ? "text-danger"
                    : "text-text-muted"
                )}
              >
                {input.length}/{MAX_CHAT_MESSAGE_LENGTH}
              </span>
            )}

            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send message"
              className={cn(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                canSend
                  ? "bg-primary text-white shadow-[var(--glow-primary)] hover:bg-primary-hover hover:scale-105 active:scale-95"
                  : "border border-primary/35 bg-primary/15 text-primary cursor-not-allowed"
              )}
            >
              <Send strokeWidth={1.85} className="h-4 w-4 -ml-0.5" />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-center text-text-muted">
          Conversations may be stored to improve our service.{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
          >
            Privacy Policy
          </Link>
        </p>
      </form>
    </div>
  );

  if (mode === "full") {
    return panelContent;
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_STANDARD }}
            onClick={closeAndReturnFocus}
            aria-hidden="true"
            className="sm:hidden fixed inset-0 z-40 bg-bg/60 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      <div
        style={{ bottom: `${20 + cookieOffset}px` }}
        className="fixed right-5 z-50 flex flex-col items-end gap-3"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.94, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduced
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.94,
                      y: 12,
                      transition: { duration: 0.2, ease: EASE_STANDARD },
                    }
              }
              transition={SPRING_PLAYFUL}
              style={{ transformOrigin: "bottom right" }}
              className="fixed inset-x-0 bottom-0 z-50 sm:static sm:z-auto"
            >
              {panelContent}
            </motion.div>
          )}
        </AnimatePresence>

        <ChatLauncherGroup
          open={open}
          onToggle={() => (open ? closeAndReturnFocus() : setOpen(true))}
          launcherRef={launcherRef}
        />
      </div>
    </>
  );
}

export default ChatWidget;
