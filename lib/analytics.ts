"use client";

import * as React from "react";

export type CookieConsentStatus = "accepted" | "declined" | null;

export type EliavaAnalyticsEvent =
  | "form_submission"
  | "booking_click"
  | "whatsapp_click"
  | "chat_start";

const CONSENT_STORAGE_KEY = "eliavatech-cookie-consent";
const CONSENT_EVENT_NAME = "eliavatech-consent-change";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getCookieConsentSnapshot(): CookieConsentStatus {
  if (typeof window === "undefined") return null;
  try {
    const val = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (val === "accepted" || val === "declined") return val;
    return null;
  } catch {
    return null;
  }
}

function subscribeCookieConsent(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

/**
 * React 19 safe hook for reading the visitor's cookie consent state.
 * Returns `"accepted"`, `"declined"`, or `null` (undecided).
 */
export function useCookieConsent(): CookieConsentStatus {
  return React.useSyncExternalStore(
    subscribeCookieConsent,
    getCookieConsentSnapshot,
    () => null
  );
}

export function setCookieConsent(status: "accepted" | "declined"): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    // Ignore storage error
  }

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: status === "accepted" ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  window.dispatchEvent(new Event(CONSENT_EVENT_NAME));
}

export function resetCookieConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Ignore storage error
  }
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
  window.dispatchEvent(new Event(CONSENT_EVENT_NAME));
}

/**
 * Section 7 & 10 — GA4 Event Tracker:
 * Fires events only when the visitor has accepted analytics cookies.
 */
export function trackEvent(
  eventName: EliavaAnalyticsEvent,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (getCookieConsentSnapshot() !== "accepted") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      ...params,
      page_path: window.location.pathname,
    });
  }
}

export function trackFormSubmission(source: string, service?: string): void {
  trackEvent("form_submission", {
    form_source: source,
    ...(service ? { service_selected: service } : {}),
  });
}

export function trackBookingClick(location: string): void {
  trackEvent("booking_click", {
    click_location: location,
  });
}

export function trackWhatsAppClick(location: string, page?: string): void {
  trackEvent("whatsapp_click", {
    click_location: location,
    ...(page ? { page_context: page } : {}),
  });
}

export function trackChatStart(trigger: string): void {
  trackEvent("chat_start", {
    trigger_source: trigger,
  });
}
