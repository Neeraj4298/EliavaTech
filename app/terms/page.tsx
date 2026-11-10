import type { Metadata } from "next";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description: "EliavaTech Terms of Service placeholder for legal review.",
  path: "/terms",
  ogTag: "Legal · Terms of Service",
});

export default function TermsPage() {
  return (
    <PlaceholderPageShell
      eyebrow="Legal · [PLACEHOLDER for Legal Review]"
      title="Terms of Service"
      description="This page sets out the terms governing the use of the EliavaTech website and engagement of our services. Replace this placeholder text after qualified legal review before launch."
      primaryCta={{ label: "Contact Us", href: "/contact" }}
      secondaryCta={{ label: "Privacy Policy", href: "/privacy" }}
    />
  );
}
