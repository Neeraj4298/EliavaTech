export interface ConceptProjectDetail {
  slug: string;
  title: string;
  label: "Concept project";
  serviceFilter: "Web Development" | "E-commerce" | "WhatsApp & AI Automation" | "Custom Software";
  industryFilter: "Clinics & Healthcare" | "Retail & D2C Stores" | "Real Estate";
  summary: string;
  challenge: string;
  solution: string;
  features: string[];
  tech: string[];
  capabilitiesProven: string[];
  demoUrl: string;
  demoType: "clinic" | "ecommerce" | "crm";
}

export const WORK_PROJECTS: ConceptProjectDetail[] = [
  {
    slug: "clinic-booking-system",
    title: "Clinic booking system",
    label: "Concept project",
    serviceFilter: "WhatsApp & AI Automation",
    industryFilter: "Clinics & Healthcare",
    summary:
      "Website, appointment booking, and automated WhatsApp reminders designed for multi-doctor clinics.",
    challenge:
      "Local clinics lose patient enquiries when phone lines are busy during peak consultation hours, and front-desk staff spend hours manually calling patients to confirm next-day appointments.",
    solution:
      "A mobile-first clinic website with real-time doctor slot selection connected to an automated WhatsApp confirmation and 2-hour prior reminder workflow.",
    features: [
      "Doctor & department slot picker with instant availability check",
      "Automated WhatsApp booking confirmation with clinic location pin",
      "Scheduled 2-hour prior WhatsApp reminder with 1-tap reschedule option",
      "Front-desk day-sheet dashboard showing confirmed, pending, and walk-in patients",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "WhatsApp Business API", "n8n"],
    capabilitiesProven: [
      "End-to-end slot reservation flow without phone calls",
      "Automated WhatsApp webhook payload generation for confirmations and reminders",
      "Structured doctor schedule and patient intake state management",
    ],
    demoUrl: "demo.eliavatech.com/clinic-booking-system",
    demoType: "clinic",
  },
  {
    slug: "retail-store-ecommerce",
    title: "Retail store e-commerce",
    label: "Concept project",
    serviceFilter: "E-commerce",
    industryFilter: "Retail & D2C Stores",
    summary:
      "Product catalogue, Razorpay checkout, GST invoice generation, and live inventory dashboard.",
    challenge:
      "Growing retail stores taking orders over Instagram and WhatsApp struggle with stock mismatches, manual UPI screenshot verification, and writing GST bills by hand.",
    solution:
      "A fast D2C storefront with variant-level inventory tracking, instant Razorpay UPI/card checkout, automated GST PDF invoices, and a merchant fulfillment dashboard.",
    features: [
      "Category & variant filterable catalogue with real-time stock badges",
      "Razorpay checkout supporting UPI, cards, netbanking, and wallets",
      "Automated GST invoice calculation (CGST/SGST/IGST) with HSN codes",
      "Merchant inventory and order status dashboard with low-stock alerts",
    ],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Razorpay", "Tailwind CSS"],
    capabilitiesProven: [
      "Interactive cart, variant selection, and GST tax breakdown calculation",
      "Simulated Razorpay order creation and payment verification flow",
      "Real-time inventory deduction and merchant order status toggling",
    ],
    demoUrl: "demo.eliavatech.com/retail-store-ecommerce",
    demoType: "ecommerce",
  },
  {
    slug: "real-estate-lead-crm",
    title: "Real estate lead CRM",
    label: "Concept project",
    serviceFilter: "Custom Software",
    industryFilter: "Real Estate",
    summary:
      "Property listings, visual enquiry pipeline, site-visit scheduling, and automated WhatsApp follow-ups.",
    challenge:
      "Property agencies and builders collect enquiries from portals, website forms, and WhatsApp, but lose high-intent buyers when follow-ups and site-visit reminders live in scattered spreadsheets.",
    solution:
      "A unified property listing portal paired with a Kanban-style lead CRM that automatically assigns incoming enquiries, schedules site visits, and triggers WhatsApp brochure & follow-up messages.",
    features: [
      "Searchable property listings with configuration, floor plan, and locality filters",
      "4-stage enquiry pipeline (New Enquiry → Brochure Sent → Site Visit Scheduled → Negotiation)",
      "Automated WhatsApp brochure delivery on form submission",
      "Agent follow-up task queue with overdue lead highlights",
    ],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "n8n", "WhatsApp Business API"],
    capabilitiesProven: [
      "Interactive stage transitions across the 4-stage real estate sales pipeline",
      "Automated WhatsApp brochure and site-visit confirmation trigger preview",
      "Filterable property inventory linked directly to buyer budget ranges",
    ],
    demoUrl: "demo.eliavatech.com/real-estate-lead-crm",
    demoType: "crm",
  },
];
