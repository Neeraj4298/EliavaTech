import type { Metadata } from "next";
import Link from "next/link";
import { Globe, ShoppingBag, MessageSquareCode, Boxes, CloudCog, ArrowRight, Check } from "lucide-react";
import { SERVICES_DATA, SERVICES_COMPARISON_STRIP, type ServiceDetailData } from "@/content/services";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { TiltCard } from "@/components/motion/TiltCard";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { CTABandSection } from "@/components/sections/home/CTABandSection";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Services — Websites, E-commerce, WhatsApp AI & Custom Software",
  description:
    "Web development, e-commerce, WhatsApp and AI automation, custom software, and cloud support built for growing Indian businesses.",
  path: "/services",
  ogTag: "Five Integrated Service Lines",
  keywords: [
    "website development company India",
    "ecommerce website development",
    "WhatsApp automation service",
    "custom software development",
  ],
});

const iconMap: Record<ServiceDetailData["icon"], React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Globe,
  ShoppingBag,
  MessageSquareCode,
  Boxes,
  CloudCog,
};

export default function ServicesPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumb} />
      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <Reveal><Badge variant="primary" size="md" dot>Five Integrated Service Lines</Badge></Reveal>
          <SplitHeading text="Websites, automation and custom software built around your business." as="h1" className="text-h1 block" />
          <Reveal delay={0.1}>
            <p className="text-body text-text-muted">
              Start with a search-ready website or WhatsApp booking flow, and connect e-commerce or custom CRM modules as your operations expand.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((s) => {
            const Icon = iconMap[s.icon];
            return (
              <StaggerItem key={s.slug} className="h-full">
                <Link href={`/services/${s.slug}`} className="block h-full group">
                  <TiltCard cursorLabel="View" className="h-full">
                    <div className="flex h-full flex-col justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-input bg-primary/12 text-primary">
                            <Icon strokeWidth={1.5} className="h-5 w-5" />
                          </span>
                          <Badge variant="gold" size="sm">{s.startingPrice}</Badge>
                        </div>
                        <h2 className="font-heading text-2xl font-semibold text-text group-hover:text-primary transition-colors">{s.title}</h2>
                        <p className="text-small text-text-muted">{s.outcome}</p>
                        <ul className="space-y-1.5 pt-1">
                          {s.includedChecklist.slice(0, 4).map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs text-text-muted">
                              <Check strokeWidth={1.5} className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-border/60 flex items-center justify-between text-small font-medium text-primary">
                        <span>View {s.shortTitle} Scope</span>
                        <ArrowRight strokeWidth={1.5} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Section>

      <Section className="border-y border-border/60 bg-surface/40">
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Service Comparison Strip"
            title="Compare outcomes, timelines and starting investment."
          />
          <div className="overflow-x-auto rounded-card border border-border bg-surface">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-2 text-xs font-mono uppercase text-text-muted">
                  <th className="p-4">Dimension</th>
                  <th className="p-4">Web Dev</th>
                  <th className="p-4">E-commerce</th>
                  <th className="p-4">WhatsApp &amp; AI</th>
                  <th className="p-4">Custom Software</th>
                  <th className="p-4">Cloud &amp; Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-small">
                {SERVICES_COMPARISON_STRIP.map((row) => (
                  <tr key={row.feature}>
                    <td className="p-4 font-heading font-semibold text-text">{row.feature}</td>
                    <td className="p-4 text-text-muted">{row.web}</td>
                    <td className="p-4 text-text-muted">{row.ecommerce}</td>
                    <td className="p-4 text-text-muted">{row.automation}</td>
                    <td className="p-4 text-text-muted">{row.software}</td>
                    <td className="p-4 text-text-muted">{row.cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DashboardPreview />
        </div>
      </Section>

      <CTABandSection />
    </div>
  );
}

