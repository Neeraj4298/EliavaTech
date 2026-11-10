"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { EASE_STANDARD, MOTION_DURATION, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type DashboardTab = "leads" | "appointments" | "orders";

interface MockRecord {
  id: string;
  title: string;
  channel: string;
  stage: string;
  stageTone: BadgeVariant;
  meta: string;
}

const RECORDS: Record<DashboardTab, MockRecord[]> = {
  leads: [
    { id: "L-104", title: "3BHK Floor Plan · Whitefield", channel: "WhatsApp Bot", stage: "Site Visit Booked", stageTone: "success", meta: "Brochure PDF sent · Sat 11:00 AM" },
    { id: "L-103", title: "Office Lease · Indiranagar", channel: "Website Form", stage: "Brochure Sent", stageTone: "primary", meta: "Assigned to Sales Desk · 14m ago" },
    { id: "L-102", title: "2BHK Villa Plot · Sarjapur", channel: "WhatsApp Bot", stage: "New Enquiry", stageTone: "gold", meta: "Budget qualified · Awaiting slot" },
  ],
  appointments: [
    { id: "A-209", title: "Dr. Rao · Dental Checkup", channel: "Online Booking", stage: "Confirmed", stageTone: "success", meta: "Tomorrow 6:15 PM · 2h reminder set" },
    { id: "A-208", title: "Dr. Menon · Consultation", channel: "WhatsApp Flow", stage: "Reminder Sent", stageTone: "primary", meta: "Today 5:30 PM · Location pin sent" },
    { id: "A-207", title: "Physiotherapy Session", channel: "Front Desk", stage: "Rescheduled", stageTone: "gold", meta: "Moved to Fri 10:30 AM via WhatsApp" },
  ],
  orders: [
    { id: "ORD-882", title: "Handloom Kurta · Size M (x2)", channel: "Razorpay UPI", stage: "GST Invoice Ready", stageTone: "success", meta: "₹3,498 paid · Stock synced (-2)" },
    { id: "ORD-881", title: "Brass Corporate Gift Box", channel: "Store Checkout", stage: "Dispatched", stageTone: "primary", meta: "AWB sent on WhatsApp · ₹12,400" },
    { id: "ORD-880", title: "Organic Spice Assortment", channel: "Razorpay Card", stage: "Packing", stageTone: "gold", meta: "HSN 0910 · CGST/SGST calculated" },
  ],
};

export interface DashboardPreviewProps {
  initialTab?: DashboardTab;
  title?: string;
  url?: string;
  className?: string;
}

export function DashboardPreview({
  initialTab = "leads",
  title = "Concept CRM",
  url = "portal.eliavatech.app/dashboard",
  className,
}: DashboardPreviewProps) {
  const [tab, setTab] = React.useState<DashboardTab>(initialTab);
  const reduced = usePrefersReducedMotion();
  const records = RECORDS[tab];

  return (
    <DeviceMockup type="browser" url={url} title={title} className={className}>
      <div className="space-y-3 p-1">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Dashboard module">
            {(
              [
                { id: "leads", label: "Lead CRM" },
                { id: "appointments", label: "Clinic Bookings" },
                { id: "orders", label: "E-commerce & GST" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-pill px-3 py-1 text-xs font-medium transition-colors",
                  tab === t.id ? "bg-primary text-white" : "bg-surface-2 text-text-muted hover:text-text"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-success">
            <RefreshCw strokeWidth={1.5} className="h-3 w-3" />
            <span>n8n + PostgreSQL</span>
          </span>
        </div>

        <div className="space-y-2">
          {records.map((rec, idx) => (
            <motion.div
              key={rec.id}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION_DURATION.base, delay: idx * 0.05, ease: EASE_STANDARD }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-input border border-border bg-surface p-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-semibold">{rec.id}</span>
                  <span className="font-heading text-small font-semibold text-text">{rec.title}</span>
                </div>
                <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                  <Sparkles strokeWidth={1.5} className="h-3 w-3 text-gold shrink-0" />
                  <span>{rec.meta}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-pill border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-text-muted">
                  {rec.channel}
                </span>
                <Badge variant={rec.stageTone} size="sm" dot>{rec.stage}</Badge>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] font-mono text-text-muted">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 strokeWidth={1.5} className="h-3.5 w-3.5 text-success" />
            <span>Concept Dashboard Preview</span>
          </span>
          <span>Live Webhook Stream</span>
        </div>
      </div>
    </DeviceMockup>
  );
}

export default DashboardPreview;
