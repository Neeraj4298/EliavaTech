"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
  SplitHeading,
  MagneticButton,
  TiltCard,
} from "@/components/motion";

export interface PlaceholderCardItem {
  title: string;
  subtitle?: string;
  description: string;
  href?: string;
  badge?: string;
}

export interface PlaceholderPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  cards?: PlaceholderCardItem[];
  children?: React.ReactNode;
}

/**
 * Reusable page shell for sitemap routes that demonstrates:
 * - SplitHeading (word-by-word masked reveal)
 * - Reveal (fade up 24px at 20% visibility)
 * - StaggerGroup + StaggerItem (60–80ms sibling stagger)
 * - TiltCard (max 6 deg 3D tilt + cursor radial glow)
 * - MagneticButton (desktop cursor magnetic pull)
 */
export function PlaceholderPageShell({
  eyebrow,
  title,
  description,
  primaryCta = { label: "Book a Free Consultation", href: "/contact" },
  secondaryCta = { label: "See Our Work", href: "/work" },
  cards = [],
  children,
}: PlaceholderPageShellProps) {
  return (
    <Section>
      <div className="space-y-14">
        <div className="space-y-5 max-w-3xl">
          <Reveal>
            <Badge variant="primary" size="md" dot>
              {eyebrow}
            </Badge>
          </Reveal>

          <SplitHeading text={title} as="h1" className="text-h1 block" />

          <Reveal delay={0.1}>
            <p className="text-body text-text-muted">{description}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton cursorLabel="Book">
                <Link href={primaryCta.href}>
                  <Button variant="primary" size="lg" withArrow>
                    {primaryCta.label}
                  </Button>
                </Link>
              </MagneticButton>

              {secondaryCta && (
                <MagneticButton>
                  <Link href={secondaryCta.href}>
                    <Button variant="secondary" size="lg">
                      {secondaryCta.label}
                    </Button>
                  </Link>
                </MagneticButton>
              )}
            </div>
          </Reveal>
        </div>

        {cards.length > 0 && (
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => {
              const cardInner = (
                <TiltCard
                  cursorLabel={card.href ? "View" : undefined}
                  className="h-full"
                >
                  <div className="flex h-full flex-col justify-between gap-4">
                    <div className="space-y-2.5">
                      {card.badge && (
                        <Badge variant="default" size="sm">
                          {card.badge}
                        </Badge>
                      )}
                      <h2 className="font-heading text-xl font-semibold text-text">
                        {card.title}
                      </h2>
                      {card.subtitle && (
                        <p className="font-mono text-xs text-primary">
                          {card.subtitle}
                        </p>
                      )}
                      <p className="text-small text-text-muted">
                        {card.description}
                      </p>
                    </div>

                    {card.href && (
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-medium text-primary">
                        <span>Explore details</span>
                        <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </TiltCard>
              );

              return (
                <StaggerItem key={card.title} className="h-full">
                  {card.href ? (
                    <Link href={card.href} className="block h-full">
                      {cardInner}
                    </Link>
                  ) : (
                    cardInner
                  )}
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        )}

        {children}
      </div>
    </Section>
  );
}

export default PlaceholderPageShell;
