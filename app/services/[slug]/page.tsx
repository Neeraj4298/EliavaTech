import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowLeft, Users } from "lucide-react";
import { SERVICES_DATA } from "@/content/services";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { CTABandSection } from "@/components/sections/home/CTABandSection";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildPageMetadata,
  buildServiceSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return SERVICES_DATA.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA.find((item) => item.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return buildPageMetadata({
    title: `${service.title} (${service.startingPrice})`,
    description: service.outcome,
    path: `/services/${service.slug}`,
    ogTag: `${service.shortTitle} · ${service.startingPrice}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES_DATA.find((item) => item.slug === slug);
  if (!service) notFound();

  const schemas = [
    buildServiceSchema({
      name: service.title,
      description: service.outcome,
      path: `/services/${service.slug}`,
      startingPrice: service.startingPrice,
    }),
    buildFaqSchema(service.faqs),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.title, path: `/services/${service.slug}` },
    ]),
  ];

  return (
    <div className="flex flex-col">
      <JsonLd data={schemas} />
      <Section className="border-b border-border/60">
        <div className="space-y-5 max-w-3xl">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-small text-text-muted hover:text-primary">
            <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
            <span>All Services</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="md" dot>{service.title}</Badge>
            <Badge variant="gold" size="md">{service.startingPrice}</Badge>
          </div>
          <SplitHeading text={service.headline} as="h1" className="text-h1 block" />
          <p className="text-body text-text-muted">{service.outcome}</p>
          <div className="rounded-card border border-border bg-surface p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-primary uppercase">Starting Price</p>
              <p className="text-small text-text font-medium">{service.priceNote}</p>
            </div>
            <Link href="/contact"><Button variant="primary" size="md" withArrow>Book a Free Consultation</Button></Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card variant="default" className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <Users strokeWidth={1.5} className="h-5 w-5 text-primary" />
              <h2 className="text-h3">Who it is for</h2>
            </div>
            <ul className="space-y-3 pt-2">
              {service.whoItIsFor.map((p) => (
                <li key={p} className="flex items-start gap-2 text-small text-text-muted">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card variant="elevated" className="lg:col-span-7 space-y-4">
            <Badge variant="success" size="sm" dot>Checklist</Badge>
            <h2 className="text-h3">What is included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {service.includedChecklist.map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-input border border-border bg-surface p-3 text-small text-text">
                  <CheckCircle2 strokeWidth={1.5} className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section className="border-y border-border/60 bg-surface/40">
        <div className="space-y-8">
          <SectionHeading eyebrow="Process & Tech" title={`How we deliver ${service.title}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {service.process.map((p) => (
              <Card key={p.step} variant="default" className="space-y-2">
                <Badge variant="primary" size="sm">Step {p.step}</Badge>
                <h3 className="font-heading text-xl font-semibold text-text">{p.title}</h3>
                <p className="text-small text-text-muted">{p.detail}</p>
              </Card>
            ))}
          </div>
          <div className="rounded-card border border-border bg-surface p-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase text-text-muted">Tech Used:</span>
            <div className="flex flex-wrap gap-2">
              {service.techUsed.map((t) => <Badge key={t} variant="default" size="md">{t}</Badge>)}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="space-y-8">
          <SectionHeading eyebrow="Sample Deliverables" title="Tangible production outputs." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {service.sampleDeliverables.map((d) => (
              <Card key={d.title} variant="default" className="space-y-1.5">
                <span className="font-mono text-xs text-primary">{d.format}</span>
                <h3 className="font-heading text-lg font-semibold text-text">{d.title}</h3>
                <p className="text-small text-text-muted">{d.summary}</p>
              </Card>
            ))}
          </div>
          <DashboardPreview
            initialTab={service.slug === "ecommerce" ? "orders" : service.slug === "whatsapp-ai-automation" ? "appointments" : "leads"}
            url={`demo.eliavatech.com/${service.slug}`}
            title={service.shortTitle}
          />
        </div>
      </Section>

      <Section className="border-t border-border/60 bg-surface/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5"><SectionHeading eyebrow="FAQ" title={`Questions on ${service.title}`} /></div>
          <div className="lg:col-span-7"><FAQAccordion items={service.faqs} /></div>
        </div>
      </Section>

      <CTABandSection />
    </div>
  );
}

