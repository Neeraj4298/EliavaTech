"use client";

import * as React from "react";
import { FINAL_CTA_CONTENT } from "@/content/home";
import { Section } from "@/components/layout/Section";
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
      <div className="relative overflow-hidden rounded-card border border-border bg-surface-2 p-8 sm:p-12 md:p-16 text-center shadow-[var(--shadow-card)]">
        <div className="relative z-10 mx-auto max-w-3xl space-y-5">
          <Reveal>
            <p className="font-mono text-xs font-medium text-primary">
              We reply within one business day
            </p>
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
                <Button href={FINAL_CTA_CONTENT.primaryCta.href} variant="primary" size="lg" withArrow>
                  {FINAL_CTA_CONTENT.primaryCta.label}
                </Button>
              </MagneticButton>

              <MagneticButton>
                <Button href={FINAL_CTA_CONTENT.secondaryCta.href} variant="secondary" size="lg">
                  {FINAL_CTA_CONTENT.secondaryCta.label}
                </Button>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export default CTABandSection;
