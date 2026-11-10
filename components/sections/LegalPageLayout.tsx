"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { LEGAL_REVIEW_BANNER, type LegalSection } from "@/content/legal";
import {
  resetCookieConsent,
  setCookieConsent,
  useCookieConsent,
} from "@/lib/analytics";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SplitHeading } from "@/components/motion/SplitHeading";

export interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  sections: LegalSection[];
  showCookieControls?: boolean;
}

export function LegalPageLayout({
  eyebrow,
  title,
  subtitle,
  lastUpdated = "November 10, 2026 [PLACEHOLDER]",
  sections,
  showCookieControls = false,
}: LegalPageLayoutProps) {
  const consent = useCookieConsent();

  return (
    <div className="flex flex-col">
      <Section className="border-b border-border/60">
        <div className="max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold" size="md" dot>
              {eyebrow}
            </Badge>
            <span className="font-mono text-xs text-text-muted">
              Last Updated: {lastUpdated}
            </span>
          </div>

          <SplitHeading text={title} as="h1" className="text-h1 block" />
          <p className="text-body text-text-muted">{subtitle}</p>

          <Card variant="elevated" padding="md" className="border-gold/50 flex items-start gap-3">
            <AlertTriangle strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <p className="text-xs text-text leading-relaxed">{LEGAL_REVIEW_BANNER}</p>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl space-y-10">
          {showCookieControls && (
            <Card variant="elevated" padding="md" className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck strokeWidth={1.5} className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="font-heading text-lg font-semibold text-text">
                    Your Current Analytics Preference
                  </h2>
                </div>
                <Badge
                  variant={consent === "accepted" ? "success" : consent === "declined" ? "default" : "gold"}
                  size="sm"
                  dot
                >
                  {consent === "accepted" ? "Analytics Accepted" : consent === "declined" ? "Essential Only" : "Not Yet Chosen"}
                </Badge>
              </div>
              <p className="text-small text-text-muted">
                Update or withdraw your Google Analytics 4 consent at any time:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="primary" size="sm" onClick={() => setCookieConsent("accepted")}>
                  Accept Analytics
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setCookieConsent("declined")}>
                  Use Essential Only
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => resetCookieConsent()}>
                  Re-open Cookie Banner
                </Button>
              </div>
            </Card>
          )}

          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="space-y-3">
              <h2 className="text-h3 text-text">{sec.heading}</h2>
              {sec.paragraphs.map((p, idx) => (
                <p key={idx} className="text-body text-text-muted leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.bullets && (
                <ul className="space-y-2 pt-1">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-small text-text-muted">
                      <CheckCircle2 strokeWidth={1.5} className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <Card variant="default" padding="md" className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-heading text-base font-semibold text-text">
                Questions about privacy or data removal?
              </h2>
              <p className="text-xs text-text-muted">
                Contact our Data Fiduciary team at hello@eliavatech.com [PLACEHOLDER].
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/privacy"><Button variant="ghost" size="sm">Privacy</Button></Link>
              <Link href="/terms"><Button variant="ghost" size="sm">Terms</Button></Link>
              <Link href="/cookies"><Button variant="ghost" size="sm">Cookies</Button></Link>
              <Link href="/contact"><Button variant="primary" size="sm" withArrow>Contact Us</Button></Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}

export default LegalPageLayout;
