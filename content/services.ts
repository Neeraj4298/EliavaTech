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
    web: "Search visibility and enquiries",
    ecommerce: "Direct online sales with UPI payments",
    automation: "24/7 instant lead and booking flows",
    software: "Centralised internal operations",
    cloud: "Uptime, backups and security, with peace of mind",
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
      "Give your business a trusted online presence that loads quickly on mobile, appears on Google, and sends leads straight to your inbox or WhatsApp.",
    startingPrice: "From ₹9,999",
    priceNote: "Starter (up to 5 pages) from ₹9,999 · Business (up to 10 pages + CMS/booking) from ₹24,999",
    whoItIsFor: [
      "Local businesses, clinics, and firms relying only on word-of-mouth or Instagram.",
      "Growing companies whose current website is slow, outdated on mobile, or invisible on Google.",
      "Service providers who need online appointment booking or structured enquiry forms.",
      "Founders launching a new brand or product line who need a trustworthy first impression.",
    ],
    includedChecklist: [
      "Custom mobile-first responsive design in light and dark themes",
      "Modern Next.js build for fast page loads",
      "Lead capture forms with spam protection and instant email or WhatsApp alerts",
      "On-page SEO setup (clean URLs, sitemap, structured data, social sharing previews)",
      "Google Calendar & Google Meet consultation booking or custom enquiry integration",
      "Google Analytics 4 setup with cookie consent",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Clarify your top customer questions, search keywords and main goal for the site." },
      { step: "02", title: "Design", detail: "Plan page layouts, content order and mobile navigation so everything is easy to find." },
      { step: "03", title: "Build", detail: "Build the site, connect forms and booking, and test on real phones." },
      { step: "04", title: "Support", detail: "Connect your domain, submit the site to Google Search Console and hand everything over." },
    ],
    techUsed: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Cloudflare DNS", "Google Calendar API", "Google Analytics 4"],
    sampleDeliverables: [
      { title: "5 to 10 Page Business Website", format: "Next.js Web App", summary: "Home, Services, About, Work or Catalogue, and Contact pages with booking." },
      { title: "Search and Metadata Setup", format: "SEO Setup", summary: "Sitemap, robots.txt and local business structured data." },
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
          "Yes. We set up your DNS records and SSL certificate before switching over, so your website and Google Workspace email stay online.",
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
      "Sell directly to customers across India without marketplace commissions. Includes product variants, Razorpay checkout, inventory sync and WhatsApp order updates.",
    startingPrice: "From ₹34,999",
    priceNote: "Complete storefront with catalogue, Razorpay checkout, orders, and GST invoices",
    whoItIsFor: [
      "Retail shops and D2C brands taking manual orders over WhatsApp or Instagram DMs.",
      "Wholesalers and distributors who need a structured digital catalogue with bulk checkout.",
      "Sellers who want to cut marketplace commission fees with their own store.",
      "Businesses that need automatic GST invoices and shipping alerts.",
    ],
    includedChecklist: [
      "Searchable product catalogue with categories, variants, and stock tracking",
      "Razorpay integration supporting UPI, cards, netbanking, and wallets",
      "Automated GST-compliant invoice generation for every order",
      "Admin dashboard to manage products, pricing, coupons, and order fulfilment",
      "WhatsApp order confirmation and dispatch notifications",
      "Mobile-friendly cart and simple 2-step checkout",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Map your product structure, tax rules, shipping zones, and payment gateway." },
      { step: "02", title: "Design", detail: "Design a clean storefront with an easy mobile cart and checkout." },
      { step: "03", title: "Build", detail: "Set up Razorpay payments, stock tracking, GST billing and admin controls." },
      { step: "04", title: "Support", detail: "Run live test transactions, train your dispatch team, and monitor checkout." },
    ],
    techUsed: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Razorpay", "WhatsApp API", "Cloudflare R2"],
    sampleDeliverables: [
      { title: "D2C Storefront and Cart", format: "Web Application", summary: "Fast product browsing, filters, and mobile UPI checkout." },
      { title: "Order and Inventory Admin", format: "Merchant Portal", summary: "Update stock levels, print GST invoices, and mark shipments." },
      { title: "Customer Order Alerts", format: "WhatsApp + Email", summary: "Receipts and tracking links sent automatically after payment." },
    ],
    faqs: [
      {
        question: "Which payment methods are supported at checkout?",
        answer:
          "Through Razorpay, your customers can pay via UPI (GPay, PhonePe, Paytm), credit and debit cards, netbanking, and wallets.",
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
    headline: "Instant lead capture, appointment reminders, and 24/7 AI customer support.",
    outcome:
      "Reply to every customer message in seconds, qualify leads automatically, send appointment reminders and sync chats to your CRM or Google Sheet.",
    startingPrice: "From ₹12,999",
    priceNote: "WhatsApp automation from ₹12,999 setup · 24/7 AI customer support from ₹14,999 setup",
    whoItIsFor: [
      "Clinics, salons, and consultants losing bookings to missed calls or forgotten appointments.",
      "Sales teams spending hours replying to the same pricing and brochure requests.",
      "Businesses running ads that need instant WhatsApp follow-up while buyer intent is high.",
      "Operations teams manually copying lead details from chat into spreadsheets.",
    ],
    includedChecklist: [
      "Structured WhatsApp Business greeting, menu, and lead-qualification flows",
      "24/7 AI customer support that answers only from your approved services, pricing and FAQs",
      "Appointment confirmations and reminders sent two hours before appointments",
      "Automated workflows (n8n) that send leads to Google Sheets or your CRM",
      "Instant alerts to your team on WhatsApp or Slack when a customer needs a person",
      "Safety limits and saved conversation logs",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Review your top 20 customer questions and where follow-ups get delayed." },
      { step: "02", title: "Design", detail: "Write clear conversation flows, AI instructions and rules for passing chats to your team." },
      { step: "03", title: "Build", detail: "Connect WhatsApp, the AI assistant, and your Google Sheet or CRM." },
      { step: "04", title: "Support", detail: "Review real conversations and improve replies as your offerings change." },
    ],
    techUsed: ["WhatsApp Business API", "n8n", "Gemini API", "Next.js API Routes", "PostgreSQL", "Google Sheets API"],
    sampleDeliverables: [
      { title: "Automated Booking and Lead Flow", format: "WhatsApp Flow", summary: "24/7 interactive menu that collects name, need, and preferred slot." },
      { title: "24/7 AI Customer Support", format: "Website Chat Widget", summary: "Answers FAQs using only your verified business details." },
      { title: "n8n Lead Router", format: "Automation Pipeline", summary: "Sends qualified leads to your sheet or CRM and alerts your team." },
    ],
    faqs: [
      {
        question: "Will the AI customer support ever invent discounts or false information?",
        answer:
          "No. We restrict it to your written services and pricing, with strict instructions on what it may say.",
      },
      {
        question: "How are WhatsApp API conversation charges billed?",
        answer:
          "Meta charges for WhatsApp Business API conversations. These charges are billed directly by your WhatsApp provider at actual cost.",
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
      "Replace messy spreadsheets and rigid ready-made software with a fast web application built around your team's roles, stages and reports.",
    startingPrice: "From ₹49,999",
    priceNote: "CRM or business dashboard from ₹49,999 (quoted after discovery)",
    whoItIsFor: [
      "Growing teams that have outgrown Excel or Google Sheets for lead tracking, quotations or inventory.",
      "Businesses paying per-user fees for bulky software their staff barely use.",
      "Operations managers who need separate dashboards for sales reps, dispatchers or branch staff.",
      "Companies that want one portal connecting their website enquiries, WhatsApp and billing.",
    ],
    includedChecklist: [
      "A custom PostgreSQL database designed for your business",
      "Secure logins and permissions for admins, staff and partners",
      "Pipeline boards, data tables, filters and CSV or PDF exports",
      "Connections to WhatsApp, Razorpay and email notifications",
      "Mobile-responsive interface so field staff can update records from phones",
      "Full source-code ownership and documentation",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Study your current spreadsheet or manual process and define user roles." },
      { step: "02", title: "Design", detail: "Prototype the key screens and data layout for your team's approval." },
      { step: "03", title: "Build", detail: "Build in weekly stages so your team can test with sample records." },
      { step: "04", title: "Support", detail: "Move your existing data across, train staff and add new features over time." },
    ],
    techUsed: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Auth.js", "Tailwind CSS", "Cloudflare R2"],
    sampleDeliverables: [
      { title: "Custom Lead and Sales CRM", format: "Web Application", summary: "Kanban pipeline, follow-up reminders, and conversion reporting." },
      { title: "Inventory and Quotation Module", format: "Operations Portal", summary: "SKU tracking, multi-branch stock levels, and PDF quote generation." },
      { title: "Database & API Layer", format: "PostgreSQL + Prisma", summary: "A clean, documented database hosted in your own cloud account." },
    ],
    faqs: [
      {
        question: "Do you charge per-user monthly license fees for custom software?",
        answer:
          "No. Unlike per-user software subscriptions, you pay for the build and own the application. Your only ongoing cost is cloud hosting.",
      },
      {
        question: "Can you import our existing Excel or Google Sheets data?",
        answer:
          "Yes. We clean, check and move your existing customer, product or order spreadsheets into the new database before launch.",
      },
    ],
  },
  {
    slug: "cloud-support",
    title: "Cloud & Support",
    shortTitle: "Cloud & Care",
    icon: "CloudCog",
    headline: "Hosting oversight, backups, monitoring, and monthly technical care.",
    outcome:
      "Keep your website, database, and automation workflows fast, secure, and backed up every day without hiring an in-house IT engineer.",
    startingPrice: "From ₹1,499/mo",
    priceNote: "Essential ₹1,499/mo · Growth ₹2,999/mo · Pro ₹5,999/mo",
    whoItIsFor: [
      "Business owners who want peace of mind that their website, security certificate and database are monitored 24/7.",
      "Teams that need regular copy, banner, pricing, or page updates without hiring a developer.",
      "Companies running WhatsApp or CRM workflows that require periodic tuning and health checks.",
      "Organisations setting up professional Google Workspace email that is configured correctly.",
    ],
    includedChecklist: [
      "24/7 uptime monitoring with instant incident alerts and recovery",
      "Automated daily or weekly database and file backups",
      "Cloudflare DNS, SSL certificate, and firewall rule management",
      "Google Workspace email authentication (MX, SPF, DKIM, DMARC)",
      "Monthly software and security updates",
      "Monthly hours for content edits and website speed checks (Growth and Pro plans)",
    ],
    process: [
      { step: "01", title: "Discover", detail: "Review your domain, DNS records, hosting and backup status." },
      { step: "02", title: "Design", detail: "Set up Cloudflare DNS, uptime monitors, backup schedules and security settings." },
      { step: "03", title: "Build", detail: "Apply speed fixes, set up email authentication and test that recovery works." },
      { step: "04", title: "Support", detail: "Deliver monthly health checks and complete requested edits within 1 business day." },
    ],
    techUsed: ["Cloudflare", "Vercel", "Neon / Supabase PostgreSQL", "Google Workspace", "Uptime Monitoring", "GitHub Actions"],
    sampleDeliverables: [
      { title: "Cloudflare and DNS Security", format: "Infrastructure Setup", summary: "SSL, DNS setup, redirect rules and email authentication." },
      { title: "Automated Backup and Uptime Monitoring", format: "Monitoring Pipeline", summary: "24/7 health checks and verified database restore points." },
      { title: "Monthly Health and Performance Report", format: "Summary Report", summary: "Website speed, uptime log, security updates and completed edits." },
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
          "Yes, if your site is built with modern React or Next.js, we can review the code and add it to a care plan.",
      },
    ],
  },
];




