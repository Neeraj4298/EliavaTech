"use client";

import * as React from "react";
import { WHY_ELIAVA_STATS } from "@/content/home";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { StatCounter } from "@/components/ui/StatCounter";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";

/**
 * Section 4.2 #7 — Why EliavaTech:
 * Four value points with animated counters using honest numbers only
 * (5 service lines, 24h response time, 2-week typical launch, 100% transparent scope).
 */
export function WhyEliavaSection() {
  return (
    <Section>
      <div className="space-y-12">
        <SectionHeading
          eyebrow="Why EliavaTech"
          title="A steady engineering partner for growing businesses."
          description="Honest commitments, direct founder access, and software built to last."
        />

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_ELIAVA_STATS.map((stat) => (
            <StaggerItem key={stat.id} className="h-full">
              <Card
                variant="default"
                className="h-full flex flex-col justify-between gap-4 hover:border-primary/40"
              >
                <div className="space-y-2">
                  <div className="font-mono text-4xl md:text-5xl font-semibold text-primary">
                    <StatCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-text">
                    {stat.label}
                  </h3>
                </div>
                <p className="text-small text-text-muted leading-relaxed">
                  {stat.description}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}

export default WhyEliavaSection;
