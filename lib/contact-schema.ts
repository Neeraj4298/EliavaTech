import { z } from "zod";

export const SERVICE_OPTIONS = [
  { value: "web-development", label: "Web Development (from ₹9,999)" },
  { value: "ecommerce", label: "E-commerce Store (from ₹34,999)" },
  { value: "whatsapp-ai-automation", label: "WhatsApp & AI Automation (from ₹12,999)" },
  { value: "custom-software", label: "Custom Software / CRM (from ₹49,999)" },
  { value: "cloud-support", label: "Cloud & Monthly Care (from ₹1,499/mo)" },
  { value: "not-sure", label: "Not sure yet — help me decide" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "under-15k", label: "Under ₹15,000" },
  { value: "15k-35k", label: "₹15,000 – ₹35,000" },
  { value: "35k-75k", label: "₹35,000 – ₹75,000" },
  { value: "75k-plus", label: "₹75,000+" },
  { value: "monthly-care", label: "Monthly Care Plan (₹1,499 – ₹5,999/mo)" },
] as const;

/** Options used by the custom-quote form on the pricing page. */
export const PRICING_SERVICE_OPTIONS = [
  { value: "bundle", label: "Website + WhatsApp Automation Bundle" },
  { value: "ecommerce", label: "E-commerce Store (from ₹34,999)" },
  { value: "crm", label: "Custom CRM / Dashboard (from ₹49,999)" },
  { value: "care", label: "Monthly Care Plan" },
] as const;

export const PRICING_BUDGET_OPTIONS = [
  { value: "10k-25k", label: "₹10,000 – ₹25,000" },
  { value: "25k-50k", label: "₹25,000 – ₹50,000" },
  { value: "50k-1L", label: "₹50,000 – ₹1,00,000" },
  { value: "1L+", label: "₹1,00,000+" },
] as const;

export const SERVICE_VALUES = [
  ...SERVICE_OPTIONS.map((o) => o.value),
  ...PRICING_SERVICE_OPTIONS.map((o) => o.value),
] as unknown as [string, ...string[]];

const BUDGET_VALUES = [
  ...BUDGET_OPTIONS.map((o) => o.value),
  ...PRICING_BUDGET_OPTIONS.map((o) => o.value),
] as unknown as [string, ...string[]];

// Digits, spaces, dashes, brackets and an optional leading +. 7-15 digits.
const PHONE_PATTERN = /^\+?[\d\s\-()]{7,25}$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(100, "Name must be under 100 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(160, "Email must be under 160 characters."),
  phone: z
    .string()
    .trim()
    .max(25, "Phone number is too long.")
    .refine(
      (value) =>
        value === "" ||
        (PHONE_PATTERN.test(value) && value.replace(/\D/g, "").length >= 7),
      "Please enter a valid phone or WhatsApp number."
    )
    .optional(),
  company: z
    .string()
    .trim()
    .max(120, "Company name must be under 120 characters.")
    .optional(),
  service: z.enum(SERVICE_VALUES, {
    message: "Please select a service you are interested in.",
  }),
  budgetRange: z.enum(BUDGET_VALUES, {
    message: "Please select an estimated budget range.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please share a short summary of your project (at least 10 characters).")
    .max(2000, "Message must be under 2,000 characters."),
  // Honeypot spam field: must stay empty.
  website: z.string().max(0, "Spam detected.").optional(),
  // Which form submitted the request (for analytics and email labels).
  source: z.enum(["contact", "pricing"]).optional(),
  // Cloudflare Turnstile token (required by the server in production).
  turnstileToken: z.string().max(4096).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
