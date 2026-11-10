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
    "Founding client launch rates designed to help growing Indian businesses get online and automate operations without enterprise agency overhead.",
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
      "Up to 5 responsive pages (light & dark themes)",
      "Mobile-first Next.js performance",
      "Contact form + WhatsApp click-to-chat",
      "Basic technical SEO, sitemap & Schema.org markup",
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
      "Google Analytics 4 with consent mode & conversion events",
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
      "Product catalogue with categories, variants & search",
      "Razorpay checkout (UPI, cards, netbanking, wallets)",
      "Order management & inventory tracking dashboard",
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
      "Interactive WhatsApp Business greeting & menu flow",
      "Automated lead capture into Google Sheets or CRM",
      "Appointment confirmation & 2-hour prior reminders",
      "n8n webhook orchestration & team alerts",
    ],
  },
  {
    id: "automation-ai-assistant",
    category: "Automation",
    billingMode: "one-time",
    name: "AI customer-support assistant",
    price: "₹14,999",
    unit: "from · setup",
    summary: "24/7 AI assistant grounded strictly in your services, pricing, and FAQs.",
    features: [
      "Floating website chat widget + full-width assistant",
      "Grounded system prompt (never invents prices or discounts)",
      "Captures visitor name, email, and requirement for quotes",
      "Automatic fallback to WhatsApp & booking calendar",
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
      "Custom PostgreSQL + Prisma relational database",
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
      "Hosting & deployment oversight",
      "Automated database & content backups",
      "24/7 uptime monitoring & incident alerts",
      "Monthly dependency & security updates",
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
      "Monthly Core Web Vitals & performance checks",
      "Form & webhook delivery verification",
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
      "Priority engineering & workflow support",
      "WhatsApp flow & AI assistant prompt refinements",
      "Monthly traffic, conversion & operations reporting",
    ],
  },
];
