import type { Metadata } from "next";
import { BLOG_POSTS_PLACEHOLDER } from "@/content/navigation";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export const metadata: Metadata = {
  title: "Blog & Guides",
  description:
    "Practical guides on business websites, e-commerce, WhatsApp automation, and CRM software for Indian businesses.",
};

export default function BlogPage() {
  return (
    <PlaceholderPageShell
      eyebrow="Insights & Practical Guides"
      title="Clear answers on websites, automation and software."
      description="No hype or buzzwords—practical guides written to help business owners evaluate digital investments."
      cards={BLOG_POSTS_PLACEHOLDER.map((post) => ({
        title: post.title,
        subtitle: `${post.category} · ${post.readingTime}`,
        description: post.summary,
        href: post.href,
        badge: "Draft Article",
      }))}
    />
  );
}
