import { SERVICE_ITEMS, INDUSTRY_ITEMS, CONCEPT_PROJECTS } from "@/content/navigation";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export default function HomePage() {
  return (
    <PlaceholderPageShell
      eyebrow="Digital solutions for growing businesses"
      title="Building What's Next."
      description="We design websites, automate operations and build custom software for businesses that want to grow without a technical team."
      primaryCta={{ label: "Book a Free Consultation", href: "/contact" }}
      secondaryCta={{ label: "See Our Work", href: "/work" }}
      cards={[
        ...SERVICE_ITEMS.map((s) => ({
          title: s.title,
          subtitle: s.startingPrice,
          description: s.description,
          href: s.href,
          badge: "Service Line",
        })),
        {
          title: `${INDUSTRY_ITEMS.length} Industry Bundles`,
          subtitle: "Clinics · Real Estate · Retail & more",
          description:
            "Explore industry-specific bundles combining websites, WhatsApp automation, and custom workflows.",
          href: "/industries",
          badge: "Industries",
        },
        ...CONCEPT_PROJECTS.map((p) => ({
          title: p.title,
          subtitle: p.industry,
          description: p.summary,
          href: p.href,
          badge: "Concept project",
        })),
      ]}
    />
  );
}


