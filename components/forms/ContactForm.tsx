"use client";

import * as React from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ShieldCheck, RotateCcw } from "lucide-react";
import {
  contactFormSchema,
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
  type ContactFormValues,
} from "@/lib/contact-schema";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppButton } from "@/components/overlays/WhatsAppButton";

declare global {
  interface Window {
    onEliavaTurnstileSuccess?: (token: string) => void;
    onEliavaTurnstileError?: () => void;
  }
}

export function ContactForm() {
  const turnstileSiteKey = (
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
  ).trim();

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [submittedData, setSubmittedData] = React.useState<{
    name: string;
    email: string;
    leadId?: string | null;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "web-development",
      budgetRange: "15k-35k",
      message: "",
      website: "",
      turnstileToken: "",
    },
  });

  React.useEffect(() => {
    if (!turnstileSiteKey) return;
    window.onEliavaTurnstileSuccess = (token: string) => {
      setValue("turnstileToken", token, { shouldValidate: true });
    };
    window.onEliavaTurnstileError = () => {
      setValue("turnstileToken", "");
    };
    return () => {
      delete window.onEliavaTurnstileSuccess;
      delete window.onEliavaTurnstileError;
    };
  }, [turnstileSiteKey, setValue]);

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        leadId?: string | null;
      } | null;

      if (!res.ok || !payload?.ok) {
        setServerError(
          payload?.error ||
            "Could not submit your request right now. Please try again or reach us directly on WhatsApp."
        );
        return;
      }

      setSubmittedData({
        name: values.name,
        email: values.email,
        leadId: payload.leadId,
      });
    } catch {
      setServerError(
        "Network error while sending your message. Please check your connection or message us on WhatsApp."
      );
    }
  };

  if (submittedData) {
    return (
      <Card variant="elevated" padding="lg" className="border-success/50 space-y-5">
        <div className="flex items-center gap-3">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success"
          >
            <CheckCircle2 strokeWidth={1.5} className="h-6 w-6" />
          </motion.span>
          <div>
            <Badge variant="success" size="sm" dot>
              Enquiry Received
            </Badge>
            <h2 className="font-heading text-2xl font-semibold text-text mt-1">
              Thank you, {submittedData.name}.
            </h2>
          </div>
        </div>

        <p className="text-body text-text-muted">
          We have received your project details and sent a confirmation to{" "}
          <strong className="text-text">{submittedData.email}</strong>. A co-founder will reply within one business day.
        </p>

        <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
          <WhatsAppButton
            variant="inline"
            label="Need a faster reply? Message on WhatsApp"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw strokeWidth={1.5} className="h-3.5 w-3.5" />}
            onClick={() => {
              reset();
              setSubmittedData(null);
            }}
          >
            Send Another Enquiry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg" className="space-y-6">
      <div className="space-y-1.5 border-b border-border pb-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="primary" size="sm" dot>
            Consultation Request Form
          </Badge>
          <span className="font-mono text-xs text-success">
            We reply within one business day
          </span>
        </div>
        <h2 className="font-heading text-2xl font-semibold text-text">
          Share your project brief
        </h2>
        <p className="text-small text-text-muted">
          Tell us about the business problem you want to solve. All fields marked * are required.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-input border border-danger/50 bg-danger/10 p-4 space-y-3"
        >
          <div className="flex items-start gap-2.5 text-small text-danger font-medium">
            <AlertCircle strokeWidth={1.5} className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 pl-7">
            <WhatsAppButton variant="inline" label="Message Us on WhatsApp Instead" />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Honeypot field — hidden from humans */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-website-hp">Website</label>
          <input
            id="contact-website-hp"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Your Name"
            floatingLabel
            required
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Business Email"
            type="email"
            floatingLabel
            required
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone / WhatsApp Number"
            type="tel"
            floatingLabel
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Company / Business Name"
            floatingLabel
            error={errors.company?.message}
            {...register("company")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Service Interested In"
            required
            options={[...SERVICE_OPTIONS]}
            error={errors.service?.message}
            {...register("service")}
          />
          <Select
            label="Estimated Budget Range"
            required
            options={[...BUDGET_OPTIONS]}
            error={errors.budgetRange?.message}
            {...register("budgetRange")}
          />
        </div>

        <Textarea
          label="How can we help your business?"
          floatingLabel
          required
          rows={4}
          maxLength={2000}
          showCount
          error={errors.message?.message}
          helperText="Share your current bottleneck, timeline, or any reference links."
          {...register("message")}
        />

        {/* Cloudflare Turnstile Spam Protection */}
        {turnstileSiteKey ? (
          <div className="pt-1">
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="lazyOnload"
            />
            <div
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
              data-callback="onEliavaTurnstileSuccess"
              data-error-callback="onEliavaTurnstileError"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <ShieldCheck strokeWidth={1.5} className="h-4 w-4 text-success shrink-0" />
            <span>
              Protected by Cloudflare Turnstile + honeypot + per-IP rate limiting.
            </span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            Your details are stored securely and never shared with third parties.
          </p>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            withArrow
          >
            Send Consultation Request
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default ContactForm;
