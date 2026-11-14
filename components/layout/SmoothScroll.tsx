"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/lib/motion";

export interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * Section 5.1, 5.5 & 5.8 — SmoothScroll (Lenis):
 * - Provides smooth inertial scrolling on desktop.
 * - Scrolls to top on route navigation.
 * - Automatically disabled when `prefers-reduced-motion: reduce` is active.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const lenisRef = React.useRef<Lenis | null>(null);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      content: document.body,
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      allowNestedScroll: true,
      touchMultiplier: 1.5,
      prevent: (node: HTMLElement) =>
        Boolean(node.closest?.("[data-lenis-prevent]")),
    });

    lenisRef.current = lenis;

    const mainEl = document.getElementById("main-content");
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(document.body);
    if (mainEl) resizeObserver.observe(mainEl);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  // Scroll to top and recalculate page dimensions on route changes per Section 5.5
  React.useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.resize();
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
      const timer = window.setTimeout(() => {
        lenisRef.current?.resize();
      }, 250);
      return () => window.clearTimeout(timer);
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname]);

  return <>{children}</>;
}

export default SmoothScroll;
