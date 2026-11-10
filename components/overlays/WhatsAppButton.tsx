"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

export interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: "floating" | "inline" | "compact";
  label?: string;
}

function formatPageName(pathname: string | null): string {
  if (!pathname || pathname === "/") return "the Home page (/)";
  return `${pathname}`;
}

export function getWhatsAppHref(customMessage?: string, pathname?: string | null): string {
  const rawNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919000000000";
  const cleanNumber = rawNumber.replace(/[^\d]/g, "") || "919000000000";
  const pageContext = formatPageName(pathname ?? null);
  const text =
    customMessage ||
    `Hi EliavaTech, I am browsing ${pageContext} on your website and would like to discuss a website, automation, or software project for my business.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Section 6 & 7 — WhatsAppButton:
 * - Click-to-chat link (wa.me) using NEXT_PUBLIC_WHATSAPP_NUMBER with a prefilled
 *   message that mentions the page the visitor is currently on.
 * - Uses only Section 2 CSS variable tokens.
 * - `variant="floating"`: 48px round icon button with "WhatsApp us" tooltip (no idle text pill).
 * - `variant="inline"` / `"compact"`: inline action button for Contact page and error notices.
 */
export function WhatsAppButton({
  message,
  className,
  variant = "floating",
  label = "Chat on WhatsApp",
}: WhatsAppButtonProps) {
  const pathname = usePathname();
  const href = getWhatsAppHref(message, pathname);

  if (variant === "compact") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-all duration-200 hover:border-success/50 hover:bg-surface-2 hover:text-success active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className
        )}
      >
        <MessageCircle strokeWidth={1.5} className="h-3.5 w-3.5 text-success shrink-0" />
        <span>{label}</span>
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-pill border border-success/40 bg-success/12 px-5 py-2.5 text-small font-medium text-success transition-all duration-200 hover:bg-success hover:text-bg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className
        )}
      >
        <MessageCircle strokeWidth={1.5} className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <Tooltip content="WhatsApp us" placement="left">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp us"
        className={cn(
          "glass-surface inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-success shadow-[var(--shadow-card-hover)] transition-all duration-200 hover:scale-105 hover:border-success/55 hover:bg-surface-2 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          className
        )}
      >
        <MessageCircle strokeWidth={1.5} className="h-5 w-5" />
      </a>
    </Tooltip>
  );
}

export default WhatsAppButton;

