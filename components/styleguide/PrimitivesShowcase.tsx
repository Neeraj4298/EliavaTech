"use client";

import * as React from "react";
import { Mail, Sparkles, Check, Info } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Tabs,
  Tooltip,
  Modal,
} from "@/components/ui";

export interface PrimitivesShowcaseProps {
  themeScope?: "light" | "dark";
}

export function PrimitivesShowcase({ themeScope }: PrimitivesShowcaseProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div
      data-theme={themeScope}
      className="rounded-card border border-border bg-bg p-6 md:p-8 text-text space-y-8 transition-colors"
    >
      {themeScope && (
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <Badge variant={themeScope === "dark" ? "primary" : "gold"} dot>
              data-theme=&quot;{themeScope}&quot;
            </Badge>
            <span className="font-mono text-xs text-text-muted">
              {themeScope === "dark" ? "#060912 Ink" : "#F7F8FB Light"}
            </span>
          </div>
          <span className="text-xs text-text-muted">WCAG AA Contrast</span>
        </div>
      )}

      {/* 1. Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-text">
            1. Button (primary, secondary, ghost)
          </h3>
          <span className="font-mono text-xs text-text-muted">999px pill</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" withArrow>
            Book a Free Consultation
          </Button>
          <Button variant="secondary">See Our Work</Button>
          <Button variant="ghost">Explore Services</Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Sparkles strokeWidth={1.5} className="h-3.5 w-3.5" />}
          >
            Small
          </Button>
          <Button variant="secondary" size="lg" withArrow>
            Large CTA
          </Button>
          <Button variant="primary" isLoading>
            Loading
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* 2. Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-text">2. Badge</h3>
          <span className="font-mono text-xs text-text-muted">999px pill</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="default" dot>Concept project</Badge>
          <Badge variant="primary" dot>Digital solutions</Badge>
          <Badge variant="gold" dot>Founding client pricing</Badge>
          <Badge variant="success" dot>24h response time</Badge>
          <Badge variant="danger" dot>Error state</Badge>
          <Badge variant="outline" size="md">Next.js + TypeScript</Badge>
        </div>
      </div>

      {/* 3. Inputs, Textarea & Select */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-text">
            3. Input, Textarea &amp; Select
          </h3>
          <span className="font-mono text-xs text-text-muted">12px radius</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Email"
            type="email"
            placeholder="founder@company.in"
            leftIcon={<Mail strokeWidth={1.5} className="h-4 w-4" />}
            helperText="We reply within one business day."
          />
          <Input
            label="Full Name (Floating Label)"
            floatingLabel
            defaultValue="Aarav Sharma"
            required
          />
          <Input
            label="Verified WhatsApp"
            defaultValue="+91 98765 43210"
            success="Valid Indian mobile number"
          />
          <Input
            label="Work Email (Error)"
            defaultValue="invalid-email"
            error="Please enter a valid business email address."
          />
          <Select
            label="Service Interested In"
            defaultValue="whatsapp-ai"
            options={[
              { value: "web", label: "Web Development (from ₹9,999)" },
              { value: "ecommerce", label: "E-commerce Store (from ₹34,999)" },
              { value: "whatsapp-ai", label: "WhatsApp & AI Automation (from ₹12,999)" },
              { value: "software", label: "Custom CRM / ERP (from ₹49,999)" },
            ]}
          />
          <Textarea
            label="Project Brief (Floating Label)"
            floatingLabel
            rows={3}
            defaultValue="We need online clinic booking with automated WhatsApp reminders."
            helperText="Tell us about the customer problem first."
          />
        </div>
      </div>

      {/* 4. Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-text">
            4. Card (default, elevated, interactive)
          </h3>
          <span className="font-mono text-xs text-text-muted">12px radius</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="default" padding="sm">
            <CardHeader>
              <Badge variant="default" className="w-fit">Surface</Badge>
              <CardTitle className="mt-1">Web Development</CardTitle>
              <CardDescription>Fast, SEO-ready business sites.</CardDescription>
            </CardHeader>
            <CardFooter>
              <span className="font-mono text-xs text-text-muted">From ₹9,999</span>
              <Button variant="ghost" size="sm" withArrow>Details</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated" padding="sm">
            <CardHeader>
              <Badge variant="primary" className="w-fit">Surface-2</Badge>
              <CardTitle className="mt-1">WhatsApp &amp; AI</CardTitle>
              <CardDescription>Automated lead capture &amp; reminders.</CardDescription>
            </CardHeader>
            <CardFooter>
              <span className="font-mono text-xs text-text-muted">From ₹12,999</span>
              <Button variant="secondary" size="sm" withArrow>Explore</Button>
            </CardFooter>
          </Card>

          <Card variant="interactive" padding="sm">
            <CardHeader>
              <Badge variant="gold" className="w-fit">Interactive</Badge>
              <CardTitle className="mt-1">Custom Software</CardTitle>
              <CardDescription>Hover to test border &amp; primary glow.</CardDescription>
            </CardHeader>
            <CardFooter>
              <span className="font-mono text-xs text-text-muted">From ₹49,999</span>
              <Button variant="primary" size="sm" withArrow>Quote</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 5. Tabs, Tooltip & Modal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold text-text">
            5. Tabs (WAI-ARIA)
          </h3>
          <Tabs
            defaultValue="discover"
            items={[
              {
                value: "discover",
                label: "Discover",
                content: (
                  <Card variant="default" padding="sm">
                    We audit your enquiry and operational bottlenecks before writing code.
                  </Card>
                ),
              },
              {
                value: "build",
                label: "Build",
                content: (
                  <Card variant="default" padding="sm">
                    2-week typical launch with Next.js, PostgreSQL, and WhatsApp flows.
                  </Card>
                ),
              },
              {
                value: "support",
                label: "Support",
                content: (
                  <Card variant="default" padding="sm">
                    Ongoing hosting oversight, backups, and security updates.
                  </Card>
                ),
              },
            ]}
          />
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold text-text">
            6. Tooltip &amp; Modal
          </h3>
          <Card variant="default" padding="sm">
            <div className="flex flex-wrap items-center gap-3">
              <Tooltip content="Prices depend on scope; third-party fees billed separately.">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Info strokeWidth={1.5} className="h-4 w-4" />}
                >
                  Hover/Focus Tooltip
                </Button>
              </Tooltip>
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
                Open Modal Dialog
              </Button>
            </div>
          </Card>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Book a Free Consultation"
            description="We reply within one business day."
            footer={
              <>
                <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Check strokeWidth={1.5} className="h-4 w-4" />}
                  onClick={() => setModalOpen(false)}
                >
                  Confirm
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              <Input label="Your Name" floatingLabel defaultValue="Rohan Verma" />
              <Input label="Business Email" type="email" defaultValue="rohan@clinic.in" />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default PrimitivesShowcase;
