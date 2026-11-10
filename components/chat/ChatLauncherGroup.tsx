"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { WhatsAppButton } from "@/components/overlays/WhatsAppButton";
import { EASE_STANDARD, MOTION_DURATION, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const NUDGE_KEY = "eliavatech-chat-nudge-shown";

export interface ChatLauncherGroupProps {
  open: boolean;
  onToggle: () => void;
  launcherRef: React.RefObject<HTMLButtonElement | null>;
}

export function ChatLauncherGroup({
  open,
  onToggle,
  launcherRef,
}: ChatLauncherGroupProps) {
  const reduced = usePrefersReducedMotion();
  const [nudgeVisible, setNudgeVisible] = React.useState(false);
  const [pulseOnce, setPulseOnce] = React.useState(false);

  React.useEffect(() => {
    if (open || typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(NUDGE_KEY) === "1") return;
    } catch {
      return;
    }

    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(NUDGE_KEY, "1");
      } catch {
        // Ignore storage error
      }
      setNudgeVisible(true);
      if (!reduced) setPulseOnce(true);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [open, reduced]);

  const handleLauncherClick = () => {
    setNudgeVisible(false);
    onToggle();
  };

  return (
    <div className="flex flex-col items-end gap-3">
      {/* 48px round WhatsApp button above launcher (hidden on mobile while chat is open) */}
      <div className={cn(open && "hidden sm:block")}>
        <WhatsAppButton variant="floating" />
      </div>

      {/* Primary 60px round chat button + 8s session nudge */}
      <div className="relative flex items-center gap-3">
        <AnimatePresence>
          {nudgeVisible && !open && (
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, x: 8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: 8, scale: 0.96 }}
              transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
              className="glass-surface flex items-center gap-2 rounded-pill border border-border px-3.5 py-2 text-xs font-medium text-text shadow-[var(--shadow-card-hover)]"
            >
              <button
                type="button"
                onClick={handleLauncherClick}
                className="text-left hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs whitespace-nowrap"
              >
                Questions? Ask our assistant.
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setNudgeVisible(false);
                }}
                aria-label="Dismiss assistant nudge"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X strokeWidth={1.5} className="h-3 w-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          {pulseOnce && !reduced && !open && (
            <motion.span
              aria-hidden="true"
              initial={{ scale: 1, opacity: 0.55 }}
              animate={{ scale: 1.55, opacity: 0 }}
              transition={{ duration: 0.85, ease: EASE_STANDARD }}
              onAnimationComplete={() => setPulseOnce(false)}
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
            />
          )}

          <button
            ref={launcherRef}
            type="button"
            onClick={handleLauncherClick}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={open ? "Close EliavaTech assistant" : "Open EliavaTech assistant"}
            style={{ backgroundImage: "var(--gradient-primary)" }}
            className="relative inline-flex h-[60px] w-[60px] items-center justify-center rounded-full text-on-primary shadow-[var(--glow-primary)] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <Sparkles
                strokeWidth={1.5}
                className={cn(
                  "absolute h-6 w-6 text-on-primary transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                )}
                aria-hidden="true"
              />
              <X
                strokeWidth={1.5}
                className={cn(
                  "absolute h-6 w-6 text-on-primary transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                )}
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatLauncherGroup;
