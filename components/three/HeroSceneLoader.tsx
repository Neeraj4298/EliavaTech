"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { SceneFallback } from "./SceneFallback";

const DynamicHeroScene = dynamic(
  () => import("./HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <SceneFallback />,
  }
);

function detectCanRunWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // Low-power / small phone heuristic per Section 5.2
    const nav = window.navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return false;
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) {
      return false;
    }
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) {
      return false;
    }

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

const emptySubscribe = () => () => {};

/**
 * Section 5.2 & 5.8 — HeroSceneLoader:
 * - Dynamically imports the 3D scene with `ssr: false` so hero text paints first.
 * - Pauses rendering when off-screen (IntersectionObserver) or when tab is hidden.
 * - Provides a visible Pause/Play button per Section 5.8.
 * - Falls back to `SceneFallback` when WebGL is unavailable, on low-power devices,
 *   or when `prefers-reduced-motion` is enabled.
 */
export function HeroSceneLoader() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const canRender3D = React.useSyncExternalStore(
    emptySubscribe,
    detectCanRunWebGL,
    () => true
  );
  const [inView, setInView] = React.useState(true);
  const [tabVisible, setTabVisible] = React.useState(true);
  const [pausedByUser, setPausedByUser] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const onVisibilityChange = () => {
      setTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const showFallback = prefersReducedMotion || canRender3D === false;
  const isSceneActive = inView && tabVisible && !pausedByUser;

  return (
    <div ref={containerRef} className="relative w-full">
      {showFallback ? (
        <SceneFallback />
      ) : (
        <>
          <DynamicHeroScene active={isSceneActive} />
          <button
            type="button"
            onClick={() => setPausedByUser((p) => !p)}
            aria-label={pausedByUser ? "Resume 3D animation" : "Pause 3D animation"}
            className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface/85 px-3 py-1.5 text-xs font-medium text-text backdrop-blur-xs transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {pausedByUser ? (
              <>
                <Play strokeWidth={1.5} className="h-3 w-3 text-primary" />
                <span>Play 3D</span>
              </>
            ) : (
              <>
                <Pause strokeWidth={1.5} className="h-3 w-3 text-text-muted" />
                <span>Pause 3D</span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default HeroSceneLoader;
