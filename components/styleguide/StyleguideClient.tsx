"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Columns2, Maximize2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TokensShowcase } from "./TokensShowcase";
import { BrandShowcase } from "./BrandShowcase";
import { PrimitivesShowcase } from "./PrimitivesShowcase";

export function StyleguideClient() {
  const [dualThemeView, setDualThemeView] = React.useState(true);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Sticky Glass Header */}
      <header className="sticky top-0 z-40 glass-surface border-b">
        <div className="container-max h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-small text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <span className="text-border">|</span>
            <Logo variant="full" size="sm" />
            <Badge variant="gold" size="sm">
              /styleguide (Hidden Route)
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                dualThemeView ? (
                  <Maximize2 strokeWidth={1.5} className="h-3.5 w-3.5" />
                ) : (
                  <Columns2 strokeWidth={1.5} className="h-3.5 w-3.5" />
                )
              }
              onClick={() => setDualThemeView((v) => !v)}
            >
              {dualThemeView ? "Single Theme View" : "Both Themes View"}
            </Button>
            <ThemeToggle showLabel />
          </div>
        </div>
      </header>

      <main className="container-max py-12 md:py-16 space-y-20">
        {/* Intro Banner */}
        <section className="space-y-4 border-b border-border pb-10">
          <Badge variant="primary" size="md" dot>
            EliavaTech Design System · Section 2 &amp; Section 6
          </Badge>
          <h1 className="text-h1">Brand Tokens &amp; UI Primitives</h1>
          <p className="text-body text-text-muted max-w-3xl">
            Every color variable, typography scale, spacing and radius token,
            logo variant, theme toggle, and Section 6 primitive rendered in both{" "}
            <code className="font-mono text-small">data-theme=&quot;dark&quot;</code>{" "}
            and{" "}
            <code className="font-mono text-small">data-theme=&quot;light&quot;</code>.
          </p>
        </section>

        {/* Brand & Logo Variants */}
        <BrandShowcase />

        {/* Section 2 Design Tokens */}
        <TokensShowcase />

        {/* Section 6 Primitives in Both Themes */}
        <section className="space-y-6" id="primitives">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <Badge variant="primary" dot className="mb-2">
                Section 6
              </Badge>
              <h2 className="text-h2">Component Primitives in Both Themes</h2>
              <p className="text-body text-text-muted mt-1">
                Button, Input, Textarea, Select, Badge, Card, Tabs, Tooltip, and
                Modal verified across Dark and Light themes.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                dualThemeView ? (
                  <Maximize2 strokeWidth={1.5} className="h-3.5 w-3.5" />
                ) : (
                  <Columns2 strokeWidth={1.5} className="h-3.5 w-3.5" />
                )
              }
              onClick={() => setDualThemeView((v) => !v)}
            >
              {dualThemeView
                ? "Switch to Active Theme Full-Width"
                : "Show Dark + Light Side-by-Side"}
            </Button>
          </div>

          {dualThemeView ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <PrimitivesShowcase themeScope="dark" />
              <PrimitivesShowcase themeScope="light" />
            </div>
          ) : (
            <PrimitivesShowcase />
          )}
        </section>
      </main>
    </div>
  );
}

export default StyleguideClient;
