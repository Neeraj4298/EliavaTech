"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { INDUSTRY_ITEMS } from "@/content/navigation";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/**
 * Section 4.2 #5 — Industries Showcase:
 * Tabbed and horizontal scrollable showcase with the solution bundle for each industry.
 */
export function IndustriesShowcaseSection() {
  const [selectedSlug, setSelectedSlug] = React.useState(INDUSTRY_ITEMS[0].slug);
  const activeIndustry =
    INDUSTRY_ITEMS.find((i) => i.slug === selectedSlug) ?? INDUSTRY_ITEMS[0];

  return (
    <Section id="industries">
      <div className="space-y-10">
        <SectionHeading
          eyebrow="Industry Solution Bundles"
          title="Built for how Indian SMBs actually operate."
          description="Select your sector to see the exact website, booking, and automation bundle we deploy."
          action={
            <Link href="/industries">
              <Button variant="secondary" size="md" withArrow>
                All 7 Industries
              </Button>
            </Link>
          }
        />

        {/* Horizontal Swipe / Tab Bar */}
        <div
          role="tablist"
          aria-label="Industry sectors"
          className="flex items-center gap-2 overflow-x-auto pb-2"
        >
          {INDUSTRY_ITEMS.map((item) => {
            const isSelected = item.slug === selectedSlug;
            return (
              <button
                key={item.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedSlug(item.slug)}
                className={cn(
                  "shrink-0 rounded-pill border px-4 py-2 text-small font-medium transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-surface text-text-muted hover:bg-surface-2 hover:text-text"
                )}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        {/* Active Industry Detail Card */}
        <Card variant="elevated" padding="lg" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <Badge variant="gold" size="sm" dot>
              Recommended Sector Bundle
            </Badge>
            <h3 className="text-h3">{activeIndustry.title}</h3>
            <p className="text-body text-text-muted">
              {activeIndustry.summary}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href={activeIndustry.href}>
                <Button variant="primary" size="md" withArrow>
                  Explore {activeIndustry.title} Bundle
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="md">
                  Request Custom Scope
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3 rounded-card border border-border bg-surface p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
              What&apos;s Included in the Bundle
            </p>
            <ul className="space-y-3">
              {activeIndustry.bundle.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center justify-between rounded-input border border-border/70 bg-surface-2 px-4 py-3 text-small font-medium text-text"
                >
                  <span className="flex items-center gap-2.5">
                    <Check strokeWidth={1.5} className="h-4 w-4 text-success shrink-0" />
                    <span>{feature}</span>
                  </span>
                  <ArrowRight strokeWidth={1.5} className="h-4 w-4 text-text-muted" />
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </Section>
  );
}

export default IndustriesShowcaseSection;
