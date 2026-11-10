"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  EASE_STANDARD,
  MOTION_DURATION,
  usePrefersReducedMotion,
} from "@/lib/motion";

export interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Section 5.5 — Page transitions:
 * - Used by `app/template.tsx` so every route change plays an enter animation:
 *   a quick primary-colored wipe panel (~500 ms) followed by content fading up.
 * - Keeps the navbar fixed during transitions.
 * - Animates only transform (scaleY, y) and opacity.
 * - Respects `prefers-reduced-motion` per Section 5.8.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex-1 flex flex-col">
      {/* Primary-colored wipe panel (~500ms) using scaleY transform only */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{
          duration: MOTION_DURATION.pageWipe,
          ease: EASE_STANDARD,
        }}
        style={{ transformOrigin: "top" }}
        className="pointer-events-none fixed inset-0 z-40 bg-primary/90 will-change-transform"
      />

      {/* Page content fading up */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: MOTION_DURATION.slow,
          delay: 0.12,
          ease: EASE_STANDARD,
        }}
        className="flex-1 flex flex-col will-change-[transform,opacity]"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default PageTransition;
