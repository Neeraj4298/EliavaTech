import type { Metadata } from "next";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export const metadata: Metadata = {
  title: "Contact & Consultation Booking",
  description:
    "Book a free consultation or send us your project brief. We reply within one business day.",
};

export default function ContactPage() {
  return (
    <PlaceholderPageShell
      eyebrow="We reply within one business day"
      title="Tell us about the business problem you want to solve."
      description="Book a free consultation call or send a message. Full contact form, Cal.com booking embed, and WhatsApp click-to-chat slot in here."
      primaryCta={{ label: "Explore Services", href: "/services" }}
      secondaryCta={{ label: "View Pricing", href: "/pricing" }}
      cards={[
        {
          title: "Email [PLACEHOLDER]",
          subtitle: "hello@eliavatech.com",
          description: "Direct email for project briefs and partnership enquiries.",
          badge: "Direct Contact",
        },
        {
          title: "WhatsApp [PLACEHOLDER]",
          subtitle: "+91 90000 00000",
          description: "Instant click-to-chat for quick questions during business hours.",
          badge: "WhatsApp",
        },
        {
          title: "Location [PLACEHOLDER]",
          subtitle: "Remote-first, serving India",
          description: "Working with growing SMBs across India with video consultations.",
          badge: "Service Area",
        },
      ]}
    />
  );
}
