import { NextRequest, NextResponse } from "next/server";
import { bookingDateQuerySchema } from "@/lib/booking-schema";
import { getAvailableSlotsForDate } from "@/lib/google-calendar";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = await checkRateLimit(`booking-slots:${ip}`, 30, 60 * 1000, ip);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many requests. Please wait ${rate.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date") ?? "";
    const parsed = bookingDateQuerySchema.safeParse({ date: dateParam });

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid date format. Expected YYYY-MM-DD.",
        },
        { status: 400 }
      );
    }

    const result = await getAvailableSlotsForDate(parsed.data.date);
    return NextResponse.json(
      {
        ok: true,
        ...result,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("[/api/booking/slots] Error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Could not load available slots right now.",
      },
      { status: 500 }
    );
  }
}
