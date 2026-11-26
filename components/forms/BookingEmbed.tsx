"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Loader2,
  RotateCcw,
  Video,
  X,
} from "lucide-react";
import { SERVICE_OPTIONS } from "@/lib/contact-schema";
import { trackBookingClick, trackFormSubmission } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  TurnstileWidget,
  resetTurnstileWidget,
} from "@/components/forms/TurnstileWidget";
import { cn } from "@/lib/utils";

const BOOKING_TURNSTILE_ID = "google-calendar-booking-turnstile";
const DAYS_PER_PAGE = 6;

export interface BookingEmbedProps {
  className?: string;
}

interface DayOption {
  dateStr: string;
  weekdayShort: string;
  dayNumber: string;
  monthShort: string;
  fullLabel: string;
}

interface SlotItem {
  time: string;
  label: string;
  startIso: string;
  endIso: string;
  available: boolean;
}

interface BookingConfirmation {
  name: string;
  email: string;
  formattedDate: string;
  formattedTimeIst: string;
  meetLink: string | null;
  calendarEventUrl: string | null;
  addToGoogleCalendarUrl: string;
  googleCalendarSynced: boolean;
  userEmailSent: boolean;
}

function buildUpcomingBusinessDays(count = 18): DayOption[] {
  const days: DayOption[] = [];
  const now = new Date();
  let cursor = new Date(now.getTime());

  while (days.length < count) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    }).formatToParts(cursor);

    const year = parts.find((p) => p.type === "year")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";

    const dateStr = `${year}-${month}-${day}`;
    const isSunday = weekday.toLowerCase().startsWith("sun");

    if (!isSunday && !days.some((d) => d.dateStr === dateStr)) {
      const monthShort = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        month: "short",
      }).format(cursor);

      days.push({
        dateStr,
        weekdayShort: weekday,
        dayNumber: day,
        monthShort,
        fullLabel: `${weekday}, ${day} ${monthShort}`,
      });
    }

    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  }

  return days;
}

function formatDayOptionFromDateStr(dateStr: string): DayOption {
  const dt = new Date(`${dateStr}T12:00:00+05:30`);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(dt);

  const day = parts.find((p) => p.type === "day")?.value ?? dateStr.slice(8, 10);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const monthShort = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
  }).format(dt);
  const year = parts.find((p) => p.type === "year")?.value ?? dateStr.slice(0, 4);

  return {
    dateStr,
    weekdayShort: weekday,
    dayNumber: day,
    monthShort,
    fullLabel: `${weekday}, ${day} ${monthShort} ${year}`,
  };
}

function getTodayIstInfo() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const yearStr = parts.find((p) => p.type === "year")?.value ?? "2026";
  const monthStr = parts.find((p) => p.type === "month")?.value ?? "01";
  const dayStr = parts.find((p) => p.type === "day")?.value ?? "01";

  return {
    year: Number(yearStr),
    month0: Number(monthStr) - 1,
    dateStr: `${yearStr}-${monthStr}-${dayStr}`,
  };
}

interface CalendarCell {
  dateStr: string;
  dayNumber: number;
  isPast: boolean;
  isSunday: boolean;
  isToday: boolean;
  disabled: boolean;
}

function buildCalendarMonthGrid(
  year: number,
  month0: number,
  todayDateStr: string
): {
  monthTitle: string;
  leadingEmptyCount: number;
  cells: CalendarCell[];
} {
  const firstDayUtc = new Date(Date.UTC(year, month0, 1, 12, 0, 0));
  const monthTitle = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(firstDayUtc);

  const leadingEmptyCount = firstDayUtc.getUTCDay(); // 0 (Sun) .. 6 (Sat)
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const monthPadded = String(month0 + 1).padStart(2, "0");

  const cells: CalendarCell[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayPadded = String(d).padStart(2, "0");
    const dateStr = `${year}-${monthPadded}-${dayPadded}`;
    const dow = new Date(Date.UTC(year, month0, d, 12, 0, 0)).getUTCDay();
    const isPast = dateStr < todayDateStr;
    const isSunday = dow === 0;
    const isToday = dateStr === todayDateStr;

    cells.push({
      dateStr,
      dayNumber: d,
      isPast,
      isSunday,
      isToday,
      disabled: isPast || isSunday,
    });
  }

  return { monthTitle, leadingEmptyCount, cells };
}

