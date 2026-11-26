import fs from "node:fs";
import path from "node:path";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { BUSINESS } from "@/content/site";

function stripQuotes(value: string): string {
  return value.trim().replace(/^["']|["']$/g, "");
}

function getEnvValue(key: string): string {
  const fromProc = process.env[key];
  if (fromProc) {
    const cleaned = stripQuotes(fromProc);
    if (cleaned) return cleaned;
  }
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const k = trimmed.slice(0, eqIdx).trim();
      if (k === key) {
        const val = stripQuotes(trimmed.slice(eqIdx + 1));
        if (val) return val;
      }
    }
  } catch {
    // ignore if .env.local does not exist in production
  }
  return "";
}

export interface LeadEmailPayload {
  leadId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budgetRange?: string;
  message: string;
  source?: string;
}

export interface LeadEmailResult {
  sent: boolean;
  teamEmailSent: boolean;
  userEmailSent: boolean;
  error?: string;
}

const SERVICE_LABELS: Record<string, string> = {
  "web-development": "Web Development (from ₹9,999)",
  ecommerce: "E-commerce Store (from ₹34,999)",
  "whatsapp-ai-automation": "WhatsApp & AI Automation (from ₹12,999)",
  "custom-software": "Custom Software / CRM (from ₹49,999)",
  "cloud-support": "Cloud & Monthly Care (from ₹1,499/mo)",
  "not-sure": "Not sure yet — help me decide",
  bundle: "Website + WhatsApp Automation Bundle",
  crm: "Custom CRM / Dashboard (from ₹49,999)",
  care: "Monthly Care Plan",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-15k": "Under ₹15,000",
  "15k-35k": "₹15,000 – ₹35,000",
  "35k-75k": "₹35,000 – ₹75,000",
  "75k-plus": "₹75,000+",
  "monthly-care": "Monthly Care Plan (₹1,499 – ₹5,999/mo)",
  "10k-25k": "₹10,000 – ₹25,000",
  "25k-50k": "₹25,000 – ₹50,000",
  "50k-1L": "₹50,000 – ₹1,00,000",
  "1L+": "₹1,00,000+",
  undecided: "Undecided",
};

