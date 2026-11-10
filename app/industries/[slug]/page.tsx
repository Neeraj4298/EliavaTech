import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRY_ITEMS } from "@/content/navigation";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export function generateStaticParams() {
  return INDUSTRY_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRY_ITEMS.find((item) => item.slug === slug);
  if (!industry) return { title: "Industry Not Found" };
  return {
    title: `${industry.title} Solutions`,
    description: industry.summary,
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = INDUSTRY_ITEMS.find((item) => item.slug === slug);

  if (!industry) {
    notFound();
  }

  return (
    <PlaceholderPageShell
      eyebrow={`Industry Bundle · ${industry.bundle.join(" + ")}`}
      title={`Digital Solutions for ${industry.title}`}
      description={industry.summary}
      primaryCta={{ label: "Book a Free Consultation", href: "/contact" }}
      secondaryCta={{ label: "All Industries", href: "/industries" }}
      cards={industry.bundle.map((item, idx) => ({
        title: item,
        subtitle: `Component 0${idx + 1}`,
        description: `Included in the ${industry.title} digital operations bundle.`,
        badge: "Included",
      }))}
    />
  );
}
