export interface ValueItem {
  title: string;
  description: string;
}

export interface FounderDetail {
  id: string;
  name: string;
  role: string;
  focus: string;
  bio: string;
  accent: "gold" | "primary" | "success";
}

export const ABOUT_CONTENT = {
  hero: {
    eyebrow: "About EliavaTech · Building What's Next.",
    title: "A steady foundation with forward motion.",
    subtext:
      "We help growing businesses across India replace fragmented manual work with dependable websites, WhatsApp automation, and custom software.",
  },
  story: {
    heading: "Our Story & Mission",
    paragraphs: [
      "Most small and mid-sized businesses face an unfair choice: piece together generic templates that break as operations grow, or pay enterprise agency retainers built for large corporations.",
      "EliavaTech was founded by three builders—across strategy, engineering, and product design—to close that gap. We combine agency-grade design clarity with practical automation and custom software priced honestly for growing businesses.",
      "We talk about your operational bottleneck first, and technology second. Whether you run a multi-chair clinic, a retail storefront, or a real estate team, our goal is simple: save your team hours every week and make sure no customer enquiry falls through the cracks.",
    ],
  },
  nameMeaning: {
    badge: "Heritage & Meaning",
    heading: "The Meaning of Eliava",
    body: "Eliava comes from the Hebrew name Eliav, meaning “My God is Father.” For our founding team, this name is a quiet, dignified reminder of stewardship, responsibility, and lasting trust—building every system with the care and honesty it deserves.",
  },
  values: [
    {
      title: "Clarity",
      description:
        "Short sentences, transparent pricing, and interfaces that your customers and staff understand without a manual.",
    },
    {
      title: "Craftsmanship",
      description:
        "Fast Next.js architecture, clean TypeScript code, and WCAG AA accessibility in both dark and light themes.",
    },
    {
      title: "Integrity",
      description:
        "No invented metrics, no hidden lock-in, and honest advice—even when a simpler tool solves your problem better.",
    },
    {
      title: "Partnership",
      description:
        "We stay available after launch with structured care plans, backups, and direct access to the founders.",
    },
  ] satisfies ValueItem[],
  founders: [
    {
      id: "founder-1",
      name: "Karunya Gotru",
      role: "Co-founder",
      focus: "Strategy & Client Relationships",
      bio: "Focused on understanding business requirements, shaping project direction, and building meaningful client relationships. Brings a business-oriented perspective to translating ideas into practical technology solutions.",
      accent: "gold",
    },
    {
      id: "founder-2",
      name: "Neeraj Racharla",
      role: "Co-founder",
      focus: "Engineering & Automation",
      bio: "Focused on cloud engineering, software infrastructure, and automation. Works on building scalable applications, streamlining deployment workflows, and creating reliable technology systems.",
      accent: "primary",
    },
    {
      id: "founder-3",
      name: "Satish Ramagalla",
      role: "Co-founder",
      focus: "Design Systems & Product UX",
      bio: "Focused on product experiences, interface design, and digital development. Interested in creating intuitive user journeys and translating product ideas into functional, accessible digital experiences.",
      accent: "success",
    },
  ] satisfies FounderDetail[],
} as const;
