import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_ITEMS } from "@/content/navigation";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export function generateStaticParams() {
  return SERVICE_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_ITEMS.find((item) => item.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICE_ITEMS.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const otherServices = SERVICE_ITEMS.filter((item) => item.slug !== slug);

  return (
    <PlaceholderPageShell
      eyebrow={`Service · ${service.startingPrice}`}
      title={service.title}
      description={service.description}
      primaryCta={{ label: "Book a Free Consultation", href: "/contact" }}
      secondaryCta={{ label: "View All Services", href: "/services" }}
      cards={otherServices.map((other) => ({
        title: other.title,
        subtitle: other.startingPrice,
        description: other.description,
        href: other.href,
        badge: "Related Service",
      }))}
    />
  );
}
