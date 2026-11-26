import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { BUSINESS } from "@/content/site";

export const IST_TIMEZONE = "Asia/Kolkata";
export const IST_OFFSET = "+05:30";
export const SLOT_DURATION_MINUTES = 30;

// Working hours in IST: Monday (1) through Saturday (6), 10:00 AM to 7:00 PM IST
const WORK_START_HOUR = 10;
const WORK_END_HOUR = 19; // last 30-min slot starts at 18:30

export interface TimeSlot {
  time: string;
  label: string;
  startIso: string;
  endIso: string;
  available: boolean;
}

export interface AvailableSlotsResult {
  date: string;
  timezone: string;
  googleConnected: boolean;
  isWorkingDay: boolean;
  slots: TimeSlot[];
}

export interface CreateMeetingInput {
  date: string;
  slotTime: string;
  name: string;
  email: string;
  phone?: string;
  serviceLabel: string;
  notes?: string;
}

export interface CreateMeetingResult {
  ok: boolean;
  error?: string;
  startIso: string;
  endIso: string;
  formattedDate: string;
  formattedTimeIst: string;
  meetLink: string | null;
  calendarEventUrl: string | null;
  addToGoogleCalendarUrl: string;
  eventId: string | null;
  googleCalendarSynced: boolean;
}

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
    // ignore if .env.local does not exist
  }
  return "";
}

function getGoogleCredentials() {
  const clientId = getEnvValue("GOOGLE_CLIENT_ID");
  const clientSecret = getEnvValue("GOOGLE_CLIENT_SECRET");
  const refreshToken = getEnvValue("GOOGLE_REFRESH_TOKEN");
  const calendarId =
    getEnvValue("GOOGLE_CALENDAR_ID") ||
    getEnvValue("NOTIFY_EMAIL") ||
    "primary";

  const configured = Boolean(clientId && clientSecret && refreshToken);
  return {
    configured,
    clientId,
    clientSecret,
    refreshToken,
    calendarId,
  };
}

