export type FounderAccent = "gold" | "primary" | "success";

export interface Founder {
  id: string;
  name: string;
  role: string;
  /** Short responsibility label shown under the name. */
  focus: string;
  bio: string;
  initials: string;
  accent: FounderAccent;
}

/**
 * Single source of truth for the founding team. The About page and the home
 * page founders section both read from here, so names, roles and bios can
 * never drift apart.
 */
export const FOUNDERS: Founder[] = [
  {
    id: "founder-1",
    name: "Karunya Gotru",
    role: "Co-founder",
    focus: "Strategy and Client Relationships",
    bio: "Karunya works closely with clients to understand their business needs and set the direction of each project. A business-first approach turns ideas into practical technology that solves real problems.",
    initials: "KG",
    accent: "gold",
  },
  {
    id: "founder-2",
    name: "Neeraj Racharla",
    role: "Co-founder",
    focus: "Engineering and Automation",
    bio: "Neeraj leads cloud engineering and automation. The focus is on building reliable, scalable applications and smooth deployments, so the software your business depends on stays dependable.",
    initials: "NR",
    accent: "primary",
  },
  {
    id: "founder-3",
    name: "Satish Ramagalla",
    role: "Co-founder",
    focus: "Product Design and User Experience",
    bio: "Satish shapes the product experience and interface design. The goal is clear, easy-to-use journeys that turn product ideas into accessible digital experiences for your customers and staff.",
    initials: "SR",
    accent: "success",
  },
];
