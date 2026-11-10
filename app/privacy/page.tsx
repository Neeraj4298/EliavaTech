import type { Metadata } from "next";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "EliavaTech Privacy Policy placeholder for legal review.",
  path: "/privacy",
  ogTag: "Legal · Privacy Policy",
});

export default function PrivacyPage() {
  return (
    <PlaceholderPageShell
      eyebrow="Legal · [PLACEHOLDER for Legal Review]"
      title="Privacy Policy"
      description="This page outlines how EliavaTech collects, uses, and protects personal data in accordance with India's Digital Personal Data Protection Act (DPDP Act). Replace this placeholder text after qualified legal review before launch."
      primaryCta={{ label: "Contact Us", href: "/contact" }}
      secondaryCta={{ label: "Cookie Policy", href: "/cookies" }}
    />
  );
}
