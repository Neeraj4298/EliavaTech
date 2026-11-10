import type { Metadata } from "next";
import { PRICING_HEADER } from "@/content/pricing";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PricingPageClient } from "@/components/sections/PricingPageClient";
import { FAQSection } from "@/components/sections/home/FAQSection";
import { CTABandSection } from "@/components/sections/home/CTABandSection";
import { HOME_FAQS } from "@/content/home";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildPageMetadata,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Founding Client Pricing — Websites, Automation & Monthly Care",
  description:
    "Transparent launch pricing for websites (from ₹9,999), e-commerce (from ₹34,999), WhatsApp automation (from ₹12,999), custom CRM software (from ₹49,999), and monthly care plans.",
  path: "/pricing",
  ogTag: "Founding Client Pricing",
});

export default function PricingPage() {
  const schemas = [
    buildFaqSchema(HOME_FAQS),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]),
  ];

  return (
    <div className="flex flex-col">
      <JsonLd data={schemas} />
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

