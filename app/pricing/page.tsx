import type { Metadata } from "next";
import { PRICING_HEADER } from "@/content/pricing";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PricingPageClient } from "@/components/sections/PricingPageClient";
import { FAQSection } from "@/components/sections/home/FAQSection";
import { CTABandSection } from "@/components/sections/home/CTABandSection";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Founding client pricing for websites, e-commerce, WhatsApp automation, custom software, and monthly care plans.",
};

/**
 * Section 4.6 — Pricing Page:
 * Founding client pricing, One-time vs Monthly toggle, exact packages,
 * third-party fees note, and Request a custom quote form.
 */
export default function PricingPage() {
  return (
    <div className="flex flex-col">
      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <Badge variant="gold" size="md" dot>
            {PRICING_HEADER.badge}
          </Badge>
          <SplitHeading
            text={PRICING_HEADER.title}
            as="h1"
            className="text-h1 block"
          />
          <p className="text-body text-text-muted">
            {PRICING_HEADER.description}
          </p>
        </div>
      </Section>

      <Section>
        <PricingPageClient />
      </Section>

      <FAQSection />
      <CTABandSection />
    </div>
  );
}

