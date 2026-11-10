import { Resend } from "resend";

export interface LeadEmailPayload {
  leadId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budgetRange?: string;
  message: string;
}

/**
 * Section 7 — Transactional email via Resend:
 * Sends lead notification to NOTIFY_EMAIL when RESEND_API_KEY is configured.
 * Fails gracefully without breaking lead capture if email credentials are missing.
 */
export async function sendLeadNotificationEmail(
  payload: LeadEmailPayload
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) {
    return { sent: false, error: "RESEND_API_KEY or NOTIFY_EMAIL not configured" };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "EliavaTech Leads <onboarding@resend.dev>",
      to: [notifyEmail],
      replyTo: payload.email,
      subject: `New EliavaTech Consultation Lead: ${payload.name}${
        payload.company ? ` (${payload.company})` : ""
      }`,
      text: [
        `New consultation lead submitted on EliavaTech:`,
        ``,
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Phone / WhatsApp: ${payload.phone || "Not provided"}`,
        `Company: ${payload.company || "Not provided"}`,
        `Service Interested In: ${payload.service || "Not specified"}`,
        `Budget Range: ${payload.budgetRange || "Not specified"}`,
        `Lead ID: ${payload.leadId || "N/A"}`,
        ``,
        `Message:`,
        payload.message,
      ].join("\n"),
    });

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    return { sent: false, error: message };
  }
}
