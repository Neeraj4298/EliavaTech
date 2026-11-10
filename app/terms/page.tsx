import type { Metadata } from "next";
import { TERMS_SECTIONS } from "@/content/legal";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "Terms governing the use of the EliavaTech website, concept project demonstrations, and service engagements.",
  path: "/terms",
  ogTag: "Legal · Terms of Service [PLACEHOLDER]",
});

export default function TermsPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Terms of Service", path: "/terms" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <LegalPageLayout
        eyebrow="Legal · [PLACEHOLDER for Legal Review]"
        title="Terms of Service"
        subtitle="Terms governing the use of the EliavaTech website, concept project demonstrations, founding client pricing estimates, and client ownership."
        sections={TERMS_SECTIONS}
      />
    </>
  );
}

