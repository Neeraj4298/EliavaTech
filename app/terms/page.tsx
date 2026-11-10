import type { Metadata } from "next";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "EliavaTech Terms of Service placeholder for legal review.",
};

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
