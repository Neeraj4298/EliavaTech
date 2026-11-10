"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: "floating" | "inline";
  label?: string;
}

export function getWhatsAppHref(customMessage?: string): string {
  const rawNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919000000000";
  const cleanNumber = rawNumber.replace(/[^\d]/g, "") || "919000000000";
  const text =
    customMessage ||
    "Hi EliavaTech, I would like to discuss a website, automation, or software project for my business.";
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Section 6 & 7 — Floating WhatsAppButton:
 * Click-to-chat link (wa.me) using NEXT_PUBLIC_WHATSAPP_NUMBER with a prefilled message.
 * Uses `.glass-surface` per Section 2.5.
 */
export function WhatsAppButton({
  message,
  className,
  variant = "floating",
  label = "Chat on WhatsApp",
}: WhatsAppButtonProps) {
  const href = getWhatsAppHref(message);

  if (variant === "inline") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-pill border border-success/40 bg-success/15 px-5 py-2.5 text-small font-medium text-success transition-all hover:bg-success hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success",
          className
        )}
      >
        <MessageCircle strokeWidth={1.5} className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with EliavaTech on WhatsApp"
      className={cn(
        "fixed bottom-5 right-5 z-40 glass-surface inline-flex items-center gap-2.5 rounded-pill border border-success/45 px-4 py-3 text-small font-medium text-text shadow-[var(--shadow-card-hover)] transition-all duration-200 hover:-translate-y-0.5 hover:border-success",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success",
        className
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success text-white">
        <MessageCircle strokeWidth={1.5} className="h-4 w-4" />
      </span>
      <span className="hidden sm:inline text-xs font-medium text-text">
        WhatsApp Us
      </span>
    </a>
  );
}

export default WhatsAppButton;
