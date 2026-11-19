"use client";

import * as React from "react";
import Script from "next/script";
import { ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          "timeout-callback"?: () => void;
        }
      ) => string;
      reset: (widgetIdOrSelector?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export const DEFAULT_TURNSTILE_SITE_KEY = "0x4AAAAAAGIXyivKpESd5hg3";

export const TURNSTILE_SITE_KEY = (
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || DEFAULT_TURNSTILE_SITE_KEY
).trim();

const widgetIds = new Map<string, string>();

/** Turnstile tokens are single use: call this after any failed submit. */
export function resetTurnstileWidget(id: string) {
  try {
    const widgetId = widgetIds.get(id);
    window.turnstile?.reset(widgetId ?? `#${id}`);
  } catch {
    // widget not rendered yet
  }
}

export interface TurnstileWidgetProps {
  /** Unique DOM id for this widget (a page can host more than one form). */
  id: string;
  onToken: (token: string) => void;
}

/**
 * Cloudflare Turnstile spam check, shared by the contact and pricing forms.
 * Renders explicitly so it still works after the form is reset or remounted.
 */
export function TurnstileWidget({ id, onToken }: TurnstileWidgetProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  // Starts true when the script is already loaded (e.g. navigating back to the page).
  const [scriptReady, setScriptReady] = React.useState(
    () => typeof window !== "undefined" && Boolean(window.turnstile)
  );
  const onTokenRef = React.useRef(onToken);

  React.useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  React.useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !scriptReady) return;
    const container = containerRef.current;
    if (!container || !window.turnstile) return;

    const widgetId = window.turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token) => onTokenRef.current(token),
      "error-callback": () => onTokenRef.current(""),
      "expired-callback": () => onTokenRef.current(""),
      "timeout-callback": () => onTokenRef.current(""),
    });
    widgetIds.set(id, widgetId);

    return () => {
      widgetIds.delete(id);
      try {
        window.turnstile?.remove(widgetId);
      } catch {
        // already removed
      }
    };
  }, [id, scriptReady]);

  if (!TURNSTILE_SITE_KEY) {
    // Local development without Cloudflare keys.
    return process.env.NODE_ENV === "production" ? null : (
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <ShieldCheck strokeWidth={1.5} className="h-4 w-4 text-success shrink-0" />
        <span>Spam check is off in development (no Turnstile site key set).</span>
      </div>
    );
  }

  return (
    <div className="pt-1">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div id={id} ref={containerRef} />
    </div>
  );
}
