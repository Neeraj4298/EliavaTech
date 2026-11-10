"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  SPRING_PLAYFUL,
  useIsFinePointer,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  cursorLabel?: string;
}

/**
 * Section 5.6 — MagneticButton:
 * Magnetic pull toward the cursor on desktop, subtle press scale.
 * Animates only transform. Disabled on touch devices and prefers-reduced-motion.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.28,
  cursorLabel,
}: MagneticButtonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useIsFinePointer();
  const ref = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const isEnabled = !prefersReducedMotion && isFinePointer;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setOffset({
      x: (event.clientX - centerX) * strength,
      y: (event.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  if (!isEnabled) {
    return (
      <div className={cn("inline-flex", className)} data-cursor-label={cursorLabel}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING_PLAYFUL}
      data-cursor-label={cursorLabel}
      className={cn("inline-flex will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

export default MagneticButton;
