"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Globe, MessageSquareCode, Boxes, Clock, Sparkles } from "lucide-react";
import { EASE_STANDARD, MOTION_DURATION, usePrefersReducedMotion } from "@/lib/motion";

export const WELCOME_SUGGESTIONS = [
  {
    label: "Website prices",
    prompt: "What are your website prices?",
    icon: Globe,
  },
  {
    label: "WhatsApp automation",
    prompt: "How does WhatsApp automation work and what does it cost?",
    icon: MessageSquareCode,
  },
  {
    label: "CRM for my business",
    prompt: "Can you build a custom CRM or dashboard for my business?",
    icon: Boxes,
  },
  {
    label: "How long does it take",
    prompt: "How long does a typical launch take and what is your process?",
    icon: Clock,
  },
] as const;

export function getContextualFollowUpChips(lastAssistantText: string): string[] {
  const lower = lastAssistantText.toLowerCase();
  if (lower.includes("₹9,999") || lower.includes("website")) {
    return [
      "What is included in Business Website?",
      "Do you offer monthly care plans?",
      "How long does a website take?",
    ];
  }
  if (lower.includes("whatsapp") || lower.includes("12,999")) {
    return [
      "Can WhatsApp sync with Google Sheets?",
      "What are the website prices?",
      "How long does setup take?",
    ];
  }
  if (lower.includes("crm") || lower.includes("49,999")) {
    return [
      "How does custom CRM discovery work?",
      "Can you connect WhatsApp to the CRM?",
      "What are your monthly support plans?",
    ];
  }
  return [
    "What are your website prices?",
    "How does WhatsApp automation work?",
    "What are your monthly care plans?",
  ];
}

export interface WelcomeSuggestionsGridProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function WelcomeSuggestionsGrid({
  onSelect,
  disabled,
}: WelcomeSuggestionsGridProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className="grid grid-cols-2 gap-2 pt-1"
    >
      {WELCOME_SUGGESTIONS.map((item) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.prompt)}
            variants={
              reduced
                ? undefined
                : {
                    hidden: { opacity: 0, y: 8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: MOTION_DURATION.base, ease: EASE_STANDARD },
                    },
                  }
            }
            className="group flex flex-col items-start gap-2 rounded-card border border-border bg-surface p-3 text-left transition-all duration-200 hover:border-primary/50 hover:bg-surface-2 active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-input bg-primary/12 text-primary">
              <Icon strokeWidth={1.5} className="h-3.5 w-3.5" />
            </span>
            <span className="font-heading text-xs font-semibold text-text group-hover:text-primary transition-colors">
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export interface FollowUpChipsBarProps {
  chips: string[];
  onSelectChip: (prompt: string) => void;
  onOpenQuote: () => void;
  showQuoteButton: boolean;
  disabled?: boolean;
}

export function FollowUpChipsBar({
  chips,
  onSelectChip,
  onOpenQuote,
  showQuoteButton,
  disabled,
}: FollowUpChipsBarProps) {
  const reduced = usePrefersReducedMotion();
  if (!showQuoteButton && chips.length === 0) return null;

  return (
    <motion.div
      data-lenis-prevent-horizontal
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className="no-scrollbar chips-edge-mask flex items-center gap-2 overflow-x-auto overscroll-contain border-t border-border bg-surface/60 px-4 py-2.5 pr-7"
    >
      {showQuoteButton && (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={onOpenQuote}
          variants={reduced ? undefined : { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border border-primary/50 bg-primary/12 px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-on-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Sparkles strokeWidth={1.5} className="h-3 w-3 shrink-0" />
          <span>Get Quote</span>
        </motion.button>
      )}

      {chips.slice(0, 3).map((chip) => (
        <motion.button
          key={chip}
          type="button"
          disabled={disabled}
          onClick={() => onSelectChip(chip)}
          variants={reduced ? undefined : { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          className="shrink-0 whitespace-nowrap rounded-pill border border-border bg-surface-2 px-3 py-1.5 text-xs text-text-muted transition-all duration-200 hover:border-primary/40 hover:text-text active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {chip}
        </motion.button>
      ))}
    </motion.div>
  );
}
