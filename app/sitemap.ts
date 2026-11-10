import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { SERVICE_ITEMS, INDUSTRY_ITEMS, CONCEPT_PROJECTS } from "@/content/navigation";
import { getAllBlogPosts } from "@/lib/blog";

/**
 * Section 9 — Dynamic XML Sitemap (`app/sitemap.ts`):
 * Lists all static marketing/legal pages, 5 services, 7 industries,
 * 3 concept projects, and all MDX blog posts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/industries", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/work", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
  ].map((item) => ({
    url: `${SITE_URL}${item.path}`,
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  const serviceRoutes = SERVICE_ITEMS.map((s) => ({
    url: `${SITE_URL}${s.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const industryRoutes = INDUSTRY_ITEMS.map((ind) => ({
    url: `${SITE_URL}${ind.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const workRoutes = CONCEPT_PROJECTS.map((proj) => ({
    url: `${SITE_URL}${proj.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const blogRoutes = getAllBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...workRoutes,
    ...blogRoutes,
  ];
}
