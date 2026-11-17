import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact-schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { verifyTurnstile } from "@/lib/turnstile";
import { prisma } from "@/lib/db";
import { sendLeadNotificationEmail } from "@/lib/email";
import { BUSINESS } from "@/content/site";

const MAX_BODY_BYTES = 20_000;

const DELIVERY_FAILED_MESSAGE = `We could not submit your request right now. Please message us on WhatsApp or email ${BUSINESS.email}.`;

async function postWebhook(payload: Record<string, unknown>): Promise<boolean> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
  if (!webhookUrl) return false;
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`[/api/contact] n8n webhook responded ${res.status}`);
    }
    return res.ok;
  } catch (err) {
    console.error("[/api/contact] n8n webhook error:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = await checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000, ip);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many submissions. Please wait ${rate.retryAfterSeconds} seconds or contact us on WhatsApp.`,
        },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    const declaredLength = Number(req.headers.get("content-length") ?? "0");
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Your message is too large." },
        { status: 413 }
      );
    }

    const rawBody: unknown = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    // Silent honeypot: a bot filled the hidden field. Pretend success, store nothing.
    const honeypot = (rawBody as { website?: unknown }).website;
    if (typeof honeypot === "string" && honeypot.length > 0) {
      return NextResponse.json({
        ok: true,
        message: "Thank you. We will reply within one business day.",
      });
    }

    const parsed = contactFormSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please check the highlighted form fields.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Spam protection applies to every form that posts here (contact + pricing).
    const turnstile = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstile.ok) {
      if (turnstile.reason === "missing_secret") {
        return NextResponse.json(
          { ok: false, error: DELIVERY_FAILED_MESSAGE },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          ok: false,
          error:
            turnstile.reason === "unavailable"
              ? "We could not run the spam check right now. Please try again in a moment."
              : "Spam protection check failed. Please complete the check and try again.",
        },
        { status: 400 }
      );
    }

    const source = data.source ?? "contact";
    const phone = data.phone || undefined;
    const company = data.company || undefined;

    // 1. Save the lead (the database is optional; failures are logged, not fatal).
    let savedLeadId: string | undefined;
    if (prisma) {
      try {
        const created = await prisma.lead.create({
          data: {
            name: data.name,
            email: data.email,
            phone: phone ?? null,
            company: company ?? null,
            service: data.service,
            budgetRange: data.budgetRange,
            message: data.message,
            source: "form",
            status: "new",
          },
        });
        savedLeadId = created.id;
      } catch (dbErr) {
        console.error("[/api/contact] Database save error:", dbErr);
      }
    }
    const dbSaved = Boolean(savedLeadId);

    // 2. Notify the team and confirm to the visitor, and 3. call the webhook.
    const [emailResult, webhookSent] = await Promise.all([
      sendLeadNotificationEmail({
        leadId: savedLeadId,
        name: data.name,
        email: data.email,
        phone,
        company,
        service: data.service,
        budgetRange: data.budgetRange,
        message: data.message,
        source,
      }),
      postWebhook({
        id: savedLeadId ?? null,
        name: data.name,
        email: data.email,
        phone: phone ?? null,
        company: company ?? null,
        service: data.service,
        budgetRange: data.budgetRange,
        message: data.message,
        source,
        createdAt: new Date().toISOString(),
      }),
    ]);

    if (emailResult.error) {
      console.warn("[/api/contact] Email warning:", emailResult.error);
    }

    // The enquiry counts as received if it reached us by any channel. Failing the
    // request when only the visitor's confirmation bounced would make them
    // resubmit and create duplicate leads.
    const received = dbSaved || emailResult.teamEmailSent || webhookSent;
    if (!received) {
      console.error("[/api/contact] Enquiry not delivered by any channel.", {
        dbConfigured: Boolean(prisma),
        emailError: emailResult.error,
      });
      return NextResponse.json(
        { ok: false, error: DELIVERY_FAILED_MESSAGE },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      leadId: savedLeadId ?? null,
      dbSaved,
      teamEmailSent: emailResult.teamEmailSent,
      // The UI only tells the visitor "we emailed you" when this is true.
      userEmailSent: emailResult.userEmailSent,
      webhookSent,
      message:
        "Thank you. We have received your enquiry and will reply within one business day.",
    });
  } catch (err) {
    console.error("[/api/contact] Unexpected error:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong while submitting your request. Please try again or reach us on WhatsApp.",
      },
      { status: 500 }
    );
  }
}
