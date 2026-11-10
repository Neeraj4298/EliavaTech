import type { Metadata } from "next";
import { HOME_FAQS } from "@/content/home";
import {
  buildFaqSchema,
  buildOrganizationSchema,
  buildPageMetadata,
  buildWebSiteSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { ProblemStripSection } from "@/components/sections/home/ProblemStripSection";
import { ServicesOverviewSection } from "@/components/sections/home/ServicesOverviewSection";
import { ProcessTimelineSection } from "@/components/sections/home/ProcessTimelineSection";
import { IndustriesShowcaseSection } from "@/components/sections/home/IndustriesShowcaseSection";
import { WhatsAppDemoSection } from "@/components/sections/home/WhatsAppDemoSection";
import { WhyEliavaSection } from "@/components/sections/home/WhyEliavaSection";
import { WorkPreviewSection } from "@/components/sections/home/WorkPreviewSection";
import { FoundersPreviewSection } from "@/components/sections/home/FoundersPreviewSection";
import { FAQSection } from "@/components/sections/home/FAQSection";
import { CTABandSection } from "@/components/sections/home/CTABandSection";

export const metadata: Metadata = buildPageMetadata({
  title: "Websites, Software & AI Automation for Growing Businesses",
  description:
    "We design websites, automate operations and build custom software for businesses that want to grow without a technical team.",
  path: "/",
  ogTag: "Digital solutions for growing businesses",
  keywords: [
    "website development company India",
    "custom software development",
    "WhatsApp automation service",
    "ecommerce website development",
    "AI chatbot for business",
    "CRM development for small business",
  ],
});

/**
 * Section 4.2 & Section 9 — Home Page:
 * Includes Organization, WebSite, and FAQPage JSON-LD schemas and all 11 Home sections.
 */
export default function HomePage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildFaqSchema(HOME_FAQS),
  ];

  return (
    <div className="flex flex-col">
      <JsonLd data={schemas} />
      <HeroSection />
      <ProblemStripSection />
      <ServicesOverviewSection />
      <ProcessTimelineSection />
      <IndustriesShowcaseSection />
      <WhatsAppDemoSection />
      <WhyEliavaSection />
      <WorkPreviewSection />
      <FoundersPreviewSection />
      <FAQSection />
      <CTABandSection />
    </div>
  );
}




