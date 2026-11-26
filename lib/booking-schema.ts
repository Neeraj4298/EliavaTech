import { z } from "zod";
import { SERVICE_VALUES } from "./contact-schema";

const PHONE_REGEX = /^[+()\-.\s0-9]{7,20}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const bookingDateQuerySchema = z.object({
  date: z
    .string()
    .trim()
    .regex(DATE_REGEX, "Date must be in YYYY-MM-DD format."),
});

export const bookingRequestSchema = z.object({
  date: z
    .string()
    .trim()
    .regex(DATE_REGEX, "Please select a valid date."),
  slotTime: z
    .string()
    .trim()
    .regex(TIME_REGEX, "Please select a valid time slot."),
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(80, "Name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid business email address.")
    .max(120, "Email must be 120 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number must be 20 characters or fewer.")
    .refine((val) => val.length === 0 || PHONE_REGEX.test(val), {
      message: "Please enter a valid phone or WhatsApp number.",
    })
    .optional()
    .or(z.literal("")),
  service: z
    .enum(SERVICE_VALUES, {
      message: "Please select a service topic.",
    })
    .default("web-development"),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be 1000 characters or fewer.")
    .optional()
    .or(z.literal("")),
  // Honeypot field — must stay empty for real visitors
  website: z.string().max(0, "Bot detected.").optional().or(z.literal("")),
  // Cloudflare Turnstile token
  turnstileToken: z.string().max(4096).optional().or(z.literal("")),
});

export type BookingRequestValues = z.infer<typeof bookingRequestSchema>;
