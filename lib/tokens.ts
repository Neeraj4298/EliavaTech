export interface ColorTokenSpec {
  token: string;
  tailwindClass: string;
  darkHex: string;
  lightHex: string;
  use: string;
}

export const COLOR_TOKENS: ColorTokenSpec[] = [
  {
    token: "--bg",
    tailwindClass: "bg-bg / text-bg",
    darkHex: "#060912",
    lightHex: "#F7F8FB",
    use: "Page background",
  },
  {
    token: "--surface",
    tailwindClass: "bg-surface / text-surface",
    darkHex: "#0D1322",
    lightHex: "#FFFFFF",
    use: "Cards, panels",
  },
  {
    token: "--surface-2",
    tailwindClass: "bg-surface-2 / text-surface-2",
    darkHex: "#141C31",
    lightHex: "#EEF0F6",
    use: "Raised or hover surfaces",
  },
  {
    token: "--border",
    tailwindClass: "border-border / bg-border",
    darkHex: "#222C47",
    lightHex: "#DDE1EC",
    use: "Dividers, outlines",
  },
  {
    token: "--text",
    tailwindClass: "text-text / bg-text",
    darkHex: "#EEF1F8",
    lightHex: "#0B1020",
    use: "Primary text",
  },
  {
    token: "--text-muted",
    tailwindClass: "text-text-muted",
    darkHex: "#9AA6C3",
    lightHex: "#55607A",
    use: "Secondary text",
  },
  {
    token: "--primary",
    tailwindClass: "bg-primary / text-primary",
    darkHex: "#7C6CFF",
    lightHex: "#4B3FE0",
    use: "Buttons, links, key accents",
  },
  {
    token: "--primary-hover",
    tailwindClass: "bg-primary-hover / text-primary-hover",
    darkHex: "#9A8DFF",
    lightHex: "#3A2FC4",
    use: "Hover state",
  },
  {
    token: "--gold",
    tailwindClass: "bg-gold / text-gold",
    darkHex: "#F2B84B",
    lightHex: "#C98A12",
    use: "Rare highlights only (max 1–2 per screen)",
  },
  {
    token: "--success",
    tailwindClass: "bg-success / text-success",
    darkHex: "#34D399",
    lightHex: "#0F9D6B",
    use: "Success states",
  },
  {
    token: "--danger",
    tailwindClass: "bg-danger / text-danger",
    darkHex: "#F87171",
    lightHex: "#D64545",
    use: "Errors",
  },
];

export const TYPOGRAPHY_SCALE = [
  {
    name: "H1 Heading",
    className: "text-h1",
    font: "Sora SemiBold (600)",
    desktop: "64px / 68px",
    mobile: "40px / 44px",
    tracking: "-0.02em",
    sample: "Building What's Next.",
  },
  {
    name: "H2 Heading",
    className: "text-h2",
    font: "Sora SemiBold (600)",
    desktop: "44px / 50px",
    mobile: "30px / 36px",
    tracking: "-0.02em",
    sample: "Websites, software and AI automation.",
  },
  {
    name: "H3 Heading",
    className: "text-h3",
    font: "Sora SemiBold (600)",
    desktop: "28px / 36px",
    mobile: "22px / 30px",
    tracking: "-0.02em",
    sample: "Engineered for growing Indian businesses.",
  },
  {
    name: "Body Copy",
    className: "text-body",
    font: "Inter Regular (400)",
    desktop: "17px / 28px",
    mobile: "17px / 28px",
    tracking: "0em",
    sample:
      "We design websites, automate operations and build custom software for businesses that want to grow without a technical team.",
  },
  {
    name: "Small / UI",
    className: "text-small",
    font: "Inter Regular (400)",
    desktop: "14px / 22px",
    mobile: "14px / 22px",
    tracking: "0em",
    sample: "Digital solutions for growing businesses · Response within 1 business day",
  },
  {
    name: "Code & Numbers",
    className: "font-mono text-small",
    font: "JetBrains Mono Regular (400)",
    desktop: "14px / 22px",
    mobile: "14px / 22px",
    tracking: "0em",
    sample: "₹24,999 · 99.9% uptime · POST /api/contact → 200 OK (42ms)",
  },
];

export const SPACING_TOKENS = [
  { name: "--space-1", px: "8px", rem: "0.5rem", usage: "Base 8px grid unit, tight icon gaps" },
  { name: "--space-2", px: "16px", rem: "1rem", usage: "Control padding, compact stack gap" },
  { name: "--space-3", px: "24px", rem: "1.5rem", usage: "Card internal padding, grid gap" },
  { name: "--space-4", px: "32px", rem: "2rem", usage: "Panel padding, subsection separation" },
  { name: "--space-5", px: "40px", rem: "2.5rem", usage: "Medium layout gap" },
  { name: "--space-6", px: "48px", rem: "3rem", usage: "Header-to-content spacing" },
  { name: "--space-8", px: "64px", rem: "4rem", usage: "Large block separation" },
  { name: "--space-9", px: "72px", rem: "4.5rem", usage: "Section vertical padding (Mobile)" },
  { name: "--space-12", px: "96px", rem: "6rem", usage: "Hero / high-emphasis vertical rhythm" },
  { name: "--space-15", px: "120px", rem: "7.5rem", usage: "Section vertical padding (Desktop)" },
];

export const RADIUS_TOKENS = [
  {
    name: "--radius-card",
    tailwindClass: "rounded-card",
    value: "12px (0.75rem)",
    usage: "Cards, panels, modals, dropdown containers",
  },
  {
    name: "--radius-input",
    tailwindClass: "rounded-input",
    value: "12px (0.75rem)",
    usage: "Inputs, textareas, selects",
  },
  {
    name: "--radius-pill",
    tailwindClass: "rounded-pill",
    value: "999px",
    usage: "Primary buttons, badges, pills, toggle switches",
  },
];
