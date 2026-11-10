"use client";

import * as React from "react";
import { FOUNDERS_PLACEHOLDER } from "@/content/home";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";

/**
 * Section 4.2 #9 & Section 4.7 — Founders Preview:
 * Three neutral illustrated founder avatars with [PLACEHOLDER] details and link to About.
 */
export function FoundersPreviewSection() {
  return (
    <Section>
      <div className="space-y-12">
        <SectionHeading
          eyebrow="Founding Team · [PLACEHOLDER]"
          title="Led directly by three co-founders."
          description="Every project is scoped, designed, and engineered by the founders—not handed off to junior account managers."
          action={
            <Button href="/about" variant="secondary" size="md" withArrow>
              More About EliavaTech
            </Button>
          }
        />

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FOUNDERS_PLACEHOLDER.map((founder) => (
            <StaggerItem key={founder.id} className="h-full">
              <Card
                variant="default"
                className="h-full flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Neutral Illustrated Geometric Avatar per Section 4.7 */}
                    <svg
                      viewBox="0 0 56 56"
                      className="h-14 w-14 rounded-full border border-border bg-surface-2 p-1"
                      role="img"
                      aria-label={`Illustrated avatar for ${founder.role}`}
                    >
                      <circle cx="28" cy="20" r="9" fill="var(--primary)" opacity="0.85" />
                      <path
                        d="M12 46c2.5-8.5 9.5-13 16-13s13.5 4.5 16 13"
                        fill="var(--text-muted)"
                        opacity="0.45"
                      />
                    </svg>
                    <Badge variant={founder.accent} size="sm">
                      {founder.focus}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-semibold text-text">
                      {founder.name}
                    </h3>
                    <p className="font-mono text-xs text-primary mt-0.5">
                      {founder.role}
                    </p>
                  </div>

                  <p className="text-small text-text-muted leading-relaxed">
                    {founder.bio}
                  </p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}

export default FoundersPreviewSection;
