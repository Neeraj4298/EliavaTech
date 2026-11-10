import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { WORK_PROJECTS } from "@/content/work";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ConceptProjectDemo } from "@/components/sections/ConceptProjectDemo";
import { CTABandSection } from "@/components/sections/home/CTABandSection";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return WORK_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = WORK_PROJECTS.find((item) => item.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return buildPageMetadata({
    title: `${project.title} (${project.label})`,
    description: project.summary,
    path: `/work/${project.slug}`,
    ogTag: `${project.label} · ${project.industryFilter}`,
  });
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = WORK_PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: project.title, path: `/work/${project.slug}` },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumb} />
      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <Link href="/work" className="inline-flex items-center gap-1.5 text-small text-text-muted hover:text-primary">
            <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
            <span>Back to All Work</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold" size="md" dot>{project.label}</Badge>
            <Badge variant="primary" size="md">{project.serviceFilter}</Badge>
            <Badge variant="default" size="md">{project.industryFilter}</Badge>
          </div>
          <SplitHeading text={project.title} as="h1" className="text-h1 block" />
          <p className="text-body text-text-muted">{project.summary}</p>
        </div>
      </Section>

      {/* Interactive Working Demo */}
      <Section>
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Interactive Working Demo · Concept Project"
            eyebrowVariant="gold"
            title="Test the workflow below."
            description="Interact with the live controls inside the browser frame to see how the system responds."
          />
          <ConceptProjectDemo demoType={project.demoType} demoUrl={project.demoUrl} />
        </div>
      </Section>

      {/* Challenge & Solution */}
      <Section className="border-y border-border/60 bg-surface/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card variant="default" className="space-y-3">
            <Badge variant="danger" size="sm" dot>The Challenge</Badge>
            <h2 className="text-h3">Operational bottleneck</h2>
            <p className="text-small text-text-muted leading-relaxed">{project.challenge}</p>
          </Card>

          <Card variant="elevated" className="space-y-3">
            <Badge variant="success" size="sm" dot>Our Solution</Badge>
            <h2 className="text-h3">Connected architecture</h2>
            <p className="text-small text-text-muted leading-relaxed">{project.solution}</p>
          </Card>
        </div>
      </Section>

      {/* Features, Tech & Capabilities Proven */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card variant="default" className="lg:col-span-6 space-y-4">
            <Badge variant="primary" size="sm">Key Features</Badge>
            <h2 className="text-h3">What is built into this demo</h2>
            <ul className="space-y-3 pt-2">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-small text-text">
                  <CheckCircle2 strokeWidth={1.5} className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="lg:col-span-6 space-y-6">
            <Card variant="default" className="space-y-4">
              <Badge variant="gold" size="sm">Capabilities Proven (Concept Project)</Badge>
              <h2 className="text-h3">Functional outcomes demonstrated</h2>
              <ul className="space-y-2.5">
                {project.capabilitiesProven.map((cap) => (
                  <li key={cap} className="flex items-start gap-2 text-small text-text-muted">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="default" className="space-y-3">
              <span className="font-mono text-xs uppercase text-text-muted">Tech Stack:</span>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => <Badge key={t} variant="default" size="md">{t}</Badge>)}
              </div>
              <div className="pt-2">
                <Link href="/contact">
                  <Button variant="primary" size="md" withArrow>Deploy Similar System for Your Business</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <CTABandSection />
    </div>
  );
}

