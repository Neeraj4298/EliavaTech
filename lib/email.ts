import fs from "node:fs";
import path from "node:path";
import { Resend } from "resend";
import nodemailer from "nodemailer";

function getEnvValue(key: string): string {
  const fromProc = process.env[key]?.trim();
  if (fromProc) return fromProc;
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
        return trimmed
          .slice(eqIdx + 1)
          .trim()
          .replace(/^["']|["']$/g, "");
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatServiceLabel(service?: string): string {
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
    subject: `New EliavaTech Quote / Consultation Request: ${payload.name}${
      payload.company ? ` (${payload.company})` : ""
    }`,
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
      `If you would like to add any details, simply reply to this email or contact us at supporteliavatech@gmail.com / +91 70754 66449.`,
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
        Have additional context to share? Simply reply directly to this email or reach us at <a href="mailto:supporteliavatech@gmail.com" style="color: #8b7ffc;">supporteliavatech@gmail.com</a> / <strong>+91 70754 66449</strong>.<br /><br />
        Warm regards,<br />
        <strong style="color: #ffffff;">The EliavaTech Team</strong>
      </p>
    </div>`,
  };
}
export async function sendLeadNotificationEmail(
  payload: LeadEmailPayload
): Promise<LeadEmailResult> {
  const notifyEmail =
    getEnvValue("NOTIFY_EMAIL") || "supporteliavatech@gmail.com";
  const smtpUser =
    getEnvValue("SMTP_USER") || notifyEmail || "supporteliavatech@gmail.com";
  const rawSmtpPass =
    getEnvValue("GMAIL_APP_PASSWORD") || getEnvValue("SMTP_PASS");
  const smtpPass = rawSmtpPass.replace(/\s+/g, "");
  const resendApiKey = getEnvValue("RESEND_API_KEY");

  const serviceLabel = formatServiceLabel(payload.service);
  const budgetLabel = formatBudgetLabel(payload.budgetRange);
  const teamContent = buildTeamEmailContent(payload, serviceLabel, budgetLabel);
  const userContent = buildUserEmailContent(payload, serviceLabel, budgetLabel);

  // 1. Prefer Gmail / SMTP when GMAIL_APP_PASSWORD or SMTP_PASS is configured
  // (Allows sending to ANY user email address like neerajlocker@gmail.com without custom domain restrictions)
  if (smtpPass) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const fromAddress = `EliavaTech <${smtpUser}>`;
    let teamEmailSent = false;
    let userEmailSent = false;
    const errors: string[] = [];

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: notifyEmail,
        replyTo: payload.email,
        subject: teamContent.subject,
        text: teamContent.text,
        html: teamContent.html,
      });
      teamEmailSent = true;
    } catch (err) {
      errors.push(
        `Team email SMTP error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: payload.email,
        replyTo: notifyEmail,
        subject: userContent.subject,
        text: userContent.text,
        html: userContent.html,
      });
      userEmailSent = true;
    } catch (err) {
      errors.push(
        `User confirmation SMTP error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }

    return {
      sent: teamEmailSent && userEmailSent,
      teamEmailSent,
      userEmailSent,
      error: errors.length > 0 ? errors.join("; ") : undefined,
    };
  }

  // 2. Fallback to Resend if RESEND_API_KEY is configured
  if (!resendApiKey) {
    return {
      sent: false,
      teamEmailSent: false,
      userEmailSent: false,
      error:
        "Email credentials missing in .env.local. Add GMAIL_APP_PASSWORD (for supporteliavatech@gmail.com) or RESEND_API_KEY to .env.local and restart the dev server.",
    };
  }

  const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim();
  const fromEmail =
    configuredFrom && !configuredFrom.toLowerCase().endsWith("@gmail.com")
      ? configuredFrom
      : "EliavaTech <onboarding@resend.dev>";

  const resend = new Resend(resendApiKey);
  let teamEmailSent = false;
  let userEmailSent = false;
  const errors: string[] = [];

  try {
    const teamRes = await resend.emails.send({
      from: fromEmail,
      to: [notifyEmail],
      replyTo: payload.email,
      subject: teamContent.subject,
      text: teamContent.text,
      html: teamContent.html,
    });
    if (teamRes.error) {
      errors.push(`Team email error: ${teamRes.error.message}`);
    } else {
      teamEmailSent = true;
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : "Unknown team email error");
  }

  try {
    const userRes = await resend.emails.send({
      from: fromEmail,
      to: [payload.email],
      replyTo: notifyEmail,
      subject: userContent.subject,
      text: userContent.text,
      html: userContent.html,
    });
    if (userRes.error) {
      errors.push(`User confirmation email error: ${userRes.error.message}`);
    } else {
      userEmailSent = true;
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : "Unknown user email error");
  }

  return {
    sent: teamEmailSent && userEmailSent,
    teamEmailSent,
    userEmailSent,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
}
