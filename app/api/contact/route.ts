import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact-schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";
import { sendLeadNotificationEmail } from "@/lib/email";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
}

async function verifyTurnstileToken(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // If TURNSTILE_SECRET_KEY is not configured yet, skip external verification in dev
  if (!secret) return true;
  if (!token) return false;

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);
    if (ip !== "unknown") {
      formData.append("remoteip", ip);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      }
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many submissions. Please wait ${rate.retryAfterSeconds} seconds or contact us on WhatsApp.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    // Silent honeypot check: if bot filled `website`, return 200 without storing
    if (typeof (rawBody as { website?: string }).website === "string" && (rawBody as { website?: string }).website!.length > 0) {
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

    // Verify Cloudflare Turnstile when TURNSTILE_SECRET_KEY is set
    const turnstileOk = await verifyTurnstileToken(data.turnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json(
        {
          ok: false,
          error: "Spam protection verification failed. Please refresh and try again.",
        },
        { status: 400 }
      );
    }

    // 1. Save Lead to PostgreSQL via Prisma (gracefully handle missing/offline DB)
    let savedLeadId: string | undefined;
    let dbSaved = false;

    if (prisma) {
      try {
        const created = await prisma.lead.create({
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            service: data.service,
            budgetRange: data.budgetRange,
            message: data.message,
            source: "form",
            status: "new",
          },
        });
        savedLeadId = created.id;
        dbSaved = true;
      } catch (dbErr) {
        console.error("[/api/contact] Database save error:", dbErr);
      }
    }

    // 2. Send Email Notification via Resend
    const emailResult = await sendLeadNotificationEmail({
      leadId: savedLeadId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      budgetRange: data.budgetRange,
      message: data.message,
    });

    // 3. Call N8N_WEBHOOK_URL if set
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    let webhookSent = false;
    if (webhookUrl) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const whRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: savedLeadId ?? null,
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            service: data.service,
            budgetRange: data.budgetRange,
            message: data.message,
            source: "form",
            createdAt: new Date().toISOString(),
          }),
          signal: controller.signal,
        });
        clearTimeout(timer);
        webhookSent = whRes.ok;
      } catch (whErr) {
        console.error("[/api/contact] n8n webhook error:", whErr);
      }
    }

    return NextResponse.json({
      ok: true,
      leadId: savedLeadId ?? null,
      dbSaved,
      emailSent: emailResult.sent,
      webhookSent,
      message: "Thank you. We have received your enquiry and will reply within one business day.",
    });
  } catch (err) {
    console.error("[/api/contact] Unexpected error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while submitting your request. Please try again or reach us on WhatsApp.",
      },
      { status: 500 }
    );
  }
}
