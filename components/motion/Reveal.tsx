"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  EASE_STANDARD,
  MOTION_DURATION,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

/**
 * Section 5.4 — Reveal on scroll:
 * Fade in and move up 24 px, triggered once when 20 percent visible.
 * Respects `prefers-reduced-motion` per Section 5.8.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  yOffset = 24,
  duration = MOTION_DURATION.slow,
  once = true,
  amount = 0.05,
}: RevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px 40px 0px" }}
      transition={{
        duration,
        delay,
        ease: EASE_STANDARD,
      }}
      className={cn("will-change-[transform,opacity]", className)}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
