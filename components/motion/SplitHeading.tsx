"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  EASE_STANDARD,
  MOTION_DURATION,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SplitHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

/**
 * Section 5.4 — Heading text reveal (SplitHeading):
 * Words rise from a masked line, staggered by 60–80ms.
 * Respects `prefers-reduced-motion` per Section 5.8.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.065,
  once = true,
}: SplitHeadingProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const words = React.useMemo(() => text.trim().split(/\s+/), [text]);

  // Render H1 immediately visible on SSR for instant mobile LCP (<2.5s)
  if (prefersReducedMotion || Tag === "h1") {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag aria-label={text} className={cn("inline-block", className)}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay,
            },
          },
        }}
        aria-hidden="true"
        className="inline"
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
          >
            <motion.span
              variants={{
                hidden: { y: "105%", opacity: 0 },
                visible: {
                  y: "0%",
                  opacity: 1,
                  transition: {
                    duration: MOTION_DURATION.slow,
                    ease: EASE_STANDARD,
                  },
                },
              }}
              className="inline-block will-change-[transform,opacity]"
            >
              {word}
            </motion.span>
            {index < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

export default SplitHeading;
