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

export interface SocialLink {
  name: string;
  href: string;
}

/**
 * Social profile links come from environment variables so the real company
 * profiles are never guessed. A profile is only shown when its URL is set
 * (must be a full https:// URL).
 */
export function getSocialLinks(): SocialLink[] {
  const candidates: Array<[string, string | undefined]> = [
    ["LinkedIn", process.env.NEXT_PUBLIC_LINKEDIN_URL],
    ["Instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL],
    ["X (Twitter)", process.env.NEXT_PUBLIC_X_URL],
    ["Facebook", process.env.NEXT_PUBLIC_FACEBOOK_URL],
    ["YouTube", process.env.NEXT_PUBLIC_YOUTUBE_URL],
  ];
  return candidates
    .map(([name, href]) => ({ name, href: (href ?? "").trim() }))
    .filter((s) => /^https:\/\//i.test(s.href));
}
