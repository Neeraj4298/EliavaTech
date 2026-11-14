"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Pause, Play, Box } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { SceneFallback } from "./SceneFallback";

const DynamicHeroScene = dynamic(
  () => import("./HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <SceneFallback />,
  }
);

function detectShouldAutoLoad3D(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const nav = window.navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return false;

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
 * - Code-splits Three.js (`ssr: false`) and defers mounting until after initial paint.
 * - Shows `SceneFallback` automatically when WebGL is unavailable, on small/low-power phones,
 *   or when `prefers-reduced-motion` is enabled.
 */
export function HeroSceneLoader() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const shouldAuto3D = React.useSyncExternalStore(
    emptySubscribe,
    detectShouldAutoLoad3D,
    () => false
  );

  const [readyFor3D, setReadyFor3D] = React.useState(false);
  const [force3DOnMobile, setForce3DOnMobile] = React.useState(false);
  const [inView, setInView] = React.useState(true);
  const [tabVisible, setTabVisible] = React.useState(true);
  const [pausedByUser, setPausedByUser] = React.useState(false);

  React.useEffect(() => {
    if (prefersReducedMotion || (!shouldAuto3D && !force3DOnMobile)) return;
    const timer = window.setTimeout(() => setReadyFor3D(true), 180);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, shouldAuto3D, force3DOnMobile]);

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

  const show3D = !prefersReducedMotion && (shouldAuto3D || force3DOnMobile) && readyFor3D;
  const isSceneActive = inView && tabVisible && !pausedByUser;

  return (
    <div ref={containerRef} className="relative w-full">
      {!show3D ? (
        <div className="relative">
          <SceneFallback />
          {!prefersReducedMotion && !shouldAuto3D && !force3DOnMobile && (
            <button
              type="button"
              onClick={() => setForce3DOnMobile(true)}
              aria-label="Enable interactive 3D view"
              className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface/90 px-3 py-1.5 text-xs font-medium text-text backdrop-blur-xs transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Box strokeWidth={1.5} className="h-3.5 w-3.5 text-primary" />
              <span>Interactive 3D</span>
            </button>
          )}
        </div>
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

