"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WhatsAppDemo } from "@/components/sections/WhatsAppDemo";
import { Reveal } from "@/components/motion/Reveal";

const AUTOMATION_BENEFITS = [
  "Replies to incoming WhatsApp enquiries in under 2 seconds, 24/7.",
  "Checks real appointment slots or product availability automatically.",
  "Sends automated reminders 2 hours prior to cut clinic & salon no-shows.",
  "Logs every lead directly into your CRM or Google Sheet via n8n.",
];

/**
 * Section 4.2 #6 — Interactive Demo ("See automation in action"):
 * Looping animated WhatsApp conversation that books an appointment.
 */
export function WhatsAppDemoSection() {
  return (
    <Section className="border-y border-border/60 bg-surface/40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 space-y-6">
          <SectionHeading
            eyebrow="See Automation in Action"
            eyebrowVariant="gold"
            title="Turn WhatsApp messages into booked appointments automatically."
            description="Your customers already use WhatsApp every day. We connect your business number to structured booking flows and CRM pipelines."
          />

          <Reveal delay={0.1}>
            <ul className="space-y-3">
              {AUTOMATION_BENEFITS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-small text-text-muted"
                >
                  <CheckCircle2
                    strokeWidth={1.5}
                    className="h-4 w-4 text-success shrink-0 mt-1"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="pt-2">
              <Link href="/services/whatsapp-ai-automation">
                <Button variant="primary" size="md" withArrow>
                  Explore WhatsApp &amp; AI Automation
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="lg:col-span-7">
          <WhatsAppDemo />
        </Reveal>
      </div>
    </Section>
  );
}

export default WhatsAppDemoSection;
