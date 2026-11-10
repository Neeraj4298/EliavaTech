import type { Metadata } from "next";
import { ABOUT_CONTENT } from "@/content/about";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { ProcessTimelineSection } from "@/components/sections/home/ProcessTimelineSection";
import { CTABandSection } from "@/components/sections/home/CTABandSection";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us — Heritage, Mission & Founding Team",
  description:
    "Learn about EliavaTech's story, the meaning of Eliava, our four core values, and our three co-founders.",
  path: "/about",
  ogTag: "About EliavaTech · Building What's Next.",
});

export default function AboutPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumb} />
      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <Badge variant="primary" size="md" dot>{ABOUT_CONTENT.hero.eyebrow}</Badge>
          <SplitHeading text={ABOUT_CONTENT.hero.title} as="h1" className="text-h1 block" />
          <p className="text-body text-text-muted">{ABOUT_CONTENT.hero.subtext}</p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <Badge variant="default" size="sm">Mission &amp; Direction</Badge>
            <h2 className="text-h2">{ABOUT_CONTENT.story.heading}</h2>
            <div className="space-y-4 text-body text-text-muted">
              {ABOUT_CONTENT.story.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <Card variant="elevated" padding="lg" className="lg:col-span-5 space-y-4 border-gold/40">
            <Badge variant="gold" size="sm" dot>{ABOUT_CONTENT.nameMeaning.badge}</Badge>
            <h2 className="text-h3">{ABOUT_CONTENT.nameMeaning.heading}</h2>
            <p className="text-small text-text-muted leading-relaxed">{ABOUT_CONTENT.nameMeaning.body}</p>
            <p className="pt-2 border-t border-border/60 font-mono text-xs text-text-muted">
              Pronounced eh-lee-AH-vah · Building What&apos;s Next.
            </p>
          </Card>
        </div>
      </Section>

      <Section className="border-y border-border/60 bg-surface/40">
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Core Principles"
            title="Four values that govern our work."
            description="How we write code, price projects, and partner with business owners."
          />
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ABOUT_CONTENT.values.map((val, idx) => (
              <StaggerItem key={val.title} className="h-full">
                <Card variant="default" className="h-full space-y-3">
                  <span className="font-mono text-xs text-primary">0{idx + 1}</span>
                  <h3 className="font-heading text-xl font-semibold text-text">{val.title}</h3>
                  <p className="text-small text-text-muted leading-relaxed">{val.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      <Section>
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Founding Team · [PLACEHOLDER]"
            title="Three co-founders across strategy, engineering, and design."
            description="Replace placeholder founder names and bios before launch."
          />
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT_CONTENT.founders.map((founder) => (
              <StaggerItem key={founder.id} className="h-full">
                <Card variant="default" className="h-full space-y-4">
                  <div className="flex items-center justify-between">
                    <svg
                      viewBox="0 0 56 56"
                      className="h-14 w-14 rounded-full border border-border bg-surface-2 p-1"
                      role="img"
                      aria-label={`Illustrated avatar for ${founder.role}`}
                    >
                      <circle cx="28" cy="20" r="9" fill="var(--primary)" opacity="0.85" />
                      <path d="M12 46c2.5-8.5 9.5-13 16-13s13.5 4.5 16 13" fill="var(--text-muted)" opacity="0.45" />
                    </svg>
                    <Badge variant={founder.accent} size="sm">{founder.focus}</Badge>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-text">{founder.name}</h3>
                    <p className="font-mono text-xs text-primary mt-0.5">{founder.role}</p>
                  </div>
                  <p className="text-small text-text-muted leading-relaxed">{founder.bio}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      <ProcessTimelineSection />
      <CTABandSection />
    </div>
  );
}

