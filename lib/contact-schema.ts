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

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(100, "Name must be under 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(160, "Email must be under 160 characters."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone or WhatsApp number.")
    .max(25, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .trim()
    .max(120, "Company name must be under 120 characters.")
    .optional()
    .or(z.literal("")),
  service: z
    .string()
    .trim()
    .min(1, "Please select a service you are interested in."),
  budgetRange: z
    .string()
    .trim()
    .min(1, "Please select an estimated budget range."),
  message: z
    .string()
    .trim()
    .min(10, "Please share a short summary of your business need (at least 10 characters).")
    .max(2000, "Message must be under 2,000 characters."),
  // Honeypot spam field — must remain empty
  website: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
  // Cloudflare Turnstile token (optional when Turnstile keys are not configured in dev)
  turnstileToken: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
