import type { Metadata } from "next";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "EliavaTech Cookie Policy placeholder for legal review.",
};

export default function CookiesPage() {
  return (
    <PlaceholderPageShell
      eyebrow="Legal · [PLACEHOLDER for Legal Review]"
      title="Cookie Policy"
      description="This page explains how cookies and analytics (Google Analytics 4 with consent mode) are used only after visitor consent. Replace this placeholder text after qualified legal review before launch."
      primaryCta={{ label: "Contact Us", href: "/contact" }}
      secondaryCta={{ label: "Privacy Policy", href: "/privacy" }}
    />
  );
}
