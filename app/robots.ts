import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Section 9 — Robots.txt (`app/robots.ts`):
 * Allows all public routes, disallows internal `/styleguide` and `/api/` routes,
 * and references `${SITE_URL}/sitemap.xml`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/styleguide", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