async function getGoogleAccessToken(): Promise<string | null> {
  const creds = getGoogleCredentials();
  if (!creds.configured) return null;

  try {
    const body = new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: creds.refreshToken,
      grant_type: "refresh_token",
    });

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(
        `[google-calendar] OAuth2 token refresh failed (${res.status}):`,
        errText
      );
      return null;
    }

    const data = (await res.json()) as { access_token?: string };
    return data.access_token || null;
  } catch (err) {
    console.error("[google-calendar] OAuth2 token error:", err);
    return null;
  }
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function format12HourLabel(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${pad2(minute)} ${period}`;
}

export function buildSlotTimestamps(dateStr: string, slotTime: string) {
  const [hStr, mStr] = slotTime.split(":");
  const hour = Number(hStr);
  const minute = Number(mStr);

  const startIso = `${dateStr}T${pad2(hour)}:${pad2(minute)}:00${IST_OFFSET}`;
  const totalEndMinutes = hour * 60 + minute + SLOT_DURATION_MINUTES;
  const endHour = Math.floor(totalEndMinutes / 60);
  const endMinute = totalEndMinutes % 60;
  const endIso = `${dateStr}T${pad2(endHour)}:${pad2(endMinute)}:00${IST_OFFSET}`;

  const startLabel = format12HourLabel(hour, minute);
  const endLabel = format12HourLabel(endHour, endMinute);

  return {
    startIso,
    endIso,
    startMs: new Date(startIso).getTime(),
    endMs: new Date(endIso).getTime(),
    formattedTimeIst: `${startLabel} – ${endLabel} IST`,
  };
}

export function formatReadableDate(dateStr: string): string {
  try {
    const dt = new Date(`${dateStr}T12:00:00${IST_OFFSET}`);
    return dt.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: IST_TIMEZONE,
    });
  } catch {
    return dateStr;
  }
}

function toGoogleCalendarUtcFormat(isoString: string): string {
  return new Date(isoString)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function buildAddToGoogleCalendarUrl(params: {
  title: string;
  startIso: string;
  endIso: string;
  details: string;
  location?: string;
}): string {
  const dates = `${toGoogleCalendarUtcFormat(
    params.startIso
  )}/${toGoogleCalendarUtcFormat(params.endIso)}`;
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", params.title);
  url.searchParams.set("dates", dates);
  url.searchParams.set("details", params.details);
  if (params.location) {
    url.searchParams.set("location", params.location);
  }
  url.searchParams.set("ctz", IST_TIMEZONE);
  return url.toString();
}

function generateCandidateSlotsForDay(dateStr: string): TimeSlot[] {
  const dt = new Date(`${dateStr}T12:00:00${IST_OFFSET}`);
  if (Number.isNaN(dt.getTime())) return [];

  // Sunday (0) is closed; Monday (1) – Saturday (6) are open
  const dayOfWeek = dt.getUTCDay();
  if (dayOfWeek === 0) return [];

  // Minimum lead time: 2 hours from now
  const minBookableMs = Date.now() + 2 * 60 * 60 * 1000;
  const slots: TimeSlot[] = [];

  for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
    for (const minute of [0, 30]) {
      const time = `${pad2(hour)}:${pad2(minute)}`;
      const { startIso, endIso, startMs } = buildSlotTimestamps(dateStr, time);
      const isFuture = startMs >= minBookableMs;

      slots.push({
        time,
        label: format12HourLabel(hour, minute),
        startIso,
        endIso,
        available: isFuture,
      });
    }
  }

  return slots;
}

interface BusyInterval {
  startMs: number;
  endMs: number;
}

async function fetchGoogleBusyIntervals(
  dateStr: string,
  accessToken: string,
  calendarId: string
): Promise<BusyInterval[]> {
  const timeMin = `${dateStr}T00:00:00${IST_OFFSET}`;
  const timeMax = `${dateStr}T23:59:59${IST_OFFSET}`;

  try {
    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/freeBusy",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          timeZone: IST_TIMEZONE,
          items: [{ id: calendarId }],
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(
        `[google-calendar] freeBusy query failed (${res.status}):`,
        errText
      );
      return [];
    }

    const data = (await res.json()) as {
      calendars?: Record<
        string,
        { busy?: Array<{ start: string; end: string }> }
      >;
    };

    const calendarData =
      data.calendars?.[calendarId] ||
      Object.values(data.calendars ?? {})[0];
    const busyList = calendarData?.busy ?? [];

    return busyList
      .map((item) => ({
        startMs: new Date(item.start).getTime(),
        endMs: new Date(item.end).getTime(),
      }))
      .filter(
        (b) => !Number.isNaN(b.startMs) && !Number.isNaN(b.endMs)
      );
  } catch (err) {
    console.error("[google-calendar] freeBusy fetch error:", err);
    return [];
  }
}

export async function getAvailableSlotsForDate(
  dateStr: string
): Promise<AvailableSlotsResult> {
  const candidates = generateCandidateSlotsForDay(dateStr);
  const isWorkingDay = candidates.length > 0;
  const creds = getGoogleCredentials();

  if (!isWorkingDay) {
    return {
      date: dateStr,
      timezone: IST_TIMEZONE,
      googleConnected: creds.configured,
      isWorkingDay: false,
      slots: [],
    };
  }

  const accessToken = await getGoogleAccessToken();
  if (!accessToken) {
    return {
      date: dateStr,
      timezone: IST_TIMEZONE,
      googleConnected: false,
      isWorkingDay: true,
      slots: candidates,
    };
  }

  const busyIntervals = await fetchGoogleBusyIntervals(
    dateStr,
    accessToken,
    creds.calendarId
  );

  const slots = candidates.map((slot) => {
    if (!slot.available) return slot;
    const slotStartMs = new Date(slot.startIso).getTime();
    const slotEndMs = new Date(slot.endIso).getTime();

    const overlapsBusy = busyIntervals.some(
      (busy) => slotStartMs < busy.endMs && slotEndMs > busy.startMs
    );

    return {
      ...slot,
      available: !overlapsBusy,
    };
  });

  return {
    date: dateStr,
    timezone: IST_TIMEZONE,
    googleConnected: true,
    isWorkingDay: true,
    slots,
  };
}

export async function createGoogleMeetBooking(
  input: CreateMeetingInput
): Promise<CreateMeetingResult> {
  const { startIso, endIso, startMs, endMs, formattedTimeIst } =
    buildSlotTimestamps(input.date, input.slotTime);
  const formattedDate = formatReadableDate(input.date);

  if (Number.isNaN(startMs) || startMs < Date.now() + 30 * 60 * 1000) {
    return {
      ok: false,
      error:
        "This time slot is in the past or too soon to book. Please pick another slot.",
      startIso,
      endIso,
      formattedDate,
      formattedTimeIst,
      meetLink: null,
      calendarEventUrl: null,
      addToGoogleCalendarUrl: "",
      eventId: null,
      googleCalendarSynced: false,
    };
  }

  const summary = `EliavaTech Discovery Call — ${input.name}`;
  const descriptionLines = [
    `30-Minute Discovery & Architecture Call with ${BUSINESS.name}`,
    ``,
    `Client: ${input.name}`,
    `Email: ${input.email}`,
    `Phone / WhatsApp: ${input.phone || "Not provided"}`,
    `Service Topic: ${input.serviceLabel}`,
    input.notes ? `Project Notes: ${input.notes}` : "",
    ``,
    `Questions or need to reschedule? Contact ${BUSINESS.email} or ${BUSINESS.phoneDisplay}.`,
  ].filter(Boolean);
  const description = descriptionLines.join("\n");

  const creds = getGoogleCredentials();
  const accessToken = await getGoogleAccessToken();

  let meetLink: string | null = null;
  let calendarEventUrl: string | null = null;
  let eventId: string | null = null;
  let googleCalendarSynced = false;

  if (accessToken) {
    const busyIntervals = await fetchGoogleBusyIntervals(
      input.date,
      accessToken,
      creds.calendarId
    );
    const isTaken = busyIntervals.some(
      (busy) => startMs < busy.endMs && endMs > busy.startMs
    );
    if (isTaken) {
      return {
        ok: false,
        error:
          "This slot was just booked. Please select another available time slot.",
        startIso,
        endIso,
        formattedDate,
        formattedTimeIst,
        meetLink: null,
        calendarEventUrl: null,
        addToGoogleCalendarUrl: "",
        eventId: null,
        googleCalendarSynced: true,
      };
    }

    try {
      const notifyEmail = getEnvValue("NOTIFY_EMAIL") || BUSINESS.email;
      const calendarPath = encodeURIComponent(creds.calendarId);
      const insertUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarPath}/events?conferenceDataVersion=1&sendUpdates=all`;

      const eventBody = {
        summary,
        description,
        start: {
          dateTime: startIso,
          timeZone: IST_TIMEZONE,
        },
        end: {
          dateTime: endIso,
          timeZone: IST_TIMEZONE,
        },
        attendees: [
          { email: input.email, displayName: input.name },
          { email: notifyEmail, displayName: BUSINESS.name },
        ],
        conferenceData: {
          createRequest: {
            requestId: `eliava_${Date.now()}_${crypto
              .randomBytes(4)
              .toString("hex")}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 120 },
            { method: "popup", minutes: 30 },
          ],
        },
      };

      const res = await fetch(insertUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventBody),
        signal: AbortSignal.timeout(10_000),
      });

      if (res.ok) {
        const created = (await res.json()) as {
          id?: string;
          htmlLink?: string;
          hangoutLink?: string;
          conferenceData?: {
            entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
          };
        };

        eventId = created.id || null;
        calendarEventUrl = created.htmlLink || null;
        const videoEntry = created.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === "video" && ep.uri
        );
        meetLink = created.hangoutLink || videoEntry?.uri || null;
        googleCalendarSynced = true;
      } else {
        const errText = await res.text().catch(() => "");
        console.error(
          `[google-calendar] Event insert failed (${res.status}):`,
          errText
        );
      }
    } catch (err) {
      console.error("[google-calendar] Event creation error:", err);
    }
  }

  if (!meetLink) {
    const fallbackMeet = getEnvValue("GOOGLE_MEET_FALLBACK_URL");
    if (fallbackMeet) {
      meetLink = fallbackMeet;
    }
  }

  const addToGoogleCalendarUrl = buildAddToGoogleCalendarUrl({
    title: summary,
    startIso,
    endIso,
    details: meetLink
      ? `${description}\n\nJoin Google Meet: ${meetLink}`
      : description,
    location: meetLink || "Google Meet",
  });

  return {
    ok: true,
    startIso,
    endIso,
    formattedDate,
    formattedTimeIst,
    meetLink,
    calendarEventUrl,
    addToGoogleCalendarUrl,
    eventId,
    googleCalendarSynced,
  };
}

