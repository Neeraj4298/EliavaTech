import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONCEPT_PROJECTS } from "@/content/navigation";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export function generateStaticParams() {
  return CONCEPT_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = CONCEPT_PROJECTS.find((item) => item.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} (Concept Project)`,
    description: project.summary,
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = CONCEPT_PROJECTS.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const otherProjects = CONCEPT_PROJECTS.filter((item) => item.slug !== slug);

  return (
    <PlaceholderPageShell
      eyebrow={`Concept project · ${project.industry}`}
      title={project.title}
      description={project.summary}
      primaryCta={{ label: "Book a Free Consultation", href: "/contact" }}
      secondaryCta={{ label: "All Concept Projects", href: "/work" }}
      cards={otherProjects.map((other) => ({
        title: other.title,
        subtitle: other.category,
        description: other.summary,
        href: other.href,
        badge: "Concept project",
      }))}
    />
  );
}
