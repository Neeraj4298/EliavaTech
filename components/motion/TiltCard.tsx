"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  SPRING_PLAYFUL,
  useIsFinePointer,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  cursorLabel?: string;
}

/**
 * Section 5.6 — TiltCard:
 * 3D tilt (maximum 6 degrees) with a gradient glow that follows the cursor.
 * Animates only transform and opacity. Disabled on touch devices and prefers-reduced-motion.
 */
export function TiltCard({
  children,
  maxTilt = 6,
  cursorLabel,
  className,
  ...props
}: TiltCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useIsFinePointer();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = React.useState({ rotateX: 0, rotateY: 0 });
  const [glow, setGlow] = React.useState({ x: 0, y: 0, active: false });

  const isEnabled = !prefersReducedMotion && isFinePointer;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = event.clientX - rect.left;
    const relY = event.clientY - rect.top;
    const normX = relX / rect.width - 0.5;
    const normY = relY / rect.height - 0.5;

    const clampedTilt = Math.min(Math.max(maxTilt, 1), 6);
    setTilt({
      rotateX: -normY * clampedTilt * 2,
      rotateY: normX * clampedTilt * 2,
    });
    setGlow({
      x: relX - rect.width / 2,
      y: relY - rect.height / 2,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlow((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      style={{ perspective: "1000px" }}
      data-cursor-label={cursorLabel}
      className={cn("relative", className)}
      {...props}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={
          isEnabled
            ? { rotateX: tilt.rotateX, rotateY: tilt.rotateY }
            : { rotateX: 0, rotateY: 0 }
        }
        transition={SPRING_PLAYFUL}
        style={{ transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-card border border-border bg-surface p-6 shadow-[var(--shadow-card)] transition-colors duration-250 hover:border-primary/50 will-change-transform"
      >
        {/* Cursor-following glow translated via transform only */}
        {isEnabled && (
          <div
            aria-hidden="true"
            style={{
              transform: `translate3d(${glow.x}px, ${glow.y}px, 0)`,
              opacity: glow.active ? 1 : 0,
            }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-250"
          >
            <div className="h-56 w-56 rounded-full bg-primary/15 blur-2xl" />
          </div>
        )}
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
}

export default TiltCard;
