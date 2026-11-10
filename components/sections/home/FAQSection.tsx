"use client";

import * as React from "react";
import { HOME_FAQS } from "@/content/home";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Section 4.2 #10 — FAQ Section:
 * Six common questions in an accessible accordion.
 */
export function FAQSection() {
  return (
    <Section className="border-t border-border/60 bg-surface/40" id="faq">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title="Clear answers before you commit."
            description="Everything you need to know about timelines, pricing, ownership, and ongoing support."
          />
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <FAQAccordion items={HOME_FAQS} />
        </Reveal>
      </div>
    </Section>
  );
}

export default FAQSection;
