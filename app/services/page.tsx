import type { Metadata } from "next";
import { SERVICE_ITEMS } from "@/content/navigation";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, e-commerce, WhatsApp and AI automation, custom software, and managed cloud support.",
};

export default function ServicesPage() {
  return (
    <PlaceholderPageShell
      eyebrow="Five Service Lines"
      title="Websites, automation and software built around your operations."
      description="Start with a single high-impact project or combine website development, WhatsApp automation, and custom software into one connected system."
      cards={SERVICE_ITEMS.map((service) => ({
        title: service.title,
        subtitle: service.startingPrice,
        description: service.description,
        href: service.href,
        badge: "Service Detail",
      }))}
    />
  );
}
