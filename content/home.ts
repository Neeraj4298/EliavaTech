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

export interface FounderPlaceholderData {
  id: string;
  name: string;
  role: string;
  focus: string;
  bio: string;
  initials: string;
  accent: "gold" | "primary" | "success";
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
    promise: "Replace phone-and-notebook order taking with structured catalogues and instant checkout.",
    icon: "ClipboardList",
  },
  {
    id: "lost-leads",
    title: "Lost leads",
    promise: "Capture every website and WhatsApp enquiry into a single tracked pipeline automatically.",
    icon: "UserMinus",
  },
  {
    id: "repeated-questions",
    title: "Repeated customer questions",
    promise: "Let automated WhatsApp flows and AI assistants handle timings, pricing and bookings 24/7.",
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
  { name: "Next.js", category: "Web Architecture" },
  { name: "React", category: "Interactive UI" },
  { name: "Node", category: "Backend Services" },
  { name: "PostgreSQL", category: "Relational Data" },
  { name: "WhatsApp", category: "Business Automation" },
  { name: "Razorpay", category: "Indian Payments" },
  { name: "Google Cloud", category: "Infrastructure & AI" },
  { name: "n8n", category: "Workflow Orchestration" },
] as const;

export const PROCESS_STEPS: ProcessStepData[] = [
  {
    step: "01",
    title: "Discover",
    summary:
      "We map your customer journey, current bottlenecks and revenue goals before recommending any tool.",
    deliverable: "Clear scope, fixed timeline & written proposal",
  },
  {
    step: "02",
    title: "Design",
    summary:
      "We structure your pages, data models, and WhatsApp flows so customers and staff can use them effortlessly.",
    deliverable: "Interactive wireframes & workflow blueprint",
  },
  {
    step: "03",
    title: "Build",
    summary:
      "We engineer your website, automation or software with clean TypeScript code, payment links and live testing.",
    deliverable: "Production-ready launch in ~2 weeks",
  },
  {
    step: "04",
    title: "Support",
    summary:
      "We stay on to handle backups, uptime monitoring, security updates and continuous improvements as you grow.",
    deliverable: "Monthly care & priority support",
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
    text: "Confirmed, Priya! Your appointment with Dr. Rao is booked for tomorrow at 6:15 PM. Location pin & reminder scheduled 2 hours prior.",
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
      "Websites, e-commerce, WhatsApp & AI automation, custom software, and cloud support under one roof.",
  },
  {
    id: "response-time",
    value: 24,
    suffix: "h",
    label: "Guaranteed Response Time",
    description:
      "Direct communication with the founding engineering and design team within one business day.",
  },
  {
    id: "typical-launch",
    value: 2,
    suffix: " Weeks",
    label: "Typical Website & Flow Launch",
    description:
      "Focused sprints with weekly checkpoints so your business starts capturing leads quickly.",
  },
  {
    id: "transparent-scope",
    value: 100,
    suffix: "%",
    label: "Transparent Upfront Scope",
    description:
      "Honest launch pricing, documented deliverables, and zero lock-in on your domain or data.",
  },
];

export const FOUNDERS_PLACEHOLDER: FounderPlaceholderData[] = [
  {
    id: "founder-1",
    name: "[Name] [PLACEHOLDER]",
    role: "Co-founder and CEO",
    focus: "Strategy & Client Relationships",
    bio: "[Short bio placeholder — oversees discovery, business problem framing, and long-term client partnerships.]",
    initials: "F1",
    accent: "gold",
  },
  {
    id: "founder-2",
    name: "[Name] [PLACEHOLDER]",
    role: "Co-founder and CTO",
    focus: "Engineering & Automation",
    bio: "[Short bio placeholder — leads full-stack architecture, custom CRM/ERP builds, and WhatsApp/n8n workflows.]",
    initials: "F2",
    accent: "primary",
  },
  {
    id: "founder-3",
    name: "[Name] [PLACEHOLDER]",
    role: "Co-founder and Head of Design & Product",
    focus: "Design Systems & Product UX",
    bio: "[Short bio placeholder — shapes brand clarity, accessible interfaces, and conversion-focused user journeys.]",
    initials: "F3",
    accent: "success",
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
      "You do. Your domain, Cloudflare DNS, database, and customer records remain in your company's accounts. We never hold client infrastructure hostage.",
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

