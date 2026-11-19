"use client";

import * as React from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => boolean | void;
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

function isPreviewOrLocalHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app")
  );
}

/**
 * Cloudflare Turnstile spam check, shared by the contact and pricing forms.
 * Renders explicitly so it still works after the form is reset or remounted.
 * If the widget cannot connect (e.g. preview domain, Brave Shields, adblocker
 * or Cloudflare challenge error), it hides cleanly so the form remains usable.
 */
export function TurnstileWidget({ id, onToken }: TurnstileWidgetProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  // Starts true when the script is already loaded (e.g. navigating back to the page).
  const [scriptReady, setScriptReady] = React.useState(
    () => typeof window !== "undefined" && Boolean(window.turnstile)
  );
  const [widgetUnavailable, setWidgetUnavailable] = React.useState(false);
  const onTokenRef = React.useRef(onToken);

  React.useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  React.useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !scriptReady || widgetUnavailable) return;
    if (isPreviewOrLocalHost()) return;
    const container = containerRef.current;
    if (!container || !window.turnstile) return;

    let widgetId: string | undefined;
    try {
      widgetId = window.turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => onTokenRef.current(token),
        "error-callback": () => {
          onTokenRef.current("");
          setWidgetUnavailable(true);
          if (widgetId) {
            try {
              window.turnstile?.remove(widgetId);
            } catch {
              // ignore
            }
          }
          return true;
        },
        "expired-callback": () => onTokenRef.current(""),
        "timeout-callback": () => onTokenRef.current(""),
      });
      widgetIds.set(id, widgetId);
    } catch {
      // ignore render error
    }

    return () => {
      widgetIds.delete(id);
      if (widgetId) {
        try {
          window.turnstile?.remove(widgetId);
        } catch {
          // already removed
        }
      }
    };
  }, [id, scriptReady, widgetUnavailable]);

  if (!TURNSTILE_SITE_KEY || widgetUnavailable) {
    return null;
  }

  return (
    <div className="pt-1">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          if (isPreviewOrLocalHost()) {
            setWidgetUnavailable(true);
            return;
          }
          setScriptReady(true);
        }}
        onError={() => setWidgetUnavailable(true)}
      />
      <div id={id} ref={containerRef} />
    </div>
  );
}
