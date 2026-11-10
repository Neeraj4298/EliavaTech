export interface ServiceDetailData {
  slug: string;
  title: string;
  shortTitle: string;
  icon: "Globe" | "ShoppingBag" | "MessageSquareCode" | "Boxes" | "CloudCog";
  headline: string;
  outcome: string;
  startingPrice: string;
  priceNote: string;
  whoItIsFor: string[];
  includedChecklist: string[];
  process: Array<{ step: string; title: string; detail: string }>;
  techUsed: string[];
  sampleDeliverables: Array<{ title: string; format: string; summary: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

export const SERVICES_COMPARISON_STRIP = [
  {
    feature: "Primary Outcome",
    web: "Search visibility & enquiries",
    ecommerce: "Direct online sales & UPI",
    automation: "24/7 instant lead & booking flows",
    software: "Centralized internal operations",
    cloud: "Uptime, backups & security peace of mind",
  },
  {
    feature: "Typical Launch Timeline",
    web: "1–2 weeks",
    ecommerce: "2–4 weeks",
    automation: "1–2 weeks",
    software: "3–6 weeks",
    cloud: "48 hours onboarding",
  },
  {
    feature: "Starting Investment",
    web: "From ₹9,999",
    ecommerce: "From ₹34,999",
    automation: "From ₹12,999",
    software: "From ₹49,999",
    cloud: "From ₹1,499/mo",
  },
] as const;

export const SERVICES_DATA: ServiceDetailData[] = [
  {
    slug: "web-development",
    title: "Web Development",
    shortTitle: "Websites",
    icon: "Globe",
    headline: "Fast, search-ready websites that turn local searches into enquiries.",
    outcome:
      "Give your business a credible digital storefront that loads quickly on mobile, ranks on Google, and captures leads directly into your inbox or WhatsApp.",
    startingPrice: "From ₹9,999",
    priceNote: "Starter (up to 5 pages) from ₹9,999 · Business (up to 10 pages + CMS/booking) from ₹24,999",
    whoItIsFor: [
      "Local businesses, clinics, and firms relying only on word-of-mouth or Instagram.",
      "Growing companies whose current website is slow, outdated on mobile, or invisible on Google.",
      "Service providers who need online appointment booking or structured enquiry forms.",
      "Founders launching a new brand or product line that requires high-trust presentation.",
    ],
    includedChecklist: [
      "Custom mobile-first responsive design in light and dark themes",
      "Next.js App Router architecture for fast page loads",
      "Lead capture forms with spam protection and instant email/WhatsApp alerts",
      "On-page technical SEO (clean URLs, sitemap, Schema.org JSON-LD, Open Graph)",
      "Cal.com consultation booking or custom enquiry integration",
      "Google Analytics 4 setup with cookie consent compliance",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Clarify your top customer questions, target keywords, and primary conversion goal." },
      { step: "02", title: "Design", detail: "Structure page layouts, copy hierarchy, and mobile navigation for clarity." },
      { step: "03", title: "Build", detail: "Develop in Next.js and TypeScript, connect forms and booking, and test on real phones." },
      { step: "04", title: "Support", detail: "Connect your Cloudflare domain, submit to Google Search Console, and hand over cleanly." },
    ],
    techUsed: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Cloudflare DNS", "Cal.com", "Google Analytics 4"],
    sampleDeliverables: [
      { title: "5–10 Page Production Website", format: "Next.js Web App", summary: "Home, Services, About, Work/Catalogue, and Contact with booking." },
      { title: "Search & Metadata Suite", format: "SEO Configuration", summary: "Automated sitemap.xml, robots.txt, and LocalBusiness / Service JSON-LD." },
      { title: "Lead Notification Pipeline", format: "Webhook + Email", summary: "Every enquiry logged and forwarded to your team within seconds." },
    ],
    faqs: [
      {
        question: "What is the difference between the ₹9,999 Starter and ₹24,999 Business website?",
        answer:
          "Starter covers up to 5 responsive pages with a contact form and basic SEO. Business covers up to 10 pages, CMS content editing, booking integration, and analytics.",
      },
      {
        question: "Can you migrate our existing domain without downtime?",
        answer:
          "Yes. We configure Cloudflare DNS records and SSL certificates ahead of cutover so your website and Google Workspace email stay online.",
      },
    ],
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    shortTitle: "E-commerce",
    icon: "ShoppingBag",
    headline: "Online stores built for Indian checkout, UPI, and GST invoicing.",
    outcome:
      "Sell directly to customers across India without marketplace commissions—complete with product variants, Razorpay checkout, inventory sync, and WhatsApp order updates.",
    startingPrice: "From ₹34,999",
    priceNote: "Complete storefront with catalogue, Razorpay checkout, orders, and GST invoices",
    whoItIsFor: [
      "Retail shops and D2C brands taking manual orders over WhatsApp or Instagram DMs.",
      "Wholesalers and distributors who need a structured digital catalogue with bulk checkout.",
      "Sellers looking to reduce third-party marketplace commission fees with their own store.",
      "Businesses needing automated GST invoice PDFs and shipping status alerts.",
    ],
    includedChecklist: [
      "Searchable product catalogue with categories, variants, and stock tracking",
      "Razorpay integration supporting UPI, cards, netbanking, and wallets",
      "Automated GST-compliant invoice generation for every order",
      "Admin dashboard to manage products, pricing, coupons, and order fulfillment",
      "WhatsApp order confirmation and dispatch notifications",
      "Mobile-optimized cart and 2-step checkout flow",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Map your product structure, tax rules, shipping zones, and payment gateway." },
      { step: "02", title: "Design", detail: "Craft a clean storefront and friction-free mobile cart and checkout experience." },
      { step: "03", title: "Build", detail: "Integrate Razorpay webhooks, inventory database, GST billing, and admin controls." },
      { step: "04", title: "Support", detail: "Run live test transactions, train your dispatch team, and monitor checkout." },
    ],
    techUsed: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Razorpay", "WhatsApp API", "Cloudflare R2"],
    sampleDeliverables: [
      { title: "D2C Storefront & Cart", format: "Web Application", summary: "Fast product browsing, filters, and mobile UPI checkout." },
      { title: "Order & Inventory Admin", format: "Merchant Portal", summary: "Update stock levels, print GST invoices, and mark shipments." },
      { title: "Customer Order Alerts", format: "WhatsApp + Email", summary: "Automatic receipts and tracking links sent on payment capture." },
    ],
    faqs: [
      {
        question: "Which payment methods are supported at checkout?",
        answer:
          "Through Razorpay, your customers can pay via UPI (GPay, PhonePe, Paytm), credit/debit cards, netbanking, and wallets.",
      },
      {
        question: "Are payment gateway charges included in the setup price?",
        answer:
          "Our setup fee covers development and integration. Razorpay's standard per-transaction fee is billed directly by Razorpay.",
      },
    ],
  },
  {
    slug: "whatsapp-ai-automation",
    title: "WhatsApp & AI Automation",
    shortTitle: "WhatsApp & AI",
    icon: "MessageSquareCode",
    headline: "Instant lead capture, appointment reminders, and AI customer support.",
    outcome:
      "Respond to every customer message in seconds, qualify leads automatically, send timely appointment reminders, and sync conversations straight to your CRM or Google Sheet.",
    startingPrice: "From ₹12,999",
    priceNote: "WhatsApp automation from ₹12,999 setup · AI customer-support assistant from ₹14,999 setup",
    whoItIsFor: [
      "Clinics, salons, and consultants losing bookings to missed calls or forgotten appointments.",
      "Sales teams spending hours replying to the same pricing and brochure requests.",
      "Businesses running ads that need instant WhatsApp follow-up while buyer intent is high.",
      "Operations teams manually copying lead details from chat into spreadsheets.",
    ],
    includedChecklist: [
      "Structured WhatsApp Business greeting, menu, and lead-qualification flows",
      "AI support assistant grounded strictly in your approved services, pricing, and FAQs",
      "Automated appointment booking confirmations and 2-hour prior reminders",
      "n8n workflow automation syncing leads to Google Sheets, PostgreSQL, or CRM",
      "Instant human handover alerts on WhatsApp or Slack when a complex query arrives",
      "Rate limiting, guardrails, and conversation logging",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Audit your top 20 incoming customer questions and current follow-up delays." },
      { step: "02", title: "Design", detail: "Script clear conversation trees, AI system instructions, and escalation rules." },
      { step: "03", title: "Build", detail: "Connect WhatsApp API / webhooks, Gemini AI routes, and n8n sheet/CRM sync." },
      { step: "04", title: "Support", detail: "Monitor real transcripts and refine responses as your offerings evolve." },
    ],
    techUsed: ["WhatsApp Business API", "n8n", "Gemini API", "Next.js API Routes", "PostgreSQL", "Google Sheets API"],
    sampleDeliverables: [
      { title: "Automated Booking & Lead Flow", format: "WhatsApp Flow", summary: "24/7 interactive menu that collects name, need, and preferred slot." },
      { title: "Grounded AI Support Assistant", format: "Web + Chat Widget", summary: "Answers FAQs accurately using only your verified business data." },
      { title: "n8n Lead Router", format: "Automation Pipeline", summary: "Pushes qualified leads to your sheet/CRM and alerts your team." },
    ],
    faqs: [
      {
        question: "Will the AI assistant ever invent discounts or fake information?",
        answer:
          "No. We lock the assistant with strict system instructions grounded only in your written services and pricing.",
      },
      {
        question: "How are WhatsApp API conversation charges billed?",
        answer:
          "Meta's official WhatsApp Business API charges per conversation are billed directly by your WhatsApp BSP at actuals.",
      },
    ],
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    shortTitle: "Custom Software",
    icon: "Boxes",
    headline: "Tailored CRM, billing, inventory, and internal dashboards built around your team.",
    outcome:
      "Replace fragile spreadsheets and rigid off-the-shelf software with a fast web application designed around your exact permissions, stages, and reporting needs.",
    startingPrice: "From ₹49,999",
    priceNote: "CRM or business dashboard from ₹49,999 (quoted after discovery)",
    whoItIsFor: [
      "Growing teams outgrowing Excel/Google Sheets for lead tracking, quotations, or inventory.",
      "Businesses paying per-seat subscription fees for bloated SaaS tools their staff barely use.",
      "Operations managers who need role-based dashboards for sales reps, dispatchers, or branch staff.",
      "Companies wanting a unified portal connecting their website enquiries, WhatsApp, and billing.",
    ],
    includedChecklist: [
      "Custom relational database schema in PostgreSQL with Prisma ORM",
      "Role-based authentication and permissions for admins, staff, and partners",
      "Interactive pipeline boards, data tables, filters, and CSV/PDF exports",
      "REST/webhook integrations with WhatsApp, Razorpay, and email notifications",
      "Mobile-responsive interface so field staff can update records from phones",
      "Complete source-code ownership and documentation",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Shadow your current spreadsheet/manual process and define user roles." },
      { step: "02", title: "Design", detail: "Prototype the database schema and key dashboard screens for staff sign-off." },
      { step: "03", title: "Build", detail: "Develop modules in weekly sprints so your team can test with sample records." },
      { step: "04", title: "Support", detail: "Migrate existing CSV data, train staff, and provide ongoing feature iterations." },
    ],
    techUsed: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Auth.js", "Tailwind CSS", "Cloudflare R2"],
    sampleDeliverables: [
      { title: "Custom Lead & Sales CRM", format: "Web Application", summary: "Kanban pipeline, follow-up reminders, and conversion reporting." },
      { title: "Inventory & Quotation Module", format: "Operations Portal", summary: "SKU tracking, multi-branch stock levels, and PDF quote generation." },
      { title: "Database & API Layer", format: "PostgreSQL + Prisma", summary: "Clean, documented relational database hosted in your cloud account." },
    ],
    faqs: [
      {
        question: "Do you charge per-user monthly license fees for custom software?",
        answer:
          "No. Unlike per-seat SaaS tools, you pay for the build and own the application. Your only ongoing cost is cloud database/hosting.",
      },
      {
        question: "Can you import our existing Excel or Google Sheets data?",
        answer:
          "Yes. We clean, validate, and migrate your existing customer, SKU, or order spreadsheets into PostgreSQL before launch.",
      },
    ],
  },
  {
    slug: "cloud-support",
    title: "Cloud & Support",
    shortTitle: "Cloud & Care",
    icon: "CloudCog",
    headline: "Managed hosting oversight, backups, monitoring, and monthly engineering care.",
    outcome:
      "Keep your website, database, and automation workflows fast, secure, and backed up every day without hiring an in-house DevOps or IT engineer.",
    startingPrice: "From ₹1,499/mo",
    priceNote: "Essential ₹1,499/mo · Growth ₹2,999/mo · Pro ₹5,999/mo",
    whoItIsFor: [
      "Business owners who want peace of mind that their site, SSL, and database are monitored 24/7.",
      "Teams that need regular copy, banner, pricing, or page updates without hiring a developer.",
      "Companies running WhatsApp or CRM workflows that require periodic tuning and health checks.",
      "Organisations setting up professional Google Workspace email with SPF, DKIM, and DMARC.",
    ],
    includedChecklist: [
      "24/7 uptime monitoring with instant incident alerts and recovery",
      "Automated daily/weekly PostgreSQL database and asset backups",
      "Cloudflare DNS, SSL certificate, and firewall rule management",
      "Google Workspace email authentication (MX, SPF, DKIM, DMARC)",
      "Monthly framework, dependency, and security patch updates",
      "Dedicated monthly hours for content edits and Core Web Vitals checks (Growth & Pro)",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Audit your domain registrar, DNS records, hosting environment, and backup status." },
      { step: "02", title: "Design", detail: "Configure Cloudflare DNS, uptime monitors, backup schedules, and security headers." },
      { step: "03", title: "Build", detail: "Apply performance fixes, authenticate business email, and verify recovery procedures." },
      { step: "04", title: "Support", detail: "Deliver monthly health checks and complete requested edits within 1 business day." },
    ],
    techUsed: ["Cloudflare", "Vercel", "Neon / Supabase PostgreSQL", "Google Workspace", "Uptime Monitoring", "GitHub Actions"],
    sampleDeliverables: [
      { title: "Cloudflare & DNS Hardening", format: "Infrastructure Setup", summary: "SSL, DNS-only routing, redirect rules, and email authentication." },
      { title: "Automated Backup & Uptime Suite", format: "Monitoring Pipeline", summary: "24/7 health checks and verified database restore points." },
      { title: "Monthly Health & Performance Report", format: "Executive Summary", summary: "Core Web Vitals, uptime log, security updates, and completed edits." },
    ],
    faqs: [
      {
        question: "Can we cancel or switch monthly care plans at any time?",
        answer:
          "Yes. Care plans are billed monthly with no long-term lock-in, and you can upgrade or downgrade as your needs change.",
      },
      {
        question: "Do you support websites that were not originally built by EliavaTech?",
        answer:
          "If your site is built on a modern React/Next.js stack, we can audit the codebase and onboard it onto a care plan.",
      },
    ],
  },
];




