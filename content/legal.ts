export interface LegalSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export const LEGAL_REVIEW_BANNER =
  "IMPORTANT NOTICE — [PLACEHOLDER FOR LEGAL REVIEW]: This document is a structured template prepared for EliavaTech and must be reviewed and approved by a qualified legal professional before commercial launch.";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "overview",
    heading: "1. Overview & Data Fiduciary Details [PLACEHOLDER]",
    paragraphs: [
      "EliavaTech ('we', 'us', or 'our') respects your privacy and is committed to protecting personal data in accordance with India's Digital Personal Data Protection Act, 2023 (DPDP Act).",
      "Data Fiduciary Contact [PLACEHOLDER]: EliavaTech · Remote-first, serving India [PLACEHOLDER address] · Email: hello@eliavatech.com [PLACEHOLDER].",
    ],
  },
  {
    id: "data-collected",
    heading: "2. Personal Data We Collect",
    paragraphs: [
      "We collect only the minimum personal data necessary to respond to your business enquiry or deliver requested services:",
    ],
    bullets: [
      "Contact & Consultation Form: Your name, business email address, optional phone/WhatsApp number, company name, selected service, estimated budget range, and project brief.",
      "AI Chat Assistant: Questions you type into the assistant and, if you request a quote, your name, email, and project need.",
      "Consultation Booking (Cal.com): Name, email, and preferred meeting time when you book a video consultation.",
      "Analytics Data (Consent-Only): Anonymous page-view and interaction events via Google Analytics 4, loaded strictly after you click 'Accept Analytics' on our Cookie Banner.",
    ],
  },
  {
    id: "purpose",
    heading: "3. Purpose & Lawful Basis of Processing",
    paragraphs: [
      "Your personal data is processed solely to reply to your enquiry, prepare project scopes and quotes, schedule requested consultations, and improve website reliability.",
      "We never sell, rent, or trade your personal data to third-party marketers or data brokers.",
    ],
  },
  {
    id: "processors",
    heading: "4. Third-Party Infrastructure & Sub-Processors",
    paragraphs: [
      "To operate this website securely, we rely on trusted infrastructure providers:",
    ],
    bullets: [
      "Cloudflare (DNS, security, and Turnstile spam protection)",
      "Vercel (website application hosting)",
      "Managed PostgreSQL — Neon or Supabase (encrypted storage of form leads and chat transcripts)",
      "Resend & Google Workspace (lead notification and business email delivery)",
      "Google Gemini API (server-side generation of AI assistant responses)",
      "Google Analytics 4 (activated only after visitor consent)",
    ],
  },
  {
    id: "rights",
    heading: "5. Your Rights & Data Removal Requests (DPDP Act)",
    paragraphs: [
      "Under the Digital Personal Data Protection Act, 2023, you have the right to request access to, correction of, or erasure of your personal data, and to withdraw consent at any time.",
      "To request data removal or exercise any privacy right, email hello@eliavatech.com [PLACEHOLDER] with the subject line 'Privacy Request'. We respond within 7 business days [PLACEHOLDER].",
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Website Terms [PLACEHOLDER]",
    paragraphs: [
      "By accessing eliavatech.com, you agree to these Terms of Service. All client engagements for web development, e-commerce, WhatsApp automation, custom software, or monthly care plans are governed by a separate written Statement of Work (SOW) signed by both parties.",
    ],
  },
  {
    id: "concept-projects",
    heading: "2. Concept Projects & Pricing Estimates",
    paragraphs: [
      "Demonstrations shown on our /work page are clearly labelled as 'Concept projects' engineered to illustrate our technical capabilities and do not represent past commercial client endorsements.",
      "Prices listed on our /pricing page ('From ₹9,999', etc.) are starting estimates under our Founding Client Pricing. Final project fees depend on written scope. Third-party vendor charges (domains, WhatsApp Business API conversation fees, payment gateway fees, and cloud hosting) are billed separately at actuals.",
    ],
  },
  {
    id: "ownership",
    heading: "3. Client Ownership of Code, Domains & Data",
    paragraphs: [
      "Upon full payment of agreed project fees under a Statement of Work, the client owns the custom deliverables, domain registrations, and customer database records configured for their business, subject to open-source license terms of underlying frameworks.",
    ],
  },
  {
    id: "ai-assistant",
    heading: "4. Use of the AI Assistant",
    paragraphs: [
      "Our on-site AI Assistant provides general information based on EliavaTech's published services and price ranges. Responses do not constitute a binding contract or formal quote until confirmed in writing by an EliavaTech co-founder.",
    ],
  },
  {
    id: "liability",
    heading: "5. Limitation of Liability & Governing Law [PLACEHOLDER]",
    paragraphs: [
      "This website is provided 'as is' without warranties of any kind. To the maximum extent permitted by Indian law, EliavaTech shall not be liable for indirect or consequential damages arising from use of this website.",
      "Governing Law & Jurisdiction [PLACEHOLDER]: These terms are governed by the laws of India, with exclusive jurisdiction in the courts of [City/State PLACEHOLDER].",
    ],
  },
];

export const COOKIE_SECTIONS: LegalSection[] = [
  {
    id: "how-we-use",
    heading: "1. How We Use Cookies & Local Storage",
    paragraphs: [
      "EliavaTech uses a minimal set of browser storage items to remember your visual theme and privacy preferences, and optional analytics cookies that load only with your explicit consent.",
    ],
  },
  {
    id: "essential",
    heading: "2. Strictly Necessary Storage (Always Active)",
    paragraphs: [
      "These items are required for basic website functionality and security and do not track you across other websites:",
    ],
    bullets: [
      "eliavatech-theme (localStorage): Remembers whether you selected Light or Dark mode.",
      "eliavatech-cookie-consent (localStorage): Remembers whether you accepted or declined analytics cookies.",
      "eliavatech-chat-nudge-shown (sessionStorage): Ensures the assistant welcome nudge appears at most once per browsing session.",
      "Cloudflare Turnstile (cookie/token): Protects our contact form against automated spam bots.",
    ],
  },
  {
    id: "analytics",
    heading: "3. Optional Analytics Cookies (Consent-Gated)",
    paragraphs: [
      "Google Analytics 4 (_ga, _ga_*) is blocked by default using Google Consent Mode. It is loaded only if you click 'Accept Analytics' on our cookie banner. You can switch your preference back to 'Essential Only' at any time using the controls on this page or in the site footer.",
    ],
  },
];

