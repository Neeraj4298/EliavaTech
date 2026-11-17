export interface PricingTier {
  id: string;
  category: "Websites" | "Automation" | "Custom software" | "Monthly care plans";
  billingMode: "one-time" | "monthly";
  name: string;
  price: string;
  unit: string;
  summary: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export const PRICING_HEADER = {
  badge: "Founding client pricing · Available to the first 10 clients",
  title: "Honest, transparent launch pricing.",
  description:
    "Founding client launch rates designed to help growing Indian businesses get online and automate operations without big-agency costs.",
  disclaimer:
    "Prices start from the amounts shown and depend on scope. Third-party fees (WhatsApp API, payment gateways, hosting) are billed separately.",
} as const;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "website-starter",
    category: "Websites",
    billingMode: "one-time",
    name: "Starter",
    price: "₹9,999",
    unit: "from · one-time",
    summary: "Up to 5 pages, responsive, contact form, basic SEO.",
    features: [
      "Up to 5 responsive pages (light and dark themes)",
      "Fast, mobile-first performance",
      "Contact form and WhatsApp click-to-chat",
      "Basic SEO setup, sitemap and structured data",
    ],
  },
  {
    id: "website-business",
    category: "Websites",
    billingMode: "one-time",
    name: "Business",
    price: "₹24,999",
    unit: "from · one-time",
    summary: "Up to 10 pages, CMS, booking or enquiry integration, analytics.",
    features: [
      "Up to 10 custom pages with editable content sections",
      "CMS setup for blog posts or service updates",
      "Cal.com appointment booking or custom enquiry integration",
      "Google Analytics 4 with cookie consent and conversion tracking",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "website-ecommerce",
    category: "Websites",
    billingMode: "one-time",
    name: "E-commerce",
    price: "₹34,999",
    unit: "from · one-time",
    summary: "Catalogue, Razorpay, orders, GST invoices.",
    features: [
      "Product catalogue with categories, variants and search",
      "Razorpay checkout (UPI, cards, netbanking, wallets)",
      "Order management and inventory tracking dashboard",
      "Automated GST invoice PDF generation",
    ],
  },
  {
    id: "automation-whatsapp",
    category: "Automation",
    billingMode: "one-time",
    name: "WhatsApp automation",
    price: "₹12,999",
    unit: "from · setup",
    summary: "WhatsApp Business flows, lead capture, and appointment reminders.",
    features: [
      "Interactive WhatsApp Business greeting and menu flow",
      "Automated lead capture into Google Sheets or CRM",
      "Appointment confirmations and reminders sent two hours before appointments",
      "Workflow automation (n8n) and team alerts",
    ],
  },
  {
    id: "automation-ai-assistant",
    category: "Automation",
    billingMode: "one-time",
    name: "AI customer support",
    price: "₹14,999",
    unit: "from · setup",
    summary: "24/7 AI customer support that answers strictly from your services, pricing and FAQs.",
    features: [
      "Floating website chat widget and full-page assistant",
      "Answers only from your approved information (never invents prices or discounts)",
      "Captures visitor name, email, and requirement for quotes",
      "Automatic fallback to WhatsApp and booking calendar",
    ],
    badge: "AI Powered",
  },
  {
    id: "software-crm-dashboard",
    category: "Custom software",
    billingMode: "one-time",
    name: "CRM or business dashboard",
    price: "₹49,999",
    unit: "from · quoted after discovery",
    summary: "Tailored internal software built around your sales, inventory, or billing workflow.",
    features: [
      "Custom PostgreSQL database built for your business",
      "Role-based staff and admin views",
      "Lead pipeline, quotation, or inventory tracking modules",
      "Connected to your website forms and WhatsApp flows",
    ],
  },
  {
    id: "care-essential",
    category: "Monthly care plans",
    billingMode: "monthly",
    name: "Essential",
    price: "₹1,499",
    unit: "/month",
    summary: "Hosting oversight, backups, security updates.",
    features: [
      "Hosting and deployment oversight",
      "Automated database and content backups",
      "24/7 uptime monitoring and incident alerts",
      "Monthly software and security updates",
    ],
  },
  {
    id: "care-growth",
    category: "Monthly care plans",
    billingMode: "monthly",
    name: "Growth",
    price: "₹2,999",
    unit: "/month",
    summary: "Adds small edits and performance checks.",
    features: [
      "Everything in Essential (hosting oversight, backups, security)",
      "Small copy, image, and section edits included",
      "Monthly website speed and performance checks",
      "Checks that forms and alerts are delivered",
    ],
    highlighted: true,
    badge: "Recommended Care",
  },
  {
    id: "care-pro",
    category: "Monthly care plans",
    billingMode: "monthly",
    name: "Pro",
    price: "₹5,999",
    unit: "/month",
    summary: "Adds priority support and monthly reporting.",
    features: [
      "Everything in Growth",
      "Priority technical and workflow support",
      "WhatsApp flow and 24/7 AI customer support improvements",
      "Monthly traffic, conversion and operations reporting",
    ],
  },
];
