import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { WorkGridClient } from "@/components/sections/WorkGridClient";
import { CTABandSection } from "@/components/sections/home/CTABandSection";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Work & Concept Projects",
  description:
    "Filterable showcase of EliavaTech concept projects across clinic booking, retail e-commerce, and real estate CRM.",
  path: "/work",
  ogTag: "Concept Projects · Proof of Capability",
});

export default function WorkPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumb} />
      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <Badge variant="gold" size="md" dot>
            Concept Projects · Proof of Capability
          </Badge>
          <SplitHeading
            text="Working demonstrations built to production standards."
            as="h1"
            className="text-h1 block"
          />
          <p className="text-body text-text-muted">
            Every project below is clearly labelled as a <strong>Concept project</strong> engineered to demonstrate our website, e-commerce, WhatsApp automation, and custom CRM capabilities.
          </p>
        </div>
      </Section>

      <Section>
        <WorkGridClient />
      </Section>

      <CTABandSection />
    </div>
  );
}

