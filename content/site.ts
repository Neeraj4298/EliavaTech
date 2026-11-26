/**
 * Single source of truth for public business details.
 * Every component (footer, contact page, chat dock, emails, WhatsApp links)
 * reads from here so the details can never drift apart.
 */
export const BUSINESS = {
  name: "EliavaTech",
  email: "supporteliavatech@gmail.com",
  phoneDisplay: "+91 91213 34113",
  phoneE164: "+919121334113",
  whatsappDigits: "919121334113",
  serviceAreaTitle: "Where We Work",
  serviceAreaLine: "Remote-first team serving businesses across India",
  serviceAreaNote: "Video consultations via Google Meet. On-site visits by arrangement.",
} as const;

export type SocialPlatform =
  | "linkedin"
  | "instagram"
  | "x"
  | "facebook"
  | "youtube";

export interface SocialLink {
  id: SocialPlatform;
  name: string;
  handle: string;
  href: string;
}

/**
 * Social profile links read from environment variables with EliavaTech defaults
 * for LinkedIn and Instagram so the buttons are always visible across the site.
 */
export function getSocialLinks(): SocialLink[] {
  const candidates: Array<{
    id: SocialPlatform;
    name: string;
    handle: string;
    href: string | undefined;
  }> = [
    {
      id: "linkedin",
      name: "LinkedIn",
      handle: "/company/eliavatech",
      href:
        process.env.NEXT_PUBLIC_LINKEDIN_URL ||
        "https://www.linkedin.com/company/eliavatech",
    },
    {
      id: "instagram",
      name: "Instagram",
      handle: "@eliavatech",
      href:
        process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
        "https://www.instagram.com/eliavatech",
    },
    {
      id: "x",
      name: "X (Twitter)",
      handle: "@eliavatech",
      href: process.env.NEXT_PUBLIC_X_URL,
    },
    {
      id: "facebook",
      name: "Facebook",
      handle: "EliavaTech",
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    },
    {
      id: "youtube",
      name: "YouTube",
      handle: "@eliavatech",
      href: process.env.NEXT_PUBLIC_YOUTUBE_URL,
    },
  ];

  return candidates
    .map((item) => ({ ...item, href: (item.href ?? "").trim() }))
    .filter((s) => /^https:\/\//i.test(s.href));
}
