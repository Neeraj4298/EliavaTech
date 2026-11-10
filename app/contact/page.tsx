import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { BookingEmbed } from "@/components/forms/BookingEmbed";
import { WhatsAppButton } from "@/components/overlays/WhatsAppButton";
import { LazyChatWidget } from "@/components/chat/LazyChatWidget";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact & Consultation Booking",
  description:
    "Book a free consultation call or send us your project brief. We reply within one business day.",
  path: "/contact",
  ogTag: "We reply within one business day",
});

export default function ContactPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumb} />
      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <Badge variant="gold" size="md" dot>
            We reply within one business day
          </Badge>
          <SplitHeading
            text="Tell us about the business problem you want to solve."
            as="h1"
            className="text-h1 block"
          />
          <p className="text-body text-text-muted">
            Send a project brief using the form below, book a 30-minute video call directly on our calendar, or message us on WhatsApp.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-8">
            <ContactForm />
            <BookingEmbed />
            <div className="space-y-3">
              <Badge variant="primary" size="sm" dot>
                Instant AI Assistant
              </Badge>
              <h2 className="text-h3">
                Have a quick question about pricing, scope, or timelines?
              </h2>
              <LazyChatWidget mode="full" />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <Card variant="elevated" padding="lg" className="space-y-6">
              <div className="space-y-2 border-b border-border pb-4">
                <div className="flex items-center gap-2 text-success font-mono text-xs">
                  <Clock strokeWidth={1.5} className="h-4 w-4" />
                  <span>Response Time: Within 1 Business Day</span>
                </div>
                <h2 className="text-h3">Direct Contact Channels</h2>
                <p className="text-small text-text-muted">
                  Speak directly with the founding engineering and design team.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 rounded-input border border-border bg-surface p-4">
                  <Mail strokeWidth={1.5} className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs text-text-muted uppercase">
                      Business Email [PLACEHOLDER]
                    </p>
                    <a
                      href="mailto:hello@eliavatech.com"
                      className="font-heading text-base font-semibold text-text hover:text-primary"
                    >
                      hello@eliavatech.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-input border border-border bg-surface p-4">
                  <Phone strokeWidth={1.5} className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs text-text-muted uppercase">
                      Phone &amp; WhatsApp [PLACEHOLDER]
                    </p>
                    <a
                      href="tel:+919000000000"
                      className="font-heading text-base font-semibold text-text hover:text-primary"
                    >
                      +91 90000 00000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-input border border-border bg-surface p-4">
                  <MapPin strokeWidth={1.5} className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs text-text-muted uppercase">
                      Service Area [PLACEHOLDER]
                    </p>
                    <p className="font-heading text-base font-semibold text-text">
                      Remote-first, serving India [PLACEHOLDER]
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Video consultations via Google Meet · On-site by arrangement
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-3">
                <p className="text-xs text-text-muted">
                  Prefer instant messaging? Start a prefilled WhatsApp chat:
                </p>
                <WhatsAppButton
                  variant="inline"
                  label="Chat on WhatsApp Now"
                  className="w-full"
                />
              </div>
            </Card>

            <Card variant="default" padding="md" className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
                Social Profiles [PLACEHOLDER]
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "LinkedIn", href: "https://linkedin.com" },
                  { name: "Instagram", href: "https://instagram.com" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-input border border-border bg-surface-2 px-4 py-2.5 text-small font-medium text-text hover:border-primary/50 hover:text-primary"
                  >
                    <span>{social.name}</span>
                    <ArrowUpRight strokeWidth={1.5} className="h-4 w-4 text-text-muted" />
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}

