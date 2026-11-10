import type { Metadata } from "next";
import { getAllBlogPosts, getBlogCategories } from "@/lib/blog";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { BlogListingClient } from "@/components/blog/BlogListingClient";
import { CTABandSection } from "@/components/sections/home/CTABandSection";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog & Practical Guides",
  description:
    "Clear, practical guides on business website costs in India, WhatsApp automation for clinics, custom CRM software, and digital strategy for SMBs.",
  path: "/blog",
  ogTag: "Blog & Guides",
  keywords: [
    "website development company India",
    "business website cost India",
    "WhatsApp automation service",
    "custom CRM development India",
  ],
});

export default function BlogPage() {
  const posts = getAllBlogPosts().map((p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.category,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    author: p.author,
    authorRole: p.authorRole,
    draft: p.draft,
    keywords: p.keywords,
    readingTime: p.readingTime,
    wordCount: p.wordCount,
  }));
  const categories = getBlogCategories();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbSchema} />

      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="md" dot>
              Insights &amp; Practical Guides
            </Badge>
            <Badge variant="gold" size="md">
              4 Starter Drafts for Review
            </Badge>
          </div>
          <SplitHeading
            text="Clear answers on websites, automation and software."
            as="h1"
            className="text-h1 block"
          />
          <p className="text-body text-text-muted">
            Practical guides written to help Indian business owners evaluate
            website investments, WhatsApp automation, and custom CRM software.
          </p>
        </div>
      </Section>

      <Section>
        <BlogListingClient posts={posts} categories={categories} />
      </Section>

      <CTABandSection />
    </div>
  );
}

