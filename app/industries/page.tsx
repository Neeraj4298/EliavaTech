import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { INDUSTRIES_DATA } from "@/content/industries";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { TiltCard } from "@/components/motion/TiltCard";
import { CTABandSection } from "@/components/sections/home/CTABandSection";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Website, booking, WhatsApp automation, and CRM bundles tailored for seven SMB sectors in India.",
};

/**
 * Section 4.4 — Industries Overview Page:
 * Grid of seven industry tiles linking to detail pages.
 */
export default function IndustriesPage() {
  return (
    <div className="flex flex-col">
      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <Reveal>
            <Badge variant="primary" size="md" dot>
              Seven Industry Sectors
            </Badge>
          </Reveal>
          <SplitHeading
            text="Solution bundles tailored to how your sector operates."
            as="h1"
            className="text-h1 block"
          />
          <Reveal delay={0.1}>
            <p className="text-body text-text-muted">
              A clinic needs slot booking and appointment reminders; a retail shop needs UPI checkout and GST billing. Explore the exact bundle built for your industry.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES_DATA.map((industry) => (
            <StaggerItem key={industry.slug} className="h-full">
              <Link href={`/industries/${industry.slug}`} className="block h-full group">
                <TiltCard cursorLabel="View" className="h-full">
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <Badge variant="default" size="sm">Industry Bundle</Badge>
                      <h2 className="font-heading text-2xl font-semibold text-text group-hover:text-primary transition-colors">
                        {industry.title}
                      </h2>
                      <p className="text-small text-text-muted leading-relaxed">
                        {industry.summary}
                      </p>

                      <div className="pt-2 space-y-2">
                        <p className="font-mono text-xs text-primary">Included Bundle:</p>
                        {industry.bundle.map((b) => (
                          <div key={b.item} className="flex items-center gap-2 text-xs text-text">
                            <Check strokeWidth={1.5} className="h-3.5 w-3.5 text-success shrink-0" />
                            <span>{b.item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between text-small font-medium text-primary">
                      <span>View Workflow &amp; Bundle</span>
                      <ArrowRight strokeWidth={1.5} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <CTABandSection />
    </div>
  );
}

