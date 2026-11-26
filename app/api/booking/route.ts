import { NextRequest, NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/booking-schema";
import { createGoogleMeetBooking } from "@/lib/google-calendar";
import {
  formatServiceLabel,
  sendBookingConfirmationEmail,
} from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { verifyTurnstile } from "@/lib/turnstile";
import { prisma } from "@/lib/db";
import { BUSINESS } from "@/content/site";

const MAX_BODY_BYTES = 16_000;

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
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = await checkRateLimit(`booking:${ip}`, 5, 10 * 60 * 1000, ip);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many booking attempts. Please wait ${rate.retryAfterSeconds} seconds or contact us on WhatsApp.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const declaredLength = Number(req.headers.get("content-length") ?? "0");
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Request body is too large." },
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

    const honeypot = (rawBody as { website?: unknown }).website;
    if (typeof honeypot === "string" && honeypot.length > 0) {
      return NextResponse.json({
        ok: true,
        formattedDate: "Scheduled",
        formattedTimeIst: "Confirmed",
        meetLink: null,
        addToGoogleCalendarUrl: "https://calendar.google.com",
        googleCalendarSynced: false,
        userEmailSent: false,
      });
    }

    const parsed = bookingRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please check your booking details.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const turnstile = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstile.ok) {
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
    const serviceLabel = formatServiceLabel(data.service);
    const phone = data.phone || undefined;
    const notes = data.notes || undefined;

    const meeting = await createGoogleMeetBooking({
      date: data.date,
      slotTime: data.slotTime,
      name: data.name,
      email: data.email,
      phone,
      serviceLabel,
      notes,
    });

    if (!meeting.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            meeting.error ||
            "Could not schedule the selected time slot. Please choose another slot.",
        },
        { status: 409 }
      );
    }

    let savedLeadId: string | undefined;
    if (prisma) {
      try {
        const created = await prisma.lead.create({
          data: {
            name: data.name,
            email: data.email,
            phone: phone ?? null,
            company: null,
            service: data.service,
            budgetRange: `${meeting.formattedDate} · ${meeting.formattedTimeIst}`,
            message: [
              `Google Calendar Discovery Call: ${meeting.formattedDate} (${meeting.formattedTimeIst})`,
              meeting.meetLink ? `Google Meet: ${meeting.meetLink}` : "",
              notes ? `Notes: ${notes}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
            source: "booking",
            status: "new",
          },
        });
        savedLeadId = created.id;
      } catch (dbErr) {
        console.error("[/api/booking] Database save error:", dbErr);
      }
    }

    const [emailResult, webhookSent] = await Promise.all([
      sendBookingConfirmationEmail({
        leadId: savedLeadId,
        name: data.name,
        email: data.email,
        phone,
        service: data.service,
        notes,
        formattedDate: meeting.formattedDate,
        formattedTimeIst: meeting.formattedTimeIst,
        meetLink: meeting.meetLink,
        addToGoogleCalendarUrl: meeting.addToGoogleCalendarUrl,
      }),
      postWebhook({
        type: "google_calendar_booking",
        leadId: savedLeadId ?? null,
        name: data.name,
        email: data.email,
        phone: phone ?? null,
        service: data.service,
        notes: notes ?? null,
        date: data.date,
        slotTime: data.slotTime,
        formattedDate: meeting.formattedDate,
        formattedTimeIst: meeting.formattedTimeIst,
        meetLink: meeting.meetLink,
        calendarEventUrl: meeting.calendarEventUrl,
        addToGoogleCalendarUrl: meeting.addToGoogleCalendarUrl,
        googleCalendarSynced: meeting.googleCalendarSynced,
        createdAt: new Date().toISOString(),
      }),
    ]);

    const delivered =
      meeting.googleCalendarSynced ||
      Boolean(savedLeadId) ||
      emailResult.teamEmailSent ||
      webhookSent;

    if (!delivered) {
      return NextResponse.json(
        {
          ok: false,
          error: `We could not complete your booking right now. Please message us on WhatsApp or email ${BUSINESS.email}.`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      leadId: savedLeadId ?? null,
      formattedDate: meeting.formattedDate,
      formattedTimeIst: meeting.formattedTimeIst,
      meetLink: meeting.meetLink,
      calendarEventUrl: meeting.calendarEventUrl,
      addToGoogleCalendarUrl: meeting.addToGoogleCalendarUrl,
      googleCalendarSynced: meeting.googleCalendarSynced,
      userEmailSent: emailResult.userEmailSent,
    });
  } catch (err) {
    console.error("[/api/booking] Unexpected error:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong while scheduling your call. Please try again or reach us on WhatsApp.",
      },
      { status: 500 }
    );
  }
}
