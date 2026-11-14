"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { trackWhatsAppClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: "floating" | "inline" | "compact";
  label?: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2.75a9.25 9.25 0 0 0-7.97 13.94L3 21l4.45-1.01A9.25 9.25 0 1 0 12 2.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.35 8.6c-.2-.44-.41-.45-.6-.46h-.51c-.18 0-.47.07-.71.34-.25.27-.94.92-.94 2.24 0 1.32.96 2.6 1.1 2.78.13.18 1.86 2.97 4.59 4.04 2.27.89 2.73.71 3.22.67.49-.05 1.59-.65 1.81-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.31-.27-.14-1.59-.79-1.84-.88-.24-.09-.42-.13-.6.14-.18.27-.7.88-.85 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.59-1.46-.81-1.97Z"
        fill="currentColor"
      />
    </svg>
  );
}

function formatPageName(pathname: string | null): string {
  if (!pathname || pathname === "/") return "the Home page (/)";
  return `${pathname}`;
}

export function getWhatsAppHref(customMessage?: string, pathname?: string | null): string {
  const rawNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917075466449";
  const cleanNumber = rawNumber.replace(/[^\d]/g, "") || "917075466449";
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
  const handleTrackClick = () => {
    trackWhatsAppClick(variant, pathname ?? "/");
  };

  if (variant === "compact") {
    return (
      <a
        href={href}
        onClick={handleTrackClick}
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
        onClick={handleTrackClick}
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
        onClick={handleTrackClick}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp us"
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-full bg-success text-white shadow-sm transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          className
        )}
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </Tooltip>
  );
}

export default WhatsAppButton;

