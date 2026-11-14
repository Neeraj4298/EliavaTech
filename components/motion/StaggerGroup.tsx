"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  EASE_STANDARD,
  MOTION_DURATION,
  STAGGER_SIBLINGS,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
}

/**
 * Section 5.3 & 5.4 — StaggerGroup:
 * Staggers sibling elements by 60 to 80 ms (default 70ms),
 * animating only transform (translateY) and opacity.
 */
export function StaggerGroup({
  children,
  className,
  stagger = STAGGER_SIBLINGS,
  delayChildren = 0.05,
  once = true,
  amount = 0.05,
}: StaggerGroupProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px 40px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
}

export function StaggerItem({
  children,
  className,
  yOffset = 24,
}: StaggerItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: MOTION_DURATION.slow,
            ease: EASE_STANDARD,
          },
        },
      }}
      className={cn("will-change-[transform,opacity]", className)}
    >
      {children}
    </motion.div>
  );
}

export default StaggerGroup;
