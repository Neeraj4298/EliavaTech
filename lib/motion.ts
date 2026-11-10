"use client";

import * as React from "react";

/**
 * Section 5.3 — Motion Tokens
 * - Durations: fast 150 ms, base 250 ms, slow 400 ms, hero 700 to 900 ms.
 * - Easing: standard cubic-bezier(0.22, 1, 0.36, 1), spring (stiffness 260, damping 24).
 * - Stagger: 60 to 80 ms between siblings.
 * - Animate only transform and opacity. Never animate width, height, top or left.
 */
export const MOTION_DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  pageWipe: 0.5,
  hero: 0.8,
} as const;

export const EASE_STANDARD: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const SPRING_PLAYFUL = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
};

export const STAGGER_SIBLINGS = 0.07; // 70ms (within 60–80ms spec)

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Section 5.8 — Motion Accessibility:
 * React 19 safe hook for `prefers-reduced-motion: reduce`.
 */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
}

function subscribeFinePointer(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine) and (hover: hover)").matches;
}

/**
 * Detects desktop/fine pointer devices so custom cursor, magnetic pull,
 * and 3D card tilt are automatically disabled on touch devices.
 */
export function useIsFinePointer(): boolean {
  return React.useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    () => false
  );
}
