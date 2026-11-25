"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { usePrefersReducedMotion } from "@/lib/motion";

export interface ParticleFieldProps {
  count?: number;
  isDark?: boolean;
  className?: string;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  scale: number;
  phase: number;
}

function createParticles(count: number): Particle3D[] {
  const list: Particle3D[] = [];

  for (let i = 0; i < count; i++) {
    const seed1 = Math.sin(i * 12.9898) * 43758.5453;
    const seed2 = Math.sin(i * 78.233) * 43758.5453;
    const seed3 = Math.sin(i * 39.425) * 43758.5453;

    const r1 = seed1 - Math.floor(seed1);
    const r2 = seed2 - Math.floor(seed2);
    const r3 = seed3 - Math.floor(seed3);

    // Wide 3D volume spanning the full hero section width and height
    const radius = 2.0 + r1 * 3.2;
    const theta = r2 * Math.PI * 2;
    const phi = Math.acos(2 * r3 - 1);

    list.push({
      x: radius * Math.sin(phi) * Math.cos(theta) * 1.6,
      y: radius * Math.sin(phi) * Math.sin(theta) * 0.95,
      z: radius * Math.cos(phi) * 0.6,
      scale: 0.6 + r1 * 0.75,
      phase: r2 * Math.PI * 2,
    });
  }

  return list;
}

/**
 * Full-Hero 3D Perspective Floating Particle Field:
 * Renders the 3D rotating square dots across the entire Hero section background.
 */
export function ParticleField({
  count = 180,
  isDark: isDarkProp,
  className,
}: ParticleFieldProps) {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDark = isDarkProp ?? resolvedTheme !== "light";

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particles = React.useMemo(() => createParticles(count), [count]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
    };

    updateSize();
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateSize)
        : null;
    if (canvas.parentElement && resizeObserver) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener("resize", updateSize, { passive: true });

    let elapsed = 0;
    let lastTime = performance.now();
    const cameraZ = 5.4;
    const fovRad = (42 * Math.PI) / 180;
    const focalFactor = 1 / Math.tan(fovRad / 2);

    const renderFrame = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      if (!prefersReducedMotion) {
        elapsed += delta;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const rotY = elapsed * 0.045;
      const rotX = Math.sin(elapsed * 0.2) * 0.06;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      ctx.fillStyle = isDark ? "#9A8DFF" : "#4B3FE0";
      ctx.shadowColor = isDark
        ? "rgba(124, 108, 255, 0.95)"
        : "rgba(75, 63, 224, 0.65)";
      ctx.shadowBlur = isDark ? 14 : 9;

      const halfW = width * 0.5;
      const halfH = height * 0.5;
      const projScale = halfH * focalFactor;
      const baseAlpha = isDark ? 0.65 : 0.42;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Rotate around Y then X (matching Three.js Euler order)
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const depth = cameraZ - z2;
        if (depth <= 1.4) continue;

        const screenX = halfW + (x1 / depth) * projScale;
        const screenY = halfH - (y2 / depth) * projScale;
        const pointSize = Math.min(4.2, Math.max(1.8, (11.5 * p.scale) / depth));

        if (
          screenX >= -pointSize &&
          screenX <= width + pointSize &&
          screenY >= -pointSize &&
          screenY <= height + pointSize
        ) {
          const shimmer = 0.72 + 0.28 * Math.sin(elapsed * 1.3 + p.phase);
          ctx.globalAlpha = baseAlpha * shimmer;
          ctx.fillRect(
            screenX - pointSize * 0.5,
            screenY - pointSize * 0.5,
            pointSize,
            pointSize
          );
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = window.requestAnimationFrame(renderFrame);
      }
    };

    animationFrameId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [isDark, particles, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        className ??
        "pointer-events-none absolute inset-0 h-full w-full select-none"
      }
    />
  );
}

export default ParticleField;
