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

/**
 * Section 4.2 — Home Page:
 * Renders all 11 specified sections in exact order:
 * 1. Hero (with interactive 3D scene)
 * 2. Problem strip (5 cards)
 * 3. Services overview (5 cards + capabilities stack)
 * 4. How we work (4-step GSAP timeline)
 * 5. Industries showcase (7 industries + bundles)
 * 6. Interactive WhatsApp demo
 * 7. Why EliavaTech (4 animated counters)
 * 8. Work preview (3 concept projects with device mockups)
 * 9. Founders preview (3 neutral illustrated avatars)
 * 10. FAQ accordion (6 questions)
 * 11. Final CTA band
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
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



