import { BUSINESS } from "@/content/site";

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export const LEGAL_LAST_UPDATED = "17 November 2026";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "overview",
    heading: "1. Who We Are",
    paragraphs: [
      "EliavaTech (\"we\", \"us\" or \"our\") respects your privacy and protects personal data in line with India's Digital Personal Data Protection Act, 2023 (DPDP Act).",
      `You can contact us about your personal data at ${BUSINESS.email} or on ${BUSINESS.phoneDisplay}. ${BUSINESS.serviceAreaLine}.`,
    ],
  },
  {
    id: "data-collected",
    heading: "2. Personal Data We Collect",
    paragraphs: [
      "We collect only the personal data we need to reply to your enquiry or deliver the service you ask for:",
    ],
    bullets: [
      "Contact and pricing forms: your name, email address, phone or WhatsApp number (optional), company name (optional), selected service, estimated budget and project details.",
      "AI chat assistant: the questions you type. If you ask for a quote, or type your email address in the chat, we also keep your name, email address and project need. Chat messages are sent to Google's Gemini service to produce replies.",
      "Consultation booking (Google Calendar & Google Meet): your name, email address, optional phone number and selected meeting slot, used to schedule a Google Calendar event and generate a Google Meet link.",
      "Analytics (only with your consent): anonymous page-view and interaction data through Google Analytics 4. It loads only after you click \"Accept Analytics\" on our cookie banner.",
    ],
  },
  {
    id: "purpose",
    heading: "3. Why We Use Your Data",
    paragraphs: [
      "We use your personal data only to reply to your enquiry, prepare project scopes and quotes, schedule consultations you request, protect the website from spam and misuse, and keep the website reliable.",
      "We never sell, rent or trade your personal data to marketers or data brokers.",
    ],
  },
  {
    id: "processors",
    heading: "4. Service Providers That Handle Data for Us",
    paragraphs: [
      "To run this website we use trusted providers. Each receives only the data it needs for its job:",
    ],
    bullets: [
      "Vercel: website hosting.",
      "Cloudflare: DNS and security, and Turnstile spam protection on our forms where it is switched on.",
      "A managed PostgreSQL database provider: encrypted storage of enquiries and chat records.",
      "Google (Gmail) and Resend: delivery of notification and confirmation emails.",
      "n8n: an automation tool that can pass new enquiries to our internal workflows.",
      "Google Gemini: generates AI assistant replies from the messages you type.",
      "Google Calendar & Google Meet: consultation slot availability, meeting invites and video calls.",
      "Google Analytics 4: usage statistics, only after you accept analytics.",
    ],
  },
  {
    id: "retention",
    heading: "5. How Long We Keep Your Data",
    paragraphs: [
      "We keep enquiry and chat records for as long as needed to respond to you, deliver agreed work and keep reasonable business records. You can ask us to delete your data at any time (see below).",
    ],
  },
  {
    id: "rights",
    heading: "6. Your Rights and Data Removal",
    paragraphs: [
      "Under the DPDP Act, 2023, you can ask to access, correct or erase your personal data, and you can withdraw your consent at any time.",
      `To use any of these rights, email ${BUSINESS.email} with the subject line "Privacy Request". We reply within 7 business days.`,
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "1. Using This Website",
    paragraphs: [
      "By using eliavatech.com you agree to these Terms of Service. Work for clients on web development, e-commerce, WhatsApp automation, custom software or monthly care plans is covered by a separate written Statement of Work (SOW) signed by both sides.",
    ],
  },
  {
    id: "concept-projects",
    heading: "2. Concept Projects and Price Estimates",
    paragraphs: [
      "The demos on our /work page are labelled \"Concept projects\". They show what we can build and are not past client projects or endorsements.",
      "Prices on our /pricing page (for example \"From ₹9,999\") are starting estimates under our Founding Client Pricing. The final fee depends on the written scope. Third-party charges such as domains, WhatsApp Business API fees, payment gateway fees and cloud hosting are billed separately at actual cost.",
    ],
  },
  {
    id: "ownership",
    heading: "3. Ownership of Code, Domains and Data",
    paragraphs: [
      "After full payment under a Statement of Work, the client owns the custom work delivered, the domain registrations and the customer data set up for their business. Open-source licence terms of the underlying frameworks still apply.",
    ],
  },
  {
    id: "ai-assistant",
    heading: "4. The AI Assistant",
    paragraphs: [
      "Our AI assistant gives general information based on EliavaTech's published services and price ranges. Its replies are not a contract or a formal quote until a co-founder confirms them in writing.",
    ],
  },
  {
    id: "liability",
    heading: "5. Limits of Liability and Governing Law",
    paragraphs: [
      "This website is provided \"as is\", without warranties of any kind. To the fullest extent allowed by Indian law, EliavaTech is not liable for indirect or consequential loss arising from use of this website.",
      "These terms are governed by the laws of India. Any dispute will be handled by the courts in India that have jurisdiction over EliavaTech's place of business.",
    ],
  },
];

export const COOKIE_SECTIONS: LegalSection[] = [
  {
    id: "how-we-use",
    heading: "1. How We Use Cookies and Local Storage",
    paragraphs: [
      "EliavaTech stores a few small items in your browser to remember your theme and privacy choices. Optional analytics cookies load only if you give consent.",
    ],
  },
  {
    id: "essential",
    heading: "2. Essential Storage (Always On)",
    paragraphs: [
      "These items are needed for the website to work and stay secure. They do not track you on other websites:",
    ],
    bullets: [
      "eliavatech-theme (localStorage): remembers whether you chose light or dark mode.",
      "eliavatech-cookie-consent (localStorage): remembers whether you accepted or declined analytics.",
      "eliavatech-chat-nudge-shown (sessionStorage): makes sure the assistant's welcome prompt appears at most once per visit.",
      "Cloudflare Turnstile (cookie or token): protects our contact, booking and pricing forms from automated spam.",
    ],
  },
  {
    id: "analytics",
    heading: "3. Optional Analytics Cookies (Only With Consent)",
    paragraphs: [
      "Google Analytics 4 (_ga, _ga_*) is blocked by default. It loads only if you click \"Accept Analytics\" on our cookie banner. You can change your choice at any time using the controls at the top of this page.",
    ],
  },
];
