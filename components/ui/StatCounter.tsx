"use client";

import * as React from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

export interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  className?: string;
}

/**
 * Section 5.4 & 6 — StatCounter:
 * Counts up smoothly when visible, once only.
 * Respects `prefers-reduced-motion` per Section 5.8.
 */
export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  durationMs = 1100,
  className,
}: StatCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) return;

    let rafId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [inView, value, durationMs, prefersReducedMotion]);

  const shown = prefersReducedMotion ? value : inView ? displayValue : 0;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

export default StatCounter;
