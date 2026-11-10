import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://eliavatech.com"
).replace(/\/$/, "");

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogTag?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Section 9 — Next.js Metadata API helper:
 * Sets unique title, description, canonical URL (`alternates.canonical`),
 * Open Graph tags, Twitter card, and dynamic `next/og` image (`/og?...`).
 */
export function buildPageMetadata({
  title,
  description,
  path,
  ogTag = "Building What's Next.",
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  keywords,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
  const ogImageUrl = `${SITE_URL}/og?title=${encodeURIComponent(
    title
  )}&subtitle=${encodeURIComponent(description)}&tag=${encodeURIComponent(
    ogTag
  )}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | EliavaTech`,
      description,
      url: canonicalUrl,
      siteName: "EliavaTech",
      locale: "en_IN",
      type,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors,
          }
        : {}),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — EliavaTech`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EliavaTech`,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Section 9 — JSON-LD Structured Data Builders:
 * Organization, WebSite, Service, FAQPage, Article, and BreadcrumbList.
 * (LocalBusiness omitted until a physical city/address replaces the remote-first placeholder.)
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EliavaTech",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    slogan: "Building What's Next.",
    description:
      "Websites, software and AI automation that help growing businesses operate smarter.",
    areaServed: "IN",
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EliavaTech",
    url: SITE_URL,
    description:
      "Websites, software and AI automation that help growing businesses operate smarter.",
    publisher: {
      "@type": "Organization",
      name: "EliavaTech",
      url: SITE_URL,
    },
  };
}

export function buildServiceSchema(opts: {
  name: string;
  description: string;
  path: string;
  startingPrice?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    provider: {
      "@type": "Organization",
      name: "EliavaTech",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    ...(opts.startingPrice
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            description: opts.startingPrice,
          },
        }
      : {}),
  };
}

export function buildFaqSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  items: ReadonlyArray<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function buildArticleSchema(opts: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  category: string;
  wordCount: number;
}) {
  const url = `${SITE_URL}/blog/${opts.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    articleSection: opts.category,
    wordCount: opts.wordCount,
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      name: opts.author,
    },
    publisher: {
      "@type": "Organization",
      name: "EliavaTech",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    image: `${SITE_URL}/og?title=${encodeURIComponent(
      opts.title
    )}&subtitle=${encodeURIComponent(opts.description)}&tag=${encodeURIComponent(
      opts.category
    )}`,
  };
}
