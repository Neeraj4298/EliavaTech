"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Section 5.4 — Scroll progress bar:
 * A thin primary-colored bar at the top of the page.
 * Animates only `scaleX` (transform), never `width`.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = usePrefersReducedMotion();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
    >
      <motion.div
        style={{
          scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress,
        }}
        className="h-full w-full origin-left bg-primary shadow-[var(--glow-primary)] will-change-transform"
      />
    </div>
  );
}

export default ScrollProgress;
