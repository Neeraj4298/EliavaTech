"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EASE_STANDARD, MOTION_DURATION, usePrefersReducedMotion } from "@/lib/motion";
import { trackFormSubmission } from "@/lib/analytics";

export interface ChatLeadCardProps {
  onClose: () => void;
  onSuccess: (lead: { name: string; email: string; need: string }) => void;
}

export function ChatLeadCard({ onClose, onSuccess }: ChatLeadCardProps) {
  const reduced = usePrefersReducedMotion();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [need, setNeed] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Please enter a valid business email.";
    }
    if (need.trim().length < 10) {
      next.need = "Please add a short summary (10+ characters).";
    }
    setErrors(next);
    if (Object.keys(next).length > 0 || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: "",
          company: "",
          service: "custom-software",
          budgetRange: "undecided",
          message: need.trim(),
          website: "",
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        setErrors({ form: data?.error || "Could not submit right now." });
        setSubmitting(false);
        return;
      }
      trackFormSubmission("chat_lead_card", "custom-software");
      setSubmitted(true);
      setSubmitting(false);
      onSuccess({ name: name.trim(), email: email.trim(), need: need.trim() });
    } catch {
      setErrors({ form: "Network error. Please try again." });
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-input border border-border bg-surface px-3 py-2 text-small text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

  if (submitted) {
    return (
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
        className="rounded-card border border-success/40 bg-surface-2 p-4 text-center space-y-2"
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: EASE_STANDARD }}
            />
          </svg>
        </div>
        <p className="font-heading text-small font-semibold text-text">Quote Request Sent</p>
        <p className="text-xs text-text-muted">
          Thank you, {name}. We will reply to <span className="font-medium text-text">{email}</span> within one business day.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
      className="rounded-card border border-border bg-surface-2 p-4 space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-heading text-small font-semibold text-text">Request a Custom Quote</h3>
        <button type="button" onClick={onClose} aria-label="Close quote form" className="inline-flex h-7 w-7 items-center justify-center rounded-full text-text-muted hover:bg-surface hover:text-text">
          <X strokeWidth={1.5} className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <input type="text" aria-label="Your Name" placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)} className={inputCls} />
        {errors.name && <p className="text-[11px] text-danger">{errors.name}</p>}
        <input type="email" aria-label="Business Email" placeholder="Business email *" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} className={inputCls} />
        {errors.email && <p className="text-[11px] text-danger">{errors.email}</p>}
        <textarea rows={2} aria-label="Project Need" placeholder="Briefly describe your project need *" value={need} onChange={(e) => setNeed(e.target.value)} aria-invalid={Boolean(errors.need)} className={`${inputCls} resize-none`} />
        {errors.need && <p className="text-[11px] text-danger">{errors.need}</p>}
      </div>

      {errors.form && <p role="alert" className="text-xs text-danger">{errors.form}</p>}

      <Button type="submit" variant="primary" size="sm" fullWidth disabled={submitting} leftIcon={submitting ? <Loader2 strokeWidth={1.5} className="h-3.5 w-3.5 animate-spin" /> : undefined}>
        {submitting ? "Sending..." : "Send Quote Request"}
      </Button>
    </motion.form>
  );
}

export default ChatLeadCard;
