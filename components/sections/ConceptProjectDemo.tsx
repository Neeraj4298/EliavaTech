"use client";

import * as React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface ConceptProjectDemoProps {
  demoType: "clinic" | "ecommerce" | "crm";
  demoUrl: string;
}

export function ConceptProjectDemo({ demoType, demoUrl }: ConceptProjectDemoProps) {
  const [slot, setSlot] = React.useState("Tomorrow · 6:15 PM");
  const [booked, setBooked] = React.useState(false);
  const [qty, setQty] = React.useState(2);
  const [orderPlaced, setOrderPlaced] = React.useState(false);
  const [crmStage, setCrmStage] = React.useState("Brochure Sent");

  if (demoType === "clinic") {
    return (
      <DeviceMockup type="browser" url={demoUrl} title="Concept project · Interactive">
        <div className="space-y-4 p-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <p className="font-heading font-semibold text-text">CarePlus Dental &amp; Family Clinic</p>
              <p className="text-xs text-text-muted">Select a consultation slot with Dr. Rao</p>
            </div>
            <Badge variant="gold" size="sm" dot>Concept project</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {["Tomorrow · 11:00 AM", "Tomorrow · 5:30 PM", "Tomorrow · 6:15 PM"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setSlot(s); setBooked(false); }}
                className={`rounded-input border p-3 text-left text-xs font-medium ${
                  slot === s ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-text"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Button variant="primary" size="sm" onClick={() => setBooked(true)}>
              {booked ? "Slot Confirmed" : `Confirm ${slot}`}
            </Button>
            {booked && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-success">
                <CheckCircle2 strokeWidth={1.5} className="h-4 w-4" />
                <span>WhatsApp confirmation + 2h reminder queued</span>
              </span>
            )}
          </div>
        </div>
      </DeviceMockup>
    );
  }

  if (demoType === "ecommerce") {
    const subtotal = 1499 * qty;
    const gst = Math.round(subtotal * 0.12);
    const total = subtotal + gst;

    return (
      <DeviceMockup type="browser" url={demoUrl} title="Concept project · Interactive">
        <div className="space-y-4 p-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <p className="font-heading font-semibold text-text">Indigo Handloom Storefront</p>
              <p className="text-xs text-text-muted">SKU: IHL-KURTA-M · HSN 6205 · 12% GST</p>
            </div>
            <Badge variant="gold" size="sm" dot>Concept project</Badge>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-input border border-border bg-surface p-3">
            <div className="flex items-center gap-2">
              <span className="text-small font-medium text-text">Quantity:</span>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setQty(n); setOrderPlaced(false); }}
                  className={`h-8 w-8 rounded-pill border font-mono text-xs ${
                    qty === n ? "border-primary bg-primary text-white" : "border-border bg-surface-2 text-text"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="font-mono text-xs text-text-muted">
              Subtotal: ₹{subtotal} + GST: ₹{gst} = <strong className="text-text">₹{total}</strong>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="primary" size="sm" onClick={() => setOrderPlaced(true)}>
              {orderPlaced ? "Razorpay UPI Paid" : `Pay ₹${total} via Razorpay`}
            </Button>
            {orderPlaced && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-success">
                <Sparkles strokeWidth={1.5} className="h-4 w-4" />
                <span>GST Invoice PDF generated · Stock deducted (-{qty})</span>
              </span>
            )}
          </div>
        </div>
      </DeviceMockup>
    );
  }

  const stages = ["New Enquiry", "Brochure Sent", "Site Visit Scheduled", "Negotiation"];
  return (
    <DeviceMockup type="browser" url={demoUrl} title="Concept project · Interactive">
      <div className="space-y-4 p-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <p className="font-heading font-semibold text-text">Skyline Realty Lead CRM</p>
            <p className="text-xs text-text-muted">Lead #L-104 · 3BHK Whitefield · Budget ₹1.4 Cr</p>
          </div>
          <Badge variant="gold" size="sm" dot>Concept project</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stages.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setCrmStage(st)}
              className={`rounded-input border p-2.5 text-left text-xs font-medium ${
                crmStage === st ? "border-primary bg-primary text-white" : "border-border bg-surface text-text-muted"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="rounded-input border border-border bg-surface p-3 flex items-center justify-between text-xs">
          <span className="font-mono text-primary">Active Stage: {crmStage}</span>
          <span className="text-success font-mono">WhatsApp Follow-up Synced</span>
        </div>
      </div>
    </DeviceMockup>
  );
}

export default ConceptProjectDemo;
