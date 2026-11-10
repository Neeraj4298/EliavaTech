import * as React from "react";
import { cn } from "@/lib/utils";

export interface DeviceMockupProps {
  type?: "browser" | "phone";
  url?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Section 2.6 & 6 — DeviceMockup:
 * Browser-frame and phone-frame components that display sample websites,
 * CRM dashboards, and WhatsApp chats without stock photos.
 */
export function DeviceMockup({
  type = "browser",
  url = "eliavatech.app/demo",
  title = "Preview",
  children,
  className,
}: DeviceMockupProps) {
  if (type === "phone") {
    return (
      <div
        className={cn(
          "mx-auto w-full max-w-[320px] rounded-[28px] border-2 border-border bg-surface p-2.5 shadow-[var(--shadow-card)]",
          className
        )}
      >
        <div className="mx-auto mb-2 h-1.5 w-16 rounded-pill bg-border" aria-hidden="true" />
        <div className="overflow-hidden rounded-[20px] border border-border bg-bg">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-card border border-border bg-surface shadow-[var(--shadow-card)]",
        className
      )}
    >
      {/* Browser chrome bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <div className="flex-1 max-w-xs truncate rounded-pill border border-border bg-surface px-3 py-0.5 text-center font-mono text-[11px] text-text-muted">
          {url}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
          {title}
        </span>
      </div>

      {/* Viewport */}
      <div className="bg-bg p-4">{children}</div>
    </div>
  );
}

export default DeviceMockup;
