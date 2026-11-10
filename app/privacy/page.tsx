import type { Metadata } from "next";
import { PRIVACY_SECTIONS } from "@/content/legal";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How EliavaTech collects, uses, and protects personal data in compliance with India's Digital Personal Data Protection Act (DPDP Act).",
  path: "/privacy",
  ogTag: "Legal · Privacy Policy [PLACEHOLDER]",
});

export default function PrivacyPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <LegalPageLayout
        eyebrow="Legal · [PLACEHOLDER for Legal Review]"
        title="Privacy Policy"
        subtitle="How EliavaTech collects, uses, stores, and protects personal data in accordance with India's Digital Personal Data Protection Act, 2023 (DPDP Act)."
        sections={PRIVACY_SECTIONS}
      />
    </>
  );
}

