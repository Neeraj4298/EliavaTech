import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/lib/blog";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildPageMetadata,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MdxRenderer } from "@/components/blog/MdxRenderer";
import { BlogAuthorCard, BlogSidebar } from "@/components/blog/BlogSidebar";
import { CTABandSection } from "@/components/sections/home/CTABandSection";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogTag: `${post.category} · ${post.readingTime}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author],
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedBlogPosts(post.slug, post.category, 2);
  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    category: post.category,
    wordCount: post.wordCount,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />

      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-small text-text-muted hover:text-primary"
          >
            <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
            <span>Back to All Guides</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="primary" size="md">
              {post.category}
            </Badge>
            {post.draft && (
              <Badge variant="gold" size="md" dot>
                Draft for Review
              </Badge>
            )}
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted">
              <Clock strokeWidth={1.5} className="h-3.5 w-3.5 text-primary" />
              <span>{post.readingTime}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted">
              <Calendar strokeWidth={1.5} className="h-3.5 w-3.5 text-primary" />
              <span>{post.publishedAt}</span>
            </span>
          </div>

          <SplitHeading text={post.title} as="h1" className="text-h1 block" />
          <p className="text-body text-text-muted">{post.excerpt}</p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <article className="lg:col-span-8 space-y-12">
            <MdxRenderer source={post.content} />
            <BlogAuthorCard author={post.author} authorRole={post.authorRole} />
          </article>

          <BlogSidebar toc={post.toc} relatedPosts={relatedPosts} />
        </div>
      </Section>

      <CTABandSection />
    </div>
  );
}

