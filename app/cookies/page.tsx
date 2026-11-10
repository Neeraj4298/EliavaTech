import type { Metadata } from "next";
import { COOKIE_SECTIONS } from "@/content/legal";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy",
  description:
    "How EliavaTech uses strictly necessary storage and consent-gated Google Analytics 4 cookies.",
  path: "/cookies",
  ogTag: "Legal · Cookie Policy [PLACEHOLDER]",
});

export default function CookiesPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Cookie Policy", path: "/cookies" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <LegalPageLayout
        eyebrow="Legal · [PLACEHOLDER for Legal Review]"
        title="Cookie Policy"
        subtitle="How EliavaTech uses essential browser storage and consent-gated Google Analytics 4 cookies."
        sections={COOKIE_SECTIONS}
        showCookieControls
      />
    </>
  );
}

