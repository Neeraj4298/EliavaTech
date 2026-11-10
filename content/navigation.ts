export interface ServiceNavItem {
  slug: string;
  title: string;
  shortTitle: string;
  href: string;
  description: string;
  startingPrice: string;
  icon: "Globe" | "ShoppingBag" | "MessageSquareCode" | "Boxes" | "CloudCog";
}

export interface IndustryNavItem {
  slug: string;
  title: string;
  href: string;
  summary: string;
  bundle: string[];
}

export interface ConceptProjectItem {
  slug: string;
  title: string;
  href: string;
  category: string;
  industry: string;
  summary: string;
}

export interface BlogPostPlaceholder {
  slug: string;
  title: string;
  href: string;
  category: string;
  readingTime: string;
  summary: string;
}

export const SERVICE_ITEMS: ServiceNavItem[] = [
  {
    slug: "web-development",
    title: "Web Development",
    shortTitle: "Websites",
    href: "/services/web-development",
    description:
      "Business sites, landing pages, booking sites and portfolios built with Next.js, SEO-ready and mobile-first.",
    startingPrice: "From ₹9,999",
    icon: "Globe",
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    shortTitle: "E-commerce",
    href: "/services/ecommerce",
    description:
      "Online stores, Razorpay payments, product catalogues, inventory sync, shipping and GST invoicing.",
    startingPrice: "From ₹34,999",
    icon: "ShoppingBag",
  },
  {
    slug: "whatsapp-ai-automation",
    title: "WhatsApp & AI Automation",
    shortTitle: "WhatsApp & AI",
    href: "/services/whatsapp-ai-automation",
    description:
      "WhatsApp Business API flows, instant lead capture, AI customer support, appointment reminders and n8n workflows.",
    startingPrice: "From ₹12,999",
    icon: "MessageSquareCode",
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    shortTitle: "Custom Software",
    href: "/services/custom-software",
    description:
      "Tailored CRM, inventory, billing, ERP modules, operational dashboards and client portals.",
    startingPrice: "From ₹49,999",
    icon: "Boxes",
  },
  {
    slug: "cloud-support",
    title: "Cloud & Support",
    shortTitle: "Cloud & Care",
    href: "/services/cloud-support",
    description:
      "Managed hosting oversight, automated backups, uptime monitoring, security updates and monthly support plans.",
    startingPrice: "From ₹1,499/mo",
    icon: "CloudCog",
  },
];

export const INDUSTRY_ITEMS: IndustryNavItem[] = [
  {
    slug: "clinics",
    title: "Clinics & Healthcare",
    href: "/industries/clinics",
    summary:
      "Patient booking websites, automated WhatsApp appointment reminders and digital intake records.",
    bundle: ["Website", "Appointment Booking", "WhatsApp Reminders"],
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    href: "/industries/real-estate",
    summary:
      "High-converting property listings, site-visit scheduling and automated lead follow-up CRM.",
    bundle: ["Property Listings", "Lead CRM", "WhatsApp Follow-ups"],
  },
  {
    slug: "restaurants",
    title: "Restaurants & Cafes",
    href: "/industries/restaurants",
    summary:
      "Digital menus, direct online ordering, table reservations and instant WhatsApp order alerts.",
    bundle: ["Website & Menu", "Online Ordering", "WhatsApp Alerts"],
  },
  {
    slug: "education",
    title: "Education & Coaching",
    href: "/industries/education",
    summary:
      "Admission enquiry portals, course catalogues, fee collection and automated counsellor workflows.",
    bundle: ["Course Website", "Enquiry Pipeline", "Automated Reminders"],
  },
  {
    slug: "retail",
    title: "Retail & D2C Stores",
    href: "/industries/retail",
    summary:
      "E-commerce storefronts with Razorpay checkout, inventory sync, GST billing and repeat-order nudges.",
    bundle: ["E-commerce Store", "Inventory Sync", "GST Invoicing"],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing & B2B",
    href: "/industries/manufacturing",
    summary:
      "Product specification catalogues, dealer enquiry portals, quotation workflows and order tracking.",
    bundle: ["B2B Catalogue", "RFQ Portal", "Order Dashboard"],
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    href: "/industries/professional-services",
    summary:
      "Credible authority websites, consultation booking, client intake automation and document portals.",
    bundle: ["Authority Website", "Consultation Booking", "Client Intake"],
  },
];

export const CONCEPT_PROJECTS: ConceptProjectItem[] = [
  {
    slug: "clinic-booking-system",
    title: "Clinic Booking System",
    href: "/work/clinic-booking-system",
    category: "Web + WhatsApp Automation",
    industry: "Clinics & Healthcare",
    summary:
      "Concept project demonstrating online slot booking, doctor schedule management and automated WhatsApp patient reminders.",
  },
  {
    slug: "retail-store-ecommerce",
    title: "Retail Store E-commerce",
    href: "/work/retail-store-ecommerce",
    category: "E-commerce + Custom Dashboard",
    industry: "Retail & D2C Stores",
    summary:
      "Concept project featuring a fast product catalogue, Razorpay checkout flow, GST invoice generation and inventory dashboard.",
  },
  {
    slug: "real-estate-lead-crm",
    title: "Real Estate Lead CRM",
    href: "/work/real-estate-lead-crm",
    category: "Custom Software + Automation",
    industry: "Real Estate",
    summary:
      "Concept project showcasing property listings, a visual enquiry pipeline and automated WhatsApp site-visit follow-ups.",
  },
];

export const BLOG_POSTS_PLACEHOLDER: BlogPostPlaceholder[] = [
  {
    slug: "how-much-does-a-business-website-cost-in-india",
    title: "How much does a business website cost in India?",
    href: "/blog/how-much-does-a-business-website-cost-in-india",
    category: "Web Development",
    readingTime: "6 min read",
    summary:
      "A transparent breakdown of starter websites, custom business portals and e-commerce builds for Indian SMBs.",
  },
  {
    slug: "whatsapp-automation-for-clinics-and-appointment-businesses",
    title: "WhatsApp automation for clinics and appointment-based businesses",
    href: "/blog/whatsapp-automation-for-clinics-and-appointment-businesses",
    category: "Automation",
    readingTime: "5 min read",
    summary:
      "How automated booking confirmations and reminders reduce no-shows without adding front-desk workload.",
  },
  {
    slug: "do-small-businesses-really-need-a-crm",
    title: "Do small businesses really need a CRM?",
    href: "/blog/do-small-businesses-really-need-a-crm",
    category: "Custom Software",
    readingTime: "5 min read",
    summary:
      "When spreadsheets stop working and how a lightweight custom CRM prevents lost enquiries.",
  },
  {
    slug: "website-or-instagram-page-what-does-a-local-business-need",
    title: "Website or Instagram page: what does a local business need?",
    href: "/blog/website-or-instagram-page-what-does-a-local-business-need",
    category: "Strategy",
    readingTime: "4 min read",
    summary:
      "Why social media and a search-visible website solve different problems in your customer journey.",
  },
];

export const MAIN_NAV_LINKS = [
  { label: "Services", href: "/services", hasMegaMenu: true },
  { label: "Industries", href: "/industries", hasMegaMenu: false },
  { label: "Work", href: "/work", hasMegaMenu: false },
  { label: "Pricing", href: "/pricing", hasMegaMenu: false },
  { label: "About", href: "/about", hasMegaMenu: false },
  { label: "Blog", href: "/blog", hasMegaMenu: false },
] as const;

export const LEGAL_NAV_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
] as const;

