import type { Metadata } from "next";
import { PlaceholderPageShell } from "@/components/sections/PlaceholderPageShell";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Founding client pricing for websites, e-commerce, WhatsApp automation, custom software, and monthly care plans.",
};

export default function PricingPage() {
  return (
    <PlaceholderPageShell
      eyebrow="Founding Client Pricing"
      title="Transparent launch pricing built for growing businesses."
      description="Prices start from the amounts shown and depend on scope. Third-party fees (WhatsApp API, payment gateways, hosting) are billed separately."
      cards={[
        {
          title: "Starter Website",
          subtitle: "From ₹9,999",
          description: "Up to 5 pages, responsive design, contact form, and foundational SEO.",
          href: "/contact",
          badge: "Websites",
        },
        {
          title: "Business Website",
          subtitle: "From ₹24,999",
          description: "Up to 10 pages, CMS, booking or enquiry integration, and analytics.",
          href: "/contact",
          badge: "Websites",
        },
        {
          title: "E-commerce Store",
          subtitle: "From ₹34,999",
          description: "Product catalogue, Razorpay checkout, order management, and GST invoices.",
          href: "/contact",
          badge: "Websites",
        },
        {
          title: "WhatsApp & AI Automation",
          subtitle: "From ₹12,999 setup",
          description: "WhatsApp Business flows, lead capture, and AI customer-support assistant (from ₹14,999).",
          href: "/contact",
          badge: "Automation",
        },
        {
          title: "Custom CRM or Dashboard",
          subtitle: "From ₹49,999",
          description: "Tailored internal tools, billing, or CRM modules quoted after discovery.",
          href: "/contact",
          badge: "Custom Software",
        },
        {
          title: "Monthly Care Plans",
          subtitle: "₹1,499 – ₹5,999/month",
          description: "Essential (₹1,499/mo), Growth (₹2,999/mo), and Pro (₹5,999/mo) care plans.",
          href: "/contact",
          badge: "Monthly Care",
        },
      ]}
    />
  );
}
