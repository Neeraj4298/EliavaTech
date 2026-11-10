"use client";

import * as React from "react";
import { Code2, MessageSquare, ShoppingCart, BarChart3 } from "lucide-react";
import { HERO_CONTENT } from "@/content/home";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface SceneFallbackProps {
  className?: string;
  reason?: string;
}

/**
 * Section 5.2 & 5.8 — SceneFallback:
 * Static architectural SVG & layered monogram fallback displayed when WebGL is
 * unavailable, on low-power phones, when paused, or when prefers-reduced-motion is active.
 */
export function SceneFallback({ className }: SceneFallbackProps) {
  return (
    <div
      role="img"
      aria-label="EliavaTech 3D Monogram Architecture — Websites, Custom Software, and AI Automation layers"
      className={cn(
        "relative flex h-[420px] sm:h-[480px] lg:h-[540px] w-full items-center justify-center overflow-hidden rounded-card border border-border bg-surface/70 p-6 shadow-[var(--shadow-card)]",
        className
      )}
    >
      {/* Subtle architectural background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, var(--primary) 0%, transparent 62%), linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 32px 32px, 32px 32px",
        }}
      />

      {/* Four Orbiting Service Tokens (Static Representation) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 flex items-center justify-between"
      >
        <div className="flex flex-col justify-between h-full py-6">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs text-text shadow-sm">
            <Code2 strokeWidth={1.5} className="h-3.5 w-3.5 text-primary" />
            <span>Websites</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs text-text shadow-sm">
            <ShoppingCart strokeWidth={1.5} className="h-3.5 w-3.5 text-gold" />
            <span>E-commerce</span>
          </span>
        </div>
        <div className="flex flex-col justify-between h-full py-6 items-end">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs text-text shadow-sm">
            <MessageSquare strokeWidth={1.5} className="h-3.5 w-3.5 text-success" />
            <span>WhatsApp AI</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs text-text shadow-sm">
            <BarChart3 strokeWidth={1.5} className="h-3.5 w-3.5 text-primary" />
            <span>CRM &amp; ERP</span>
          </span>
        </div>
      </div>

      {/* Central Isometric 3-Bar Monogram Stack */}
      <div className="relative z-10 flex flex-col items-start gap-5 max-w-xs w-full">
        {/* Top Slab: Gold */}
        <div className="w-full rounded-card border border-gold/50 bg-gold/15 p-4 shadow-md backdrop-blur-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="h-3.5 w-28 rounded-xs bg-gold" />
            <Badge variant="gold" size="sm">
              {HERO_CONTENT.layers[0].badge} · {HERO_CONTENT.layers[0].label}
            </Badge>
          </div>
        </div>

        {/* Middle Slab: Shorter stepped bar */}
        <div className="w-4/5 rounded-card border border-primary/50 bg-primary/15 p-4 shadow-md backdrop-blur-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="h-3.5 w-20 rounded-xs bg-primary" />
            <Badge variant="primary" size="sm">
              {HERO_CONTENT.layers[1].badge} · {HERO_CONTENT.layers[1].label}
            </Badge>
          </div>
        </div>

        {/* Bottom Slab: Full width foundation */}
        <div className="w-full rounded-card border border-border bg-surface-2 p-4 shadow-md backdrop-blur-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="h-3.5 w-28 rounded-xs bg-text" />
            <Badge variant="default" size="sm">
              {HERO_CONTENT.layers[2].badge} · {HERO_CONTENT.layers[2].label}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SceneFallback;
