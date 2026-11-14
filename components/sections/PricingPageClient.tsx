"use client";

import * as React from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { PRICING_HEADER, PRICING_TIERS } from "@/content/pricing";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { trackFormSubmission } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function PricingPageClient() {
  const [billingMode, setBillingMode] = React.useState<"one-time" | "monthly">("one-time");
  const [quoteSent, setQuoteSent] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [service, setService] = React.useState("bundle");
  const [budgetRange, setBudgetRange] = React.useState("25k-50k");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = React.useState("");

  const visibleTiers = PRICING_TIERS.filter((tier) => tier.billingMode === billingMode);

  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service,
          budgetRange,
          message: message.trim(),
          website: "",
        }),
      });

      const payload = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string[] | undefined>;
      } | null;

      if (!res.ok || !payload?.ok) {
        const firstFieldError = payload?.fieldErrors
          ? Object.values(payload.fieldErrors).flat().find(Boolean)
          : undefined;
        setSubmitError(
          firstFieldError ||
            payload?.error ||
            "Could not submit your quote request right now. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      trackFormSubmission("pricing_custom_quote", service);
      setSubmittedEmail(email.trim());
      setQuoteSent(true);
      setIsSubmitting(false);
    } catch {
      setSubmitError(
        "Network error while sending your quote request. Please check your connection and try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-card border border-border bg-surface p-4">
        <div className="space-y-1">
          <Badge variant="gold" size="sm" dot>{PRICING_HEADER.badge}</Badge>
          <p className="text-xs text-text-muted">{PRICING_HEADER.disclaimer}</p>
        </div>

        <div
          role="tablist"
          aria-label="Billing view toggle"
          className="inline-flex items-center rounded-pill border border-border bg-surface-2 p-1 self-start sm:self-center"
        >
          <button
            type="button"
            role="tab"
            aria-selected={billingMode === "one-time"}
            onClick={() => setBillingMode("one-time")}
            className={cn(
              "rounded-pill px-4 py-2 text-xs font-medium transition-colors",
              billingMode === "one-time" ? "bg-primary text-white" : "text-text-muted hover:text-text"
            )}
          >
            One-time Setup
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={billingMode === "monthly"}
            onClick={() => setBillingMode("monthly")}
            className={cn(
              "rounded-pill px-4 py-2 text-xs font-medium transition-colors",
              billingMode === "monthly" ? "bg-primary text-white" : "text-text-muted hover:text-text"
            )}
          >
            Monthly Care Plans
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTiers.map((tier) => (
          <Card
            key={tier.id}
            variant={tier.highlighted ? "elevated" : "default"}
            className={cn("flex flex-col justify-between gap-6", tier.highlighted && "border-primary/60")}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="default" size="sm">{tier.category}</Badge>
                {tier.badge && <Badge variant="gold" size="sm">{tier.badge}</Badge>}
              </div>
              <div>
                <h2 className="font-heading text-2xl font-semibold text-text">{tier.name}</h2>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-semibold text-primary">{tier.price}</span>
                  <span className="font-mono text-xs text-text-muted">{tier.unit}</span>
                </div>
              </div>
              <p className="text-small text-text-muted">{tier.summary}</p>
              <ul className="space-y-2 pt-2 border-t border-border/60">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs text-text">
                    <Check strokeWidth={1.5} className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2">
              <Button
                href="/contact"
                variant={tier.highlighted ? "primary" : "secondary"}
                size="md"
                fullWidth
                withArrow
              >
                Choose {tier.name}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card variant="default" padding="lg" id="custom-quote" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-3">
          <Badge variant="primary" size="sm" dot>Custom Scope</Badge>
          <h2 className="text-h3">Request a custom quote</h2>
          <p className="text-small text-text-muted leading-relaxed">
            Need a combined Website + WhatsApp Automation bundle or a multi-module CRM? Share your requirements and we will reply within one business day.
          </p>
          <p className="text-xs text-text-muted pt-2">{PRICING_HEADER.disclaimer}</p>
        </div>

        <div className="lg:col-span-7">
          {quoteSent ? (
            <div className="rounded-card border border-success/40 bg-success/10 p-6 space-y-2">
              <div className="flex items-center gap-2 font-heading text-lg font-semibold text-text">
                <CheckCircle2 strokeWidth={1.5} className="h-5 w-5 text-success" />
                <span>Custom quote request received</span>
              </div>
              <p className="text-small text-text-muted">
                Thank you, <span className="font-medium text-text">{name}</span>. We have notified the EliavaTech team and sent a confirmation email to{" "}
                <span className="font-medium text-text">{submittedEmail}</span>. A co-founder will review your scope and reply within one business day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleQuoteSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Input
                label="Your Name"
                required
                placeholder="Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Business Email"
                type="email"
                required
                placeholder="aarav@company.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select
                label="Package / Service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                options={[
                  { value: "bundle", label: "Website + WhatsApp Automation Bundle" },
                  { value: "ecommerce", label: "E-commerce Store (from ₹34,999)" },
                  { value: "crm", label: "Custom CRM / Dashboard (from ₹49,999)" },
                  { value: "care", label: "Monthly Care Plan" },
                ]}
              />
              <Select
                label="Estimated Budget Range"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                options={[
                  { value: "10k-25k", label: "₹10,000 – ₹25,000" },
                  { value: "25k-50k", label: "₹25,000 – ₹50,000" },
                  { value: "50k-1L", label: "₹50,000 – ₹1,00,000" },
                  { value: "1L+", label: "₹1,00,000+" },
                ]}
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Project Scope & Goals"
                  rows={3}
                  required
                  placeholder="Tell us about your business and what you want to launch or automate..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              {submitError && (
                <p role="alert" className="sm:col-span-2 text-xs text-danger">
                  {submitError}
                </p>
              )}
              <div className="sm:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  withArrow
                >
                  Request a Custom Quote
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}

export default PricingPageClient;
