"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { EASE_STANDARD, MOTION_DURATION, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  defaultOpenIndex?: number | null;
  className?: string;
}

/**
 * Section 4.2 #10 & Section 6 — FAQAccordion:
 * Accessible keyboard-navigable accordion working in both themes.
 */
export function FAQAccordion({
  items,
  defaultOpenIndex = 0,
  className,
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(defaultOpenIndex);
  const prefersReducedMotion = usePrefersReducedMotion();
  const baseId = React.useId();

  return (
    <div className={cn("divide-y divide-border rounded-card border border-border bg-surface", className)}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const triggerId = `${baseId}-trigger-${idx}`;
        const panelId = `${baseId}-panel-${idx}`;

        return (
          <div key={item.question} className="p-5 md:p-6">
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex w-full items-center justify-between gap-4 text-left font-heading text-lg font-semibold text-text transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
              >
                <span>{item.question}</span>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-border bg-surface-2 text-text-muted">
                  {isOpen ? (
                    <Minus strokeWidth={1.5} className="h-4 w-4 text-primary" />
                  ) : (
                    <Plus strokeWidth={1.5} className="h-4 w-4" />
                  )}
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
                  className="pt-3 text-small text-text-muted leading-relaxed"
                >
                  {item.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default FAQAccordion;
