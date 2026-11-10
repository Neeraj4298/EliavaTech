import type { Metadata } from "next";
import { INDUSTRY_ITEMS } from "@/content/navigation";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Digital bundles tailored for clinics, real estate, restaurants, education, retail, manufacturing, and professional services.",
};

export default function IndustriesPage() {
  return (
    <PlaceholderPageShell
      eyebrow="Seven SMB Sectors"
      title="Technology bundles designed for your industry."
      description="Every sector has distinct operational bottlenecks. Explore how we combine websites, WhatsApp automation, and custom workflows for your industry."
      cards={INDUSTRY_ITEMS.map((industry) => ({
        title: industry.title,
        subtitle: industry.bundle.join(" · "),
        description: industry.summary,
        href: industry.href,
        badge: "Industry Bundle",
      }))}
    />
  );
}
