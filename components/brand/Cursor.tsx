"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsFinePointer, usePrefersReducedMotion } from "@/lib/motion";

/**
 * Section 5.6 & 5.8 — Custom Cursor:
 * - A small dot plus a trailing ring that grows over interactive elements
 *   and shows labels such as "View" or "Drag" (via `data-cursor-label`).
 * - Animates only transform and opacity.
 * - Disabled on touch devices and when `prefers-reduced-motion` is enabled.
 */
export function Cursor() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useIsFinePointer();
  const isEnabled = !prefersReducedMotion && isFinePointer;

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { stiffness: 320, damping: 28, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 320, damping: 28, mass: 0.4 });

  const [visible, setVisible] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [label, setLabel] = React.useState<string>("");

  React.useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      if (!visible) setVisible(true);

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const labeledEl = target.closest<HTMLElement>("[data-cursor-label]");
      const interactiveEl = target.closest<HTMLElement>(
        'a, button, [role="button"], [role="tab"], input, select, textarea, summary, [data-cursor]'
      );

      if (labeledEl) {
        setLabel(labeledEl.dataset.cursorLabel || "");
        setHovered(true);
      } else if (interactiveEl) {
        setLabel("");
        setHovered(true);
      } else {
        setLabel("");
        setHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isEnabled, mouseX, mouseY, visible]);

  if (!isEnabled) return null;

  const ringScale = label ? 2.15 : hovered ? 1.55 : 1;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      {/* Small cursor dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          opacity: visible ? (label ? 0 : 1) : 0,
        }}
        className="fixed left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-primary will-change-[transform,opacity]"
      />

      {/* Trailing ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          scale: ringScale,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 24,
        }}
        className="fixed left-0 top-0 -ml-4 -mt-4 flex h-8 w-8 items-center justify-center rounded-full border border-primary/65 bg-primary/10 backdrop-blur-[2px] will-change-[transform,opacity]"
      >
        {label && (
          <span className="scale-[0.46] font-mono text-[10px] font-semibold uppercase tracking-wider text-text">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}

export default Cursor;
