"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { setCookieConsent, useCookieConsent } from "@/lib/analytics";
import { EASE_STANDARD, MOTION_DURATION, usePrefersReducedMotion } from "@/lib/motion";
import { Button } from "@/components/ui/Button";

const emptySubscribe = () => () => {};

/**
 * Section 6, 7 & 10 — CookieBanner:
 * - Blocks Google Analytics 4 until the visitor explicitly clicks "Accept Analytics".
 * - Marked with `data-cookie-banner` so the floating ChatWidget/launcher offsets above it when visible.
 * - Complies with India's DPDP Act and WCAG 2.2 AA keyboard & focus standards.
 */
export function CookieBanner() {
  const reduced = usePrefersReducedMotion();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const consent = useCookieConsent();

  const visible = mounted && consent === null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          data-cookie-banner
          role="region"
          aria-label="Cookie and analytics consent"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-40 glass-surface rounded-card border border-border p-4 shadow-[var(--shadow-card-hover)]"
        >
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck
                strokeWidth={1.5}
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <h2 className="font-heading text-small font-semibold text-text">
                  Privacy &amp; Analytics Consent
                </h2>
                <p className="text-xs text-text-muted leading-relaxed">
                  We use essential storage for theme preferences and spam
                  protection. With your consent, we enable Google Analytics 4 to
                  understand how visitors use our site. Read our{" "}
                  <Link
                    href="/cookies"
                    className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
                  >
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCookieConsent("declined")}
              >
                Essential Only
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setCookieConsent("accepted")}
              >
                Accept Analytics
              </Button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default CookieBanner;