export function BookingEmbed({ className }: BookingEmbedProps) {
  const todayIst = React.useMemo(() => getTodayIstInfo(), []);
  const days = React.useMemo(() => buildUpcomingBusinessDays(30), []);
  const [dayPage, setDayPage] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState<string>(
    () => days[0]?.dateStr ?? ""
  );
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState<number>(() => todayIst.year);
  const [viewMonth0, setViewMonth0] = React.useState<number>(
    () => todayIst.month0
  );
  const [monthDir, setMonthDir] = React.useState<1 | -1>(1);
  const [slots, setSlots] = React.useState<SlotItem[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState<boolean>(true);
  const [slotsError, setSlotsError] = React.useState<string | null>(null);
  const [selectedSlotTime, setSelectedSlotTime] = React.useState<string>("");

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [service, setService] = React.useState("web-development");
  const [notes, setNotes] = React.useState("");
  const [turnstileToken, setTurnstileToken] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState<BookingConfirmation | null>(
    null
  );
  const [copiedMeet, setCopiedMeet] = React.useState(false);

  const fetchSlotsForDate = React.useCallback(async (dateStr: string) => {
    if (!dateStr) return;

    try {
      const res = await fetch(
        `/api/booking/slots?date=${encodeURIComponent(dateStr)}`,
        { cache: "no-store" }
      );
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        slots?: SlotItem[];
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        setSlotsError(
          data?.error || "Could not load available slots for this date."
        );
        setSlots([]);
      } else {
        const list = data.slots ?? [];
        setSlots(list);
        setSlotsError(null);
        const firstFree = list.find((s) => s.available);
        setSelectedSlotTime(firstFree ? firstFree.time : "");
      }
    } catch {
      setSlotsError("Network error while checking calendar availability.");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleSelectDate = (dateStr: string) => {
    if (dateStr === selectedDate) return;
    setSelectedDate(dateStr);
    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedSlotTime("");
  };

  React.useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    void (async () => {
      if (cancelled) return;
      await fetchSlotsForDate(selectedDate);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, fetchSlotsForDate]);


  React.useEffect(() => {
    if (!calendarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCalendarOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [calendarOpen]);

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!selectedDate || !selectedSlotTime) {
      setSubmitError("Please select an available date and 30-minute time slot.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          slotTime: selectedSlotTime,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          service,
          notes: notes.trim(),
          website: "",
          turnstileToken,
        }),
      });

      const payload = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string[] | undefined>;
        formattedDate?: string;
        formattedTimeIst?: string;
        meetLink?: string | null;
        calendarEventUrl?: string | null;
        addToGoogleCalendarUrl?: string;
        googleCalendarSynced?: boolean;
        userEmailSent?: boolean;
      } | null;

      if (!res.ok || !payload?.ok) {
        const firstFieldErr = payload?.fieldErrors
          ? Object.values(payload.fieldErrors).flat().find(Boolean)
          : undefined;
        setSubmitError(
          firstFieldErr ||
            payload?.error ||
            "Could not complete your booking right now. Please try another slot."
        );
        setTurnstileToken("");
        resetTurnstileWidget(BOOKING_TURNSTILE_ID);
        if (res.status === 409) {
          fetchSlotsForDate(selectedDate);
        }
        setIsSubmitting(false);
        return;
      }

      trackFormSubmission("google_calendar_booking", service);
      trackBookingClick(`${selectedDate} ${selectedSlotTime}`);

      setConfirmed({
        name: name.trim(),
        email: email.trim(),
        formattedDate: payload.formattedDate || selectedDate,
        formattedTimeIst: payload.formattedTimeIst || selectedSlotTime,
        meetLink: payload.meetLink ?? null,
        calendarEventUrl: payload.calendarEventUrl ?? null,
        addToGoogleCalendarUrl:
          payload.addToGoogleCalendarUrl || "https://calendar.google.com",
        googleCalendarSynced: payload.googleCalendarSynced === true,
        userEmailSent: payload.userEmailSent === true,
      });
      setIsSubmitting(false);
    } catch {
      setSubmitError(
        "Network error while scheduling your Google Meet call. Please check your connection and try again."
      );
      setTurnstileToken("");
      resetTurnstileWidget(BOOKING_TURNSTILE_ID);
      setIsSubmitting(false);
    }
  };

  const handleCopyMeetLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedMeet(true);
      window.setTimeout(() => setCopiedMeet(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  if (confirmed) {
    return (
      <Card
        variant="elevated"
        padding="lg"
        className={cn("border-success/50 space-y-5", className)}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 strokeWidth={1.5} className="h-6 w-6" />
            </span>
            <div>
              <p className="font-mono text-xs font-medium text-success">
                Google Calendar &amp; Google Meet Scheduled
              </p>
              <h2 className="font-heading text-xl font-semibold text-text">
                Discovery Call Confirmed
              </h2>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw strokeWidth={1.5} className="h-3.5 w-3.5" />}
            onClick={() => {
              setConfirmed(null);
              fetchSlotsForDate(selectedDate);
            }}
          >
            Book Another
          </Button>
        </div>

        <div className="rounded-input border border-border bg-surface p-4 space-y-2.5 text-small">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-text-muted">Date &amp; Time (IST):</span>
            <span className="font-mono font-semibold text-text">
              {confirmed.formattedDate} · {confirmed.formattedTimeIst}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-text-muted">Attendee:</span>
            <span className="font-medium text-text">
              {confirmed.name} ({confirmed.email})
            </span>
          </div>
          {confirmed.meetLink && (
            <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-primary">
                <Video strokeWidth={1.5} className="h-4 w-4" />
                <span>{confirmed.meetLink}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopyMeetLink(confirmed.meetLink!)}
                className="inline-flex items-center gap-1 rounded-pill border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-text hover:border-primary/50"
              >
                {copiedMeet ? (
                  <>
                    <Check strokeWidth={1.5} className="h-3.5 w-3.5 text-success" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy strokeWidth={1.5} className="h-3.5 w-3.5 text-text-muted" />
                    <span>Copy Meet Link</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-text-muted leading-relaxed">
          {confirmed.googleCalendarSynced || confirmed.userEmailSent
            ? `A Google Calendar invitation and confirmation email with the Google Meet link have been sent to ${confirmed.email} and the EliavaTech team.`
            : `Your consultation slot is reserved for ${confirmed.formattedDate} at ${confirmed.formattedTimeIst}. Add it to your Google Calendar below.`}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {confirmed.meetLink && (
            <a
              href={confirmed.meetLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="primary"
                size="md"
                leftIcon={<Video strokeWidth={1.5} className="h-4 w-4" />}
              >
                Join Google Meet
              </Button>
            </a>
          )}
          <a
            href={
              confirmed.calendarEventUrl || confirmed.addToGoogleCalendarUrl
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              type="button"
              variant="secondary"
              size="md"
              rightIcon={<ExternalLink strokeWidth={1.5} className="h-3.5 w-3.5" />}
            >
              Open in Google Calendar
            </Button>
          </a>
        </div>
      </Card>
    );
  }

  const availableSlots = slots.filter((s) => s.available);
  const selectedDayObj =
    days.find((d) => d.dateStr === selectedDate) ??
    (selectedDate ? formatDayOptionFromDateStr(selectedDate) : undefined);
  const selectedSlotObj = slots.find((s) => s.time === selectedSlotTime);

  const totalPages = Math.max(1, Math.ceil(days.length / DAYS_PER_PAGE));
  const pageSlice = days.slice(
    dayPage * DAYS_PER_PAGE,
    (dayPage + 1) * DAYS_PER_PAGE
  );
  const visibleDays =
    selectedDayObj && !pageSlice.some((d) => d.dateStr === selectedDate)
      ? [selectedDayObj, ...pageSlice.slice(0, DAYS_PER_PAGE - 1)]
      : pageSlice;

  const isCurrentOrPastMonth =
    viewYear < todayIst.year ||
    (viewYear === todayIst.year && viewMonth0 <= todayIst.month0);

  const calendarGrid = buildCalendarMonthGrid(
    viewYear,
    viewMonth0,
    todayIst.dateStr
  );
  const totalCalendarCells =
    calendarGrid.leadingEmptyCount + calendarGrid.cells.length;
  const calendarRowCount = Math.max(4, Math.ceil(totalCalendarCells / 7));
  const calendarGridHeightPx =
    calendarRowCount * 36 + (calendarRowCount - 1) * 6 + 4;

  const handlePrevMonth = () => {
    if (isCurrentOrPastMonth) return;
    setMonthDir(-1);
    if (viewMonth0 === 0) {
      setViewYear((y) => y - 1);
      setViewMonth0(11);
    } else {
      setViewMonth0((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    setMonthDir(1);
    if (viewMonth0 === 11) {
      setViewYear((y) => y + 1);
      setViewMonth0(0);
    } else {
      setViewMonth0((m) => m + 1);
    }
  };

  const handlePickFromModal = (dateStr: string) => {
    handleSelectDate(dateStr);
    const idx = days.findIndex((d) => d.dateStr === dateStr);
    if (idx !== -1) {
      setDayPage(Math.floor(idx / DAYS_PER_PAGE));
    }
    setCalendarOpen(false);
  };

  const morningSlots = availableSlots.filter(
    (s) => Number(s.time.split(":")[0]) < 12
  );
  const afternoonSlots = availableSlots.filter(
    (s) => Number(s.time.split(":")[0]) >= 12
  );

  return (
    <Card variant="default" padding="lg" className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar strokeWidth={1.5} className="h-4 w-4 text-primary shrink-0" />
            <h2 className="font-heading text-xl font-semibold text-text">
              Schedule a 30-Minute Discovery Call
            </h2>
          </div>
          <p className="text-xs text-text-muted">
            Live availability from EliavaTech&apos;s Google Calendar · Instant Google Meet link for both sides
          </p>
        </div>

        <span className="inline-flex self-start sm:self-center shrink-0 items-center gap-1.5 rounded-pill border border-border bg-surface-2 px-3 py-1 font-mono text-xs text-text-muted">
          <Video strokeWidth={1.5} className="h-3.5 w-3.5 text-primary" />
          <span>30 min · Google Meet · IST</span>
        </span>
      </div>

      {/* Step 1: Single-Row 6-Day Date Strip with Week Navigation & Full Calendar Popup */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-heading text-small font-semibold text-text">
            Select a Date
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (selectedDate) {
                  const [y, m] = selectedDate.split("-").map(Number);
                  if (y && m) {
                    setViewYear(y);
                    setViewMonth0(m - 1);
                  }
                }
                setCalendarOpen(true);
              }}
              className="inline-flex h-7 items-center gap-1.5 rounded-input border border-primary/40 bg-primary/10 px-2.5 font-mono text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Calendar strokeWidth={1.5} className="h-3.5 w-3.5" />
              <span>Full Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setDayPage((p) => Math.max(0, p - 1))}
              disabled={dayPage === 0}
              aria-label="Previous dates"
              className="inline-flex h-7 w-7 items-center justify-center rounded-input border border-border bg-surface text-text-muted transition-colors hover:border-primary/40 hover:text-text disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft strokeWidth={1.5} className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setDayPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={dayPage >= totalPages - 1}
              aria-label="Next dates"
              className="inline-flex h-7 w-7 items-center justify-center rounded-input border border-border bg-surface text-text-muted transition-colors hover:border-primary/40 hover:text-text disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight strokeWidth={1.5} className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          role="radiogroup"
          aria-label="Available consultation dates"
          className="grid grid-cols-3 sm:grid-cols-6 gap-2"
        >
          {visibleDays.map((day) => {
            const active = day.dateStr === selectedDate;
            return (
              <button
                key={day.dateStr}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => handleSelectDate(day.dateStr)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-input border py-2.5 px-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "border-primary bg-primary text-white shadow-xs"
                    : "border-border bg-surface-2/50 text-text hover:border-primary/40 hover:bg-surface-2"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    active ? "text-white/85" : "text-text-muted"
                  )}
                >
                  {day.weekdayShort}
                </span>
                <span className="font-heading text-lg font-semibold tabular-nums leading-snug">
                  {day.dayNumber}
                </span>
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    active ? "text-white/85" : "text-text-muted"
                  )}
                >
                  {day.monthShort}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Month Calendar Screen Popup Modal */}
      {calendarOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Choose a consultation date"
            onClick={() => setCalendarOpen(false)}
            className="fixed inset-0 z-[70] flex items-start justify-center bg-bg/75 px-4 pt-[16vh] sm:pt-[20vh] backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-card border border-border bg-surface p-5 text-text shadow-[var(--shadow-card-hover)] space-y-4"
            >
              <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Calendar strokeWidth={1.5} className="h-4 w-4 text-primary shrink-0" />
                  <AnimatePresence mode="popLayout" initial={false} custom={monthDir}>
                    <motion.h3
                      key={`${viewYear}-${viewMonth0}-title`}
                      custom={monthDir}
                      initial={{ opacity: 0, x: monthDir * 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -monthDir * 16 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="font-heading text-base font-semibold text-text whitespace-nowrap"
                    >
                      {calendarGrid.monthTitle}
                    </motion.h3>
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={isCurrentOrPastMonth}
                    aria-label="Previous month"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-input border border-border bg-surface-2 text-text-muted transition-colors hover:border-primary/40 hover:text-text disabled:opacity-35 disabled:pointer-events-none"
                  >
                    <ChevronLeft strokeWidth={1.5} className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Next month"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-input border border-border bg-surface-2 text-text-muted transition-colors hover:border-primary/40 hover:text-text"
                  >
                    <ChevronRight strokeWidth={1.5} className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarOpen(false)}
                    aria-label="Close calendar"
                    className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-input text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
                  >
                    <X strokeWidth={1.5} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-text-muted">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
                  <span key={w} className="py-1">
                    {w}
                  </span>
                ))}
              </div>

              <motion.div
                initial={false}
                animate={{ height: calendarGridHeightPx }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden py-[2px]"
              >
                <AnimatePresence mode="popLayout" initial={false} custom={monthDir}>
                  <motion.div
                    key={`${viewYear}-${viewMonth0}-grid`}
                    custom={monthDir}
                    initial={{ opacity: 0, x: monthDir * 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -monthDir * 32 }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-7 gap-[6px] w-full"
                  >
                    {Array.from({ length: calendarGrid.leadingEmptyCount }).map(
                      (_, idx) => (
                        <span key={`empty-${idx}`} className="h-[36px]" aria-hidden="true" />
                      )
                    )}

                    {calendarGrid.cells.map((cell) => {
                      const isSelected = cell.dateStr === selectedDate;
                      return (
                        <button
                          key={cell.dateStr}
                          type="button"
                          disabled={cell.disabled}
                          onClick={() => handlePickFromModal(cell.dateStr)}
                          aria-label={cell.dateStr}
                          aria-pressed={isSelected}
                          className={cn(
                            "relative flex h-[36px] w-full items-center justify-center rounded-input border font-mono text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            cell.disabled
                              ? "border-transparent bg-transparent text-text-muted/35 cursor-not-allowed"
                              : isSelected
                              ? "border-primary bg-primary text-white shadow-xs"
                              : cell.isToday
                              ? "border-primary/60 bg-primary/10 text-primary hover:bg-primary hover:text-white"
                              : "border-border/70 bg-surface-2/50 text-text hover:border-primary/40 hover:bg-surface-2"
                          )}
                        >
                          {cell.dayNumber}
                        </button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <div className="flex items-center justify-between gap-2 border-t border-border pt-3 text-xs">
                <span className="font-mono text-text-muted">
                  Mon – Sat · Past dates disabled
                </span>
                <button
                  type="button"
                  onClick={() => setCalendarOpen(false)}
                  className="rounded-input border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs font-medium text-text hover:border-primary/40"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* Step 2: Grouped Single-Line 30-Minute Time Slots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-small font-semibold text-text">
            Available 30-Minute Slots
          </span>
          {selectedDayObj && (
            <span className="font-mono text-xs text-primary">
              {selectedDayObj.fullLabel} · {availableSlots.length} free
            </span>
          )}
        </div>

        {loadingSlots ? (
          <div className="flex items-center justify-center gap-2 rounded-input border border-border bg-surface-2/40 py-8 text-xs text-text-muted">
            <Loader2 strokeWidth={1.5} className="h-4 w-4 animate-spin text-primary" />
            <span>Checking free slots on EliavaTech&apos;s Google Calendar...</span>
          </div>
        ) : slotsError ? (
          <div className="rounded-input border border-danger/40 bg-danger/10 p-4 text-xs text-danger">
            {slotsError}
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="rounded-input border border-border bg-surface-2/40 p-5 text-center text-xs text-text-muted">
            No free slots remaining for this date. Please select another day above.
          </div>
        ) : (
          <div
            role="radiogroup"
            aria-label="Available 30-minute time slots in IST"
            className="space-y-3.5 rounded-input border border-border bg-surface-2/30 p-3.5"
          >
            {morningSlots.length > 0 && (
              <div className="space-y-2">
                <p className="font-mono text-[11px] text-text-muted">
                  Morning (IST)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {morningSlots.map((slot) => {
                    const isSelected = slot.time === selectedSlotTime;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedSlotTime(slot.time)}
                        className={cn(
                          "inline-flex h-9 items-center justify-center rounded-input border px-3 font-mono text-xs font-medium tabular-nums whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          isSelected
                            ? "border-primary bg-primary text-white shadow-xs"
                            : "border-border bg-surface text-text hover:border-primary/40 hover:bg-surface-2"
                        )}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {afternoonSlots.length > 0 && (
              <div
                className={cn(
                  "space-y-2",
                  morningSlots.length > 0 && "pt-3 border-t border-border/60"
                )}
              >
                <p className="font-mono text-[11px] text-text-muted">
                  Afternoon &amp; Evening (IST)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {afternoonSlots.map((slot) => {
                    const isSelected = slot.time === selectedSlotTime;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedSlotTime(slot.time)}
                        className={cn(
                          "inline-flex h-9 items-center justify-center rounded-input border px-3 font-mono text-xs font-medium tabular-nums whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          isSelected
                            ? "border-primary bg-primary text-white shadow-xs"
                            : "border-border bg-surface text-text hover:border-primary/40 hover:bg-surface-2"
                        )}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 3: Attendee Form */}
      <form
        onSubmit={handleBookingSubmit}
        className="space-y-4 border-t border-border pt-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-input border border-border bg-surface-2/50 px-3.5 py-2.5 text-xs">
          <span className="font-heading font-semibold text-text">
            Attendee Details
          </span>
          {selectedDayObj && selectedSlotObj ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-primary">
              <CheckCircle2 strokeWidth={1.5} className="h-3.5 w-3.5 text-success shrink-0" />
              <span>
                {selectedDayObj.fullLabel} · {selectedSlotObj.label} IST (30 min)
              </span>
            </span>
          ) : (
            <span className="font-mono text-text-muted">
              Select a date and time slot above
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Your Name"
            required
            autoComplete="name"
            placeholder="Aarav Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Business Email (for Meet Invite)"
            type="email"
            required
            autoComplete="email"
            placeholder="aarav@company.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone / WhatsApp (Optional)"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Select
            label="Discussion Topic"
            value={service}
            onChange={(e) => setService(e.target.value)}
            options={[...SERVICE_OPTIONS]}
          />
        </div>

        <Textarea
          label="Agenda or Project Notes (Optional)"
          rows={2}
          placeholder="Anything specific you would like to cover on the call..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <TurnstileWidget
          id={BOOKING_TURNSTILE_ID}
          onToken={setTurnstileToken}
        />

        {submitError && (
          <p role="alert" className="text-xs text-danger">
            {submitError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <p className="text-xs text-text-muted">
            Both you and EliavaTech will receive the Google Calendar invite &amp; Google Meet link.
          </p>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={!selectedDate || !selectedSlotTime || isSubmitting}
            leftIcon={<Video strokeWidth={1.5} className="h-4 w-4" />}
            className="shrink-0 whitespace-nowrap"
          >
            Schedule Google Meet
          </Button>
        </div>
      </form>
    </Card>
  );
}
export default BookingEmbed;

