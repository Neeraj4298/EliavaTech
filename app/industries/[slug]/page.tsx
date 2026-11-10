import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { INDUSTRIES_DATA } from "@/content/industries";
import { WORK_PROJECTS } from "@/content/work";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { CTABandSection } from "@/components/sections/home/CTABandSection";
import {
  buildBreadcrumbSchema,
  buildPageMetadata,
  buildServiceSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return INDUSTRIES_DATA.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRIES_DATA.find((item) => item.slug === slug);
  if (!industry) return { title: "Industry Not Found" };
  return buildPageMetadata({
    title: `${industry.title} Digital Solutions`,
    description: industry.summary,
    path: `/industries/${industry.slug}`,
    ogTag: `Industry Bundle · ${industry.title}`,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = INDUSTRIES_DATA.find((item) => item.slug === slug);
  if (!industry) notFound();

  const conceptProject = WORK_PROJECTS.find((p) => p.slug === industry.conceptProjectSlug) ?? WORK_PROJECTS[0];
  const schemas = [
    buildServiceSchema({
      name: `${industry.title} Digital Bundle`,
      description: industry.summary,
      path: `/industries/${industry.slug}`,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: industry.title, path: `/industries/${industry.slug}` },
    ]),
  ];

  return (
    <div className="flex flex-col">
      <JsonLd data={schemas} />
      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <Link href="/industries" className="inline-flex items-center gap-1.5 text-small text-text-muted hover:text-primary">
            <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
            <span>All Industries</span>
          </Link>
          <div><Badge variant="primary" size="md" dot>Industry Bundle · {industry.title}</Badge></div>
          <SplitHeading text={industry.headline} as="h1" className="text-h1 block" />
          <p className="text-body text-text-muted">{industry.summary}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/contact"><Button variant="primary" size="lg" withArrow>Book a Free Consultation</Button></Link>
            <Link href={`/work/${conceptProject.slug}`}><Button variant="secondary" size="lg">Inspect Concept Project</Button></Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Badge variant="danger" size="sm" dot>Typical Problems</Badge>
            <h2 className="text-h3">Bottlenecks in {industry.title}</h2>
            <div className="space-y-3 pt-2">
              {industry.typicalProblems.map((prob) => (
                <Card key={prob.title} variant="default" padding="sm" className="space-y-1.5">
                  <div className="flex items-center gap-2 font-heading font-semibold text-text">
                    <AlertTriangle strokeWidth={1.5} className="h-4 w-4 text-danger shrink-0" />
                    <span>{prob.title}</span>
                  </div>
                  <p className="text-xs text-text-muted">{prob.detail}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <Badge variant="success" size="sm" dot>Our Solution Bundle</Badge>
            <h2 className="text-h3">What we deploy for {industry.title}</h2>
            <div className="space-y-3 pt-2">
              {industry.bundle.map((b, idx) => (
                <Card key={b.item} variant="elevated" className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg font-semibold text-text flex items-center gap-2">
                      <CheckCircle2 strokeWidth={1.5} className="h-4 w-4 text-success" />
                      <span>{b.item}</span>
                    </span>
                    <span className="font-mono text-xs text-primary">0{idx + 1}</span>
                  </div>
                  <p className="text-small text-text-muted">{b.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border/60 bg-surface/40">
        <div className="space-y-8">
          <SectionHeading eyebrow="Example Workflow Diagram" title="How enquiries flow from website to WhatsApp to CRM." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {industry.workflowDiagram.map((node) => (
              <Card key={node.step} variant="default" className="flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <Badge variant="primary" size="sm">Stage {node.step}</Badge>
                  <p className="font-mono text-xs text-text-muted">Trigger: {node.trigger}</p>
                  <h3 className="font-heading text-lg font-semibold text-text">{node.action}</h3>
                </div>
                <div className="pt-3 border-t border-border/60">
                  <p className="text-xs font-medium text-success">Outcome: {node.outcome}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <Badge variant="gold" size="md" dot>Concept project</Badge>
            <h2 className="text-h2">{conceptProject.title}</h2>
            <p className="text-body text-text-muted">{conceptProject.summary}</p>
            <Link href={`/work/${conceptProject.slug}`} className="inline-block pt-2">
              <Button variant="primary" size="md" withArrow>Open Working Concept Demo</Button>
            </Link>
          </div>
          <div className="lg:col-span-7">
            <DashboardPreview
              initialTab={conceptProject.demoType === "clinic" ? "appointments" : conceptProject.demoType === "ecommerce" ? "orders" : "leads"}
              url={conceptProject.demoUrl}
              title="Concept project"
            />
          </div>
        </div>
      </Section>

      <CTABandSection />
    </div>
  );
}