function singleLine(value: string): string {
  return value.replace(/[\r\n\u2028\u2029]+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatServiceLabel(service?: string): string {
  if (!service) return "Not specified";
  return SERVICE_LABELS[service] || service;
}

function formatBudgetLabel(budgetRange?: string): string {
  if (!budgetRange) return "Not specified";
  return BUDGET_LABELS[budgetRange] || budgetRange;
}

function buildTeamEmailContent(payload: LeadEmailPayload, serviceLabel: string, budgetLabel: string) {
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone || "Not provided");
  const safeCompany = escapeHtml(payload.company || "Not provided");
  const safeService = escapeHtml(serviceLabel);
  const safeBudget = escapeHtml(budgetLabel);
  const safeLeadId = escapeHtml(payload.leadId || "N/A");
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br />");

  return {
    subject: singleLine(
      `New EliavaTech Quote / Consultation Request: ${payload.name}${
        payload.company ? ` (${payload.company})` : ""
      }`
    ),
    text: [
      `New quote / consultation request submitted on EliavaTech:`,
      ``,
      `Name: ${payload.name}`,
      `Business Email: ${payload.email}`,
      `Phone / WhatsApp: ${payload.phone || "Not provided"}`,
      `Company: ${payload.company || "Not provided"}`,
      `Package / Service: ${serviceLabel}`,
      `Estimated Budget Range: ${budgetLabel}`,
      `Reference ID: ${payload.leadId || "N/A"}`,
      ``,
      `Project Scope & Goals:`,
      payload.message,
    ].join("\n"),
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0b0d14; color: #f3f4f6; border-radius: 12px; border: 1px solid #1f2437;">
      <h2 style="margin: 0 0 16px; font-size: 20px; color: #ffffff;">New Request from ${safeName}</h2>
      <p style="margin: 0 0 6px; font-size: 14px;"><strong>Name:</strong> ${safeName}</p>
      <p style="margin: 0 0 6px; font-size: 14px;"><strong>Business Email:</strong> <a href="mailto:${safeEmail}" style="color: #8b7ffc;">${safeEmail}</a></p>
      <p style="margin: 0 0 6px; font-size: 14px;"><strong>Phone / WhatsApp:</strong> ${safePhone}</p>
      <p style="margin: 0 0 6px; font-size: 14px;"><strong>Company:</strong> ${safeCompany}</p>
      <p style="margin: 0 0 6px; font-size: 14px;"><strong>Package / Service:</strong> <span style="color: #f2b84b;">${safeService}</span></p>
      <p style="margin: 0 0 6px; font-size: 14px;"><strong>Estimated Budget Range:</strong> ${safeBudget}</p>
      <p style="margin: 0 0 16px; font-size: 14px;"><strong>Reference ID:</strong> ${safeLeadId}</p>
      <div style="padding: 14px; border-radius: 8px; background-color: #121624; border: 1px solid #1f2437;">
        <p style="margin: 0 0 6px; font-size: 12px; text-transform: uppercase; color: #9ca3af;">Project Scope &amp; Goals</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #f3f4f6;">${safeMessage}</p>
      </div>
    </div>`,
  };
}

function buildUserEmailContent(payload: LeadEmailPayload, serviceLabel: string, budgetLabel: string) {
  const safeName = escapeHtml(payload.name);
  const safeService = escapeHtml(serviceLabel);
  const safeBudget = escapeHtml(budgetLabel);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br />");

  return {
    subject: `We've received your request — EliavaTech`,
    text: [
      `Hi ${payload.name},`,
      ``,
      `Thank you for reaching out to EliavaTech! We have received your custom quote / consultation request and a co-founder is reviewing your project scope.`,
      ``,
      `What happens next:`,
      `- We will review your requirements and reply within 1 business day.`,
      `- We will share a tailored scope, timeline, and transparent investment breakdown.`,
      ``,
      `Summary of your request:`,
      `- Package / Service: ${serviceLabel}`,
      `- Estimated Budget Range: ${budgetLabel}`,
      `- Reference ID: ${payload.leadId || "Pending"}`,
      `- Project Scope & Goals:`,
      `  ${payload.message}`,
      ``,
      `If you would like to add any details, simply reply to this email or contact us at ${BUSINESS.email} / ${BUSINESS.phoneDisplay}.`,
      ``,
      `Warm regards,`,
      `The EliavaTech Team`,
    ].join("\n"),
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0b0d14; color: #f3f4f6; border-radius: 12px; border: 1px solid #1f2437;">
      <h2 style="margin: 0 0 12px; font-size: 20px; color: #ffffff;">Hi ${safeName}, we&rsquo;ve received your request.</h2>
      <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #d1d5db;">
        Thank you for contacting <strong>EliavaTech</strong>. A co-founder is reviewing your project requirements and will reply within <strong>one business day</strong> with a tailored scope, timeline, and investment breakdown.
      </p>
      <div style="padding: 16px; border-radius: 8px; background-color: #121624; border: 1px solid #1f2437; margin-bottom: 16px;">
        <p style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #8b7ffc; font-weight: 600;">Your Submitted Details</p>
        <p style="margin: 0 0 6px; font-size: 14px;"><strong>Package / Service:</strong> <span style="color: #f2b84b;">${safeService}</span></p>
        <p style="margin: 0 0 6px; font-size: 14px;"><strong>Estimated Budget Range:</strong> ${safeBudget}</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;"><strong>Project Scope &amp; Goals:</strong><br />${safeMessage}</p>
      </div>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
        Have additional context to share? Simply reply directly to this email or reach us at <a href="mailto:${BUSINESS.email}" style="color: #8b7ffc;">${BUSINESS.email}</a> / <strong>${BUSINESS.phoneDisplay}</strong>.<br /><br />
        Warm regards,<br />
        <strong style="color: #ffffff;">The EliavaTech Team</strong>
      </p>
    </div>`,
  };
}
/**
 * Sends the team notification and the visitor confirmation.
 *
 * Provider order: Gmail/SMTP when an app password is set, otherwise Resend.
 * Resend needs RESEND_FROM_EMAIL on a domain verified in Resend. The shared
 * `onboarding@resend.dev` test sender is only allowed outside production,
 * because it can only deliver to the Resend account owner.
 *
 * This function never throws: every failure is returned in `error`.
 */
export async function sendLeadNotificationEmail(
  payload: LeadEmailPayload
): Promise<LeadEmailResult> {
  const failed = (error: string): LeadEmailResult => ({
    sent: false,
    teamEmailSent: false,
    userEmailSent: false,
    error,
  });

  try {
    const notifyEmail = getEnvValue("NOTIFY_EMAIL") || BUSINESS.email;
    const smtpUser = getEnvValue("SMTP_USER") || notifyEmail;
    const smtpPass = (
      getEnvValue("GMAIL_APP_PASSWORD") || getEnvValue("SMTP_PASS")
    ).replace(/\s+/g, "");
    const resendApiKey = getEnvValue("RESEND_API_KEY");

    const serviceLabel = formatServiceLabel(payload.service);
    const budgetLabel = formatBudgetLabel(payload.budgetRange);
    const teamContent = buildTeamEmailContent(payload, serviceLabel, budgetLabel);
    const userContent = buildUserEmailContent(payload, serviceLabel, budgetLabel);

    type Sender = (msg: {
      to: string;
      replyTo: string;
      subject: string;
      text: string;
      html: string;
    }) => Promise<void>;

    const senders: Array<{ name: string; send: Sender }> = [];

    if (smtpPass) {
      const smtpHost = getEnvValue("SMTP_HOST");
      const smtpPort = Number(getEnvValue("SMTP_PORT") || "0");
      const transporter = nodemailer.createTransport(
        smtpHost
          ? {
              host: smtpHost,
              port: smtpPort > 0 ? smtpPort : 465,
              secure: smtpPort > 0 ? smtpPort === 465 : true,
              auth: { user: smtpUser, pass: smtpPass },
              connectionTimeout: 10_000,
              greetingTimeout: 10_000,
              socketTimeout: 15_000,
            }
          : {
              service: "gmail",
              auth: { user: smtpUser, pass: smtpPass },
              connectionTimeout: 10_000,
              greetingTimeout: 10_000,
              socketTimeout: 15_000,
            }
      );
      const from = `${BUSINESS.name} <${smtpUser}>`;
      senders.push({
        name: "SMTP",
        send: async (msg) => {
          await transporter.sendMail({ from, ...msg });
        },
      });
    }

    if (resendApiKey) {
      const configuredFrom = getEnvValue("RESEND_FROM_EMAIL");
      const isFreeMailbox = /@(gmail|yahoo|outlook|hotmail)\.com>?$/i.test(
        configuredFrom
      );
      const isTestSender =
        !configuredFrom ||
        isFreeMailbox ||
        /@resend\.dev>?$/i.test(configuredFrom);
      const from = isTestSender
        ? `${BUSINESS.name} <onboarding@resend.dev>`
        : configuredFrom;
      const resend = new Resend(resendApiKey);
      senders.push({
        name: "Resend",
        send: async (msg) => {
          const res = await resend.emails.send({
            from,
            to: [msg.to],
            replyTo: msg.replyTo,
            subject: msg.subject,
            text: msg.text,
            html: msg.html,
          });
          if (res.error) throw new Error(res.error.message);
        },
      });
    }

    if (senders.length === 0) {
      return failed(
        "No email provider configured: set GMAIL_APP_PASSWORD (with SMTP_USER) or RESEND_API_KEY."
      );
    }

    const errors: string[] = [];
    let teamEmailSent = false;
    let userEmailSent = false;

    for (const provider of senders) {
      if (!teamEmailSent) {
        try {
          await provider.send({
            to: notifyEmail,
            replyTo: payload.email,
            subject: teamContent.subject,
            text: teamContent.text,
            html: teamContent.html,
          });
          teamEmailSent = true;
        } catch (err) {
          errors.push(
            `Team email (${provider.name}) error: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        }
      }

      if (!userEmailSent) {
        try {
          await provider.send({
            to: payload.email,
            replyTo: notifyEmail,
            subject: userContent.subject,
            text: userContent.text,
            html: userContent.html,
          });
          userEmailSent = true;
        } catch (err) {
          errors.push(
            `Customer confirmation (${provider.name}) error: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        }
      }

      if (teamEmailSent && userEmailSent) break;
    }

    return {
      sent: teamEmailSent && userEmailSent,
      teamEmailSent,
      userEmailSent,
      error: errors.length > 0 ? errors.join("; ") : undefined,
    };
  } catch (err) {
    return failed(
      `Email setup error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}

export interface BookingEmailPayload {
  leadId?: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  notes?: string;
  formattedDate: string;
  formattedTimeIst: string;
  meetLink: string | null;
  addToGoogleCalendarUrl: string;
}

export async function sendBookingConfirmationEmail(
  payload: BookingEmailPayload
): Promise<LeadEmailResult> {
  const serviceLabel = formatServiceLabel(payload.service);
  const meetSection = payload.meetLink
    ? `Google Meet Link: ${payload.meetLink}`
    : "Google Meet Link: Will be shared in your Google Calendar invite.";

  const combinedMessage = [
    `Scheduled Date: ${payload.formattedDate}`,
    `Scheduled Time: ${payload.formattedTimeIst}`,
    meetSection,
    `Add to Google Calendar: ${payload.addToGoogleCalendarUrl}`,
    payload.notes ? `Notes: ${payload.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return sendLeadNotificationEmail({
    leadId: payload.leadId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    service: serviceLabel,
    budgetRange: `${payload.formattedDate} · ${payload.formattedTimeIst}`,
    message: combinedMessage,
    source: "booking",
  });
}
