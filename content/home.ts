export interface ProblemCardData {
  id: string;
  title: string;
  promise: string;
  icon: "SearchX" | "ClipboardList" | "UserMinus" | "MessageCircleQuestion" | "Workflow";
}

export interface ProcessStepData {
  step: string;
  title: string;
  summary: string;
  deliverable: string;
}

export interface WhatsAppChatMessage {
  id: string;
  sender: "customer" | "bot";
  text: string;
  time: string;
  meta?: string;
}

export interface StatPointData {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface FAQItemData {
  question: string;
  answer: string;
}

export const HERO_CONTENT = {
  label: "Digital solutions for growing businesses",
  title: "Building What's Next.",
  subtext:
    "We design websites, automate operations and build custom software for businesses that want to grow without a technical team.",
  primaryCta: { label: "Book a Free Consultation", href: "/contact" },
  secondaryCta: { label: "See Our Work", href: "/work" },
  trustLine: "Websites. Automation. Software. Support.",
  layers: [
    { id: "top", badge: "03", label: "WhatsApp & AI Automation", tone: "gold" },
    { id: "middle", badge: "02", label: "Custom CRM & ERP Software", tone: "primary" },
    { id: "bottom", badge: "01", label: "Websites & E-commerce", tone: "primary" },
  ],
} as const;

export const PROBLEM_CARDS: ProblemCardData[] = [
  {
    id: "not-found-online",
    title: "Not found online",
    promise: "Show up clearly on Google and mobile when local customers search for what you offer.",
    icon: "SearchX",
  },
  {
    id: "manual-orders",
    title: "Manual orders",
    promise: "Replace phone-and-notebook orders with an online catalogue and instant checkout.",
    icon: "ClipboardList",
  },
  {
    id: "lost-leads",
    title: "Lost leads",
    promise: "Capture every website and WhatsApp enquiry in one place, automatically.",
    icon: "UserMinus",
  },
  {
    id: "repeated-questions",
    title: "Repeated customer questions",
    promise: "Let automated WhatsApp replies and 24/7 AI customer support handle timings, pricing and bookings.",
    icon: "MessageCircleQuestion",
  },
  {
    id: "inefficient-processes",
    title: "Inefficient processes",
    promise: "Connect billing, inventory and team tasks in one custom dashboard built around your workflow.",
    icon: "Workflow",
  },
];

export const TECH_CAPABILITIES = [
  { name: "Next.js", category: "Websites" },
  { name: "React", category: "User Interface" },
  { name: "Node", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "WhatsApp", category: "Business Automation" },
  { name: "Razorpay", category: "Indian Payments" },
  { name: "Google Cloud", category: "Cloud and AI" },
  { name: "n8n", category: "Workflow Automation" },
] as const;

export const PROCESS_STEPS: ProcessStepData[] = [
  {
    step: "01",
    title: "Discover",
    summary:
      "We map your customer journey, current bottlenecks and revenue goals before recommending any tool.",
    deliverable: "Clear scope, fixed timeline and written proposal",
  },
  {
    step: "02",
    title: "Design",
    summary:
      "We plan your pages, data and WhatsApp flows so customers and staff find them easy to use.",
    deliverable: "Interactive wireframes and workflow plan",
  },
  {
    step: "03",
    title: "Build",
    summary:
      "We build your website, automation or software, add payment links and test everything live.",
    deliverable: "Ready to launch in about 2 weeks",
  },
  {
    step: "04",
    title: "Support",
    summary:
      "We stay on to handle backups, uptime monitoring, security updates and improvements as you grow.",
    deliverable: "Monthly care and priority support",
  },
];

export const WHATSAPP_DEMO_MESSAGES: WhatsAppChatMessage[] = [
  {
    id: "m1",
    sender: "customer",
    text: "Hi, I'd like to book a dental consultation for tomorrow evening.",
    time: "10:14 AM",
  },
  {
    id: "m2",
    sender: "bot",
    text: "Hello! Welcome to CarePlus Clinic. Dr. Rao has two slots open tomorrow: 5:30 PM and 6:15 PM. Which works best for you?",
    time: "10:14 AM",
    meta: "Automated via WhatsApp Flow",
  },
  {
    id: "m3",
    sender: "customer",
    text: "6:15 PM please. My name is Priya Nair.",
    time: "10:15 AM",
  },
  {
    id: "m4",
    sender: "bot",
    text: "Confirmed, Priya! Your appointment with Dr. Rao is booked for tomorrow at 6:15 PM. Location pin and a reminder scheduled for two hours before.",
    time: "10:15 AM",
    meta: "Synced to Clinic CRM + Google Calendar",
  },
];

export const WHY_ELIAVA_STATS: StatPointData[] = [
  {
    id: "service-lines",
    value: 5,
    suffix: " Lines",
    label: "Integrated Service Lines",
    description:
      "Websites, e-commerce, WhatsApp and AI automation, custom software and cloud support under one roof.",
  },
  {
    id: "response-time",
    value: 24,
    suffix: "h",
    label: "Guaranteed Response Time",
    description:
      "A direct reply from our founding team within one business day.",
  },
  {
    id: "typical-launch",
    value: 2,
    suffix: " Weeks",
    label: "Typical Website & Flow Launch",
    description:
      "Short build cycles with weekly check-ins, so your business starts capturing leads quickly.",
  },
  {
    id: "transparent-scope",
    value: 100,
    suffix: "%",
    label: "Transparent Upfront Scope",
    description:
      "Honest launch pricing, documented deliverables and zero lock-in on your domain or data.",
  },
];

export const HOME_FAQS: FAQItemData[] = [
  {
    question: "How long does it take to launch a business website or automation workflow?",
    answer:
      "A standard 5-to-10 page business website or WhatsApp lead-capture workflow typically launches within 2 weeks once content and scope are confirmed. E-commerce stores and custom CRM modules take 3 to 6 weeks depending on integrations.",
  },
  {
    question: "Do we need a technical person on our team to manage the website or software?",
    answer:
      "No. Everything we build is designed for business owners and front-desk staff. We provide a clean dashboard, short recorded walkthroughs, and optional monthly care plans starting at ₹1,499/month.",
  },
  {
    question: "How does WhatsApp automation work and what are the third-party costs?",
    answer:
      "We configure official WhatsApp Business API flows or click-to-chat funnels connected to your CRM or Google Sheet. Our setup starts from ₹12,999; Meta's per-conversation WhatsApp API charges and hosting fees are billed directly at actuals.",
  },
  {
    question: "Who owns the domain, source code, and customer data?",
    answer:
      "You do. Your domain, DNS, database and customer records stay in your company's accounts. We never hold your accounts or data back.",
  },
  {
    question: "Can we start with a simple website now and add automation or CRM later?",
    answer:
      "Yes. Most clients begin with a fast, search-ready website or WhatsApp booking flow and add e-commerce or custom CRM modules once enquiry volume grows.",
  },
  {
    question: "Why are your launch prices lower than typical enterprise agencies?",
    answer:
      "We offer Founding Client Pricing to our first 10 pilot clients in exchange for honest feedback and permission to publish a real case study once your project succeeds.",
  },
];

export const FINAL_CTA_CONTENT = {
  heading: "Have a business problem? Let's work out how technology can solve it.",
  subtext:
    "Tell us what is slowing your team down. We will reply within one business day with a practical recommendation and clear pricing.",
  primaryCta: { label: "Book a Free Consultation", href: "/contact" },
  secondaryCta: { label: "View Founding Pricing", href: "/pricing" },
} as const;

