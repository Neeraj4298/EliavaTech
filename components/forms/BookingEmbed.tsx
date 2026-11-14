"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Calendar, ExternalLink, Video } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface BookingEmbedProps {
  className?: string;
}

/**
 * Section 4.9, 6 & 7 — BookingEmbed:
 * Embeds the Cal.com booking calendar using NEXT_PUBLIC_CAL_LINK.
 * Handles missing or offline embed gracefully with direct slot preview & fallback link.
 */
export function BookingEmbed({ className }: BookingEmbedProps) {
  const { resolvedTheme } = useTheme();
  const envCalLink = (process.env.NEXT_PUBLIC_CAL_LINK || "").trim();
  const calLinkRaw =
    !envCalLink || envCalLink === "supporteliavatech/30min"
      ? "eliava-tech-icmfdj/30min"
      : envCalLink;
  const normalizedCalLink = calLinkRaw.includes("@")
    ? "eliava-tech-icmfdj/30min"
    : calLinkRaw;
  const cleanCalPath = normalizedCalLink
    .replace(/^https?:\/\/(www\.)?cal\.com\//i, "")
    .replace(/^\/+/, "");

  const isConfigured = cleanCalPath.length > 0;
  const themeParam = resolvedTheme === "light" ? "light" : "dark";
  const iframeSrc = isConfigured
    ? `https://cal.com/${cleanCalPath}?embed=true&theme=${themeParam}&layout=month_view`
    : "";
  const directCalUrl = isConfigured
    ? `https://cal.com/${cleanCalPath}`
    : "https://cal.com";

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar strokeWidth={1.5} className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-xl font-semibold text-text">
              Book a 30-Minute Discovery Call
            </h2>
          </div>
          <p className="text-xs text-text-muted">
            Google Meet video call · Direct with the EliavaTech co-founders
          </p>
        </div>

        <Badge variant="primary" size="sm" dot>
          Cal.com Calendar
        </Badge>
      </div>

      {isConfigured ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-input border border-border bg-bg">
            <iframe
              src={iframeSrc}
              title="Book a Free Consultation with EliavaTech on Cal.com"
              className="h-[520px] w-full border-0"
              loading="lazy"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Calendar synced with Google Calendar &amp; Google Meet</span>
            <a
              href={directCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <span>Open in Cal.com</span>
              <ExternalLink strokeWidth={1.5} className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-input border border-border bg-surface-2/60 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="gold" size="sm">
                Calendar Embed Ready
              </Badge>
              <h3 className="font-heading text-base font-semibold text-text">
                30-Minute Architecture &amp; Scope Consultation
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Set <code className="font-mono text-primary">NEXT_PUBLIC_CAL_LINK</code> in{" "}
                <code className="font-mono">.env.local</code> (for example{" "}
                <code className="font-mono">eliavatech/30min</code>) to render your live Cal.com booking widget here.
              </p>
            </div>
            <Video strokeWidth={1.5} className="h-5 w-5 text-primary shrink-0" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {[
              "Mon – Sat · 10:00 AM IST",
              "Mon – Sat · 2:30 PM IST",
              "Mon – Sat · 6:00 PM IST",
            ].map((slot) => (
              <div
                key={slot}
                className="rounded-input border border-border bg-surface px-3 py-2 text-center font-mono text-[11px] text-text-muted"
              >
                {slot}
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border/60">
            <span className="text-xs text-text-muted">
              Or submit the consultation form above and we will send a calendar invite.
            </span>
            <a href={directCalUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm">
                Open Cal.com
              </Button>
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}

export default BookingEmbed;
