"use client";

import * as React from "react";
import {
  SearchX,
  ClipboardList,
  UserMinus,
  MessageCircleQuestion,
  Workflow,
} from "lucide-react";
import { PROBLEM_CARDS, type ProblemCardData } from "@/content/home";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";

const iconMap: Record<
  ProblemCardData["icon"],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  SearchX,
  ClipboardList,
  UserMinus,
  MessageCircleQuestion,
  Workflow,
};

/**
 * Section 4.2 #2 — Problem Strip:
 * Five short cards: not found online, manual orders, lost leads,
 * repeated customer questions, inefficient processes. Each has an icon and a one-line promise.
 */
export function ProblemStripSection() {
  return (
    <Section className="border-b border-border/60 bg-surface/40">
      <div className="space-y-10">
        <SectionHeading
          eyebrow="Common Business Bottlenecks"
          title="Customer problems first. Technology second."
          description="Growing businesses lose time and revenue when enquiries, orders, and follow-ups rely on manual effort."
        />

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PROBLEM_CARDS.map((card) => {
            const Icon = iconMap[card.icon];
            return (
              <StaggerItem key={card.id} className="h-full">
                <Card
                  variant="default"
                  padding="sm"
                  className="h-full flex flex-col justify-between gap-4 hover:border-primary/40"
                >
                  <div className="space-y-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-input border border-border bg-surface-2 text-primary">
                      <Icon strokeWidth={1.5} className="h-5 w-5" />
                    </span>
                    <h3 className="font-heading text-base font-semibold text-text">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-text-muted">
                    {card.promise}
                  </p>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </Section>
  );
}

export default ProblemStripSection;
