import type { Metadata } from "next";
import { CONCEPT_PROJECTS } from "@/content/navigation";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export const metadata: Metadata = {
  title: "Work & Concept Projects",
  description:
    "Explore working concept projects demonstrating clinic booking systems, retail e-commerce, and real estate CRM workflows.",
};

export default function WorkPage() {
  return (
    <PlaceholderPageShell
      eyebrow="Concept Projects · Proof of Capability"
      title="Working product demonstrations built for Indian businesses."
      description="Each project below is clearly labelled as a Concept project built to demonstrate our engineering, design, and automation capabilities."
      cards={CONCEPT_PROJECTS.map((project) => ({
        title: project.title,
        subtitle: `${project.industry} · ${project.category}`,
        description: project.summary,
        href: project.href,
        badge: "Concept project",
      }))}
    />
  );
}
