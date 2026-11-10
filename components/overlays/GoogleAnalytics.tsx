"use client";

import * as React from "react";
import Script from "next/script";
import { trackBookingClick, useCookieConsent } from "@/lib/analytics";

/**
 * Section 7 & 10 — Google Analytics 4 with Google Consent Mode:
 * - Reads `NEXT_PUBLIC_GA_ID`.
 * - Defaults all storage to `'denied'` until the visitor explicitly accepts the CookieBanner.
 * - Loads `googletagmanager.com/gtag/js` ONLY when `consent === "accepted"`.
 * - Automatically tracks consultation booking clicks (`booking_click`) across the site.
 */
export function GoogleAnalytics() {
  const gaId = (process.env.NEXT_PUBLIC_GA_ID || "").trim();
  const consent = useCookieConsent();

  // Global listener to track consultation booking clicks (`booking_click`)
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (
        href === "/contact" ||
        href.startsWith("/contact#") ||
        href.includes("cal.com")
      ) {
        trackBookingClick(anchor.textContent?.trim() || href);
      }
    };

    document.addEventListener("click", handleDocumentClick, { passive: true });
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  if (!gaId || consent !== "accepted") {
    return null;
  }

  return (
    <>
      <Script
        id="ga4-lib"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
          gaId
        )}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              analytics_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}

export default GoogleAnalytics;
