import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS_PLACEHOLDER } from "@/content/navigation";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export function generateStaticParams() {
  return BLOG_POSTS_PLACEHOLDER.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS_PLACEHOLDER.find((item) => item.slug === slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS_PLACEHOLDER.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <PlaceholderPageShell
      eyebrow={`${post.category} · ${post.readingTime}`}
      title={post.title}
      description={post.summary}
      primaryCta={{ label: "Book a Free Consultation", href: "/contact" }}
      secondaryCta={{ label: "Back to All Articles", href: "/blog" }}
    />
  );
}
