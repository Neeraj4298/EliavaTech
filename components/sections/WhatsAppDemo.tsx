"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCheck, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { WHATSAPP_DEMO_MESSAGES } from "@/content/home";
import { EASE_STANDARD, MOTION_DURATION, usePrefersReducedMotion } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function WhatsAppDemo() {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = React.useState(reduced ? WHATSAPP_DEMO_MESSAGES.length : 1);
  const [typing, setTyping] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (reduced || paused) return;
    const total = WHATSAPP_DEMO_MESSAGES.length;
    if (count < total) {
      const isBot = WHATSAPP_DEMO_MESSAGES[count]?.sender === "bot";
      const t1 = isBot ? window.setTimeout(() => setTyping(true), 450) : undefined;
      const t2 = window.setTimeout(() => {
        setTyping(false);
        setCount((c) => c + 1);
      }, 2100);
      return () => {
        if (t1) window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    const reset = window.setTimeout(() => setCount(1), 4000);
    return () => window.clearTimeout(reset);
  }, [count, paused, reduced]);

  const messages = reduced ? WHATSAPP_DEMO_MESSAGES : WHATSAPP_DEMO_MESSAGES.slice(0, count);

  return (
    <div className="rounded-card border border-border bg-surface overflow-hidden shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 font-heading text-small font-semibold text-success">
            CP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-small font-semibold text-text">CarePlus Clinic</span>
              <Badge variant="success" size="sm" dot>Automated</Badge>
            </div>
            <p className="text-xs text-text-muted">WhatsApp Business API + n8n</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play chat animation" : "Pause chat animation"}
            className="inline-flex items-center gap-1 rounded-pill border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text"
          >
            {paused ? <Play strokeWidth={1.5} className="h-3 w-3 text-primary" /> : <Pause strokeWidth={1.5} className="h-3 w-3 text-text-muted" />}
            <span>{paused ? "Play" : "Pause"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTyping(false);
              setCount(1);
            }}
            aria-label="Restart chat demo"
            className="inline-flex h-7 w-7 items-center justify-center rounded-pill border border-border bg-surface text-text-muted"
          >
            <RotateCcw strokeWidth={1.5} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="min-h-[320px] bg-bg p-5 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <motion.div
                  key={msg.id}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
                  className={cn("flex flex-col max-w-[82%]", isBot ? "mr-auto items-start" : "ml-auto items-end")}
                >
                  <div
                    className={cn(
                      "rounded-card px-4 py-2.5 text-small",
                      isBot ? "border border-border bg-surface text-text" : "bg-primary text-white"
                    )}
                  >
                    <p>{msg.text}</p>
                    <div className={cn("mt-1 flex items-center justify-end gap-1 text-[11px]", isBot ? "text-text-muted" : "text-white/80")}>
                      <span>{msg.time}</span>
                      <CheckCheck strokeWidth={1.5} className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  {msg.meta && (
                    <span className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-success">
                      <Sparkles strokeWidth={1.5} className="h-3 w-3" />
                      <span>{msg.meta}</span>
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {typing && !reduced && (
            <div className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:240ms]" />
            </div>
          )}
        </div>
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
          <span>Instant CRM entry</span>
          <span className="font-mono text-primary">Step {messages.length}/{WHATSAPP_DEMO_MESSAGES.length}</span>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppDemo;
