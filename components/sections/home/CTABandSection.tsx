"use client";

import * as React from "react";
import Link from "next/link";
import { FINAL_CTA_CONTENT } from "@/content/home";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";

/**
 * Section 4.2 #11 — Final CTA Band:
 * "Have a business problem? Let's work out how technology can solve it." with booking button.
 */
export function CTABandSection() {
  return (
    <Section className="border-t border-border/60">
      <div className="relative overflow-hidden rounded-card border border-primary/40 bg-surface-2 p-8 sm:p-12 md:p-16 text-center shadow-[var(--shadow-card-hover)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, var(--primary) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <Reveal>
            <Badge variant="gold" size="md" dot>
              We reply within one business day
            </Badge>
          </Reveal>

          <SplitHeading
            text={FINAL_CTA_CONTENT.heading}
            as="h2"
            className="text-h2 block"
          />

          <Reveal delay={0.1}>
            <p className="text-body text-text-muted max-w-2xl mx-auto">
              {FINAL_CTA_CONTENT.subtext}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <MagneticButton cursorLabel="Book">
                <Link href={FINAL_CTA_CONTENT.primaryCta.href}>
                  <Button variant="primary" size="lg" withArrow>
                    {FINAL_CTA_CONTENT.primaryCta.label}
                  </Button>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href={FINAL_CTA_CONTENT.secondaryCta.href}>
                  <Button variant="secondary" size="lg">
                    {FINAL_CTA_CONTENT.secondaryCta.label}
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export default CTABandSection;
