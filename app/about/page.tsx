import type { Metadata } from "next";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about EliavaTech's mission, heritage, values, and founding team.",
};

export default function AboutPage() {
  return (
    <PlaceholderPageShell
      eyebrow="About EliavaTech · Building What's Next."
      title="A steady foundation with forward motion."
      description="Eliava comes from the Hebrew Eliav, meaning My God is Father. We pair quiet craftsmanship and integrity with practical technology that helps growing businesses operate smarter."
      cards={[
        {
          title: "Founder 1 [PLACEHOLDER]",
          subtitle: "Co-founder & CEO",
          description: "Strategy, business discovery, and client relationships [PLACEHOLDER bio].",
          badge: "Co-Founder",
        },
        {
          title: "Founder 2 [PLACEHOLDER]",
          subtitle: "Co-founder & CTO",
          description: "Software architecture, engineering, and AI automation [PLACEHOLDER bio].",
          badge: "Co-Founder",
        },
        {
          title: "Founder 3 [PLACEHOLDER]",
          subtitle: "Co-founder & Head of Design & Product",
          description: "Brand systems, product experience, and interface craft [PLACEHOLDER bio].",
          badge: "Co-Founder",
        },
      ]}
    />
  );
}
