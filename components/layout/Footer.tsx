import * as React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  SERVICE_ITEMS,
  INDUSTRY_ITEMS,
  LEGAL_NAV_LINKS,
} from "@/content/navigation";
import { Logo } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const COMPANY_LINKS = [
  { label: "Work & Demos", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Blog & Guides", href: "/blog" },
  { label: "Contact & Booking", href: "/contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface text-text">
      <div className="container-max py-16 md:py-20">
        <div className="mb-14 flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-card border border-border bg-surface-2 p-6 md:p-8">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="gold" dot>Founding client pricing available</Badge>
            <h2 className="text-h3">
              Have a business problem? Let&apos;s work out how technology can solve it.
            </h2>
            <p className="text-small text-text-muted">
              We reply within one business day with a clear scope and honest recommendation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="/contact" variant="primary" size="lg" withArrow>
              Book a Free Consultation
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              View Pricing
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-border">
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" aria-label="EliavaTech Home" className="inline-block">
              <Logo variant="full" size="md" />
            </Link>
            <p className="text-small font-medium text-text">Building What&apos;s Next.</p>
            <p className="text-small text-text-muted max-w-sm">
              Websites, software and AI automation that help growing businesses operate smarter.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-text-muted">
              <li className="flex items-center gap-2">
                <Mail strokeWidth={1.5} className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:supporteliavatech@gmail.com" className="hover:text-primary">
                  supporteliavatech@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone strokeWidth={1.5} className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+917075466449" className="hover:text-primary">
                  +91 70754 66449
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin strokeWidth={1.5} className="h-4 w-4 text-primary shrink-0" />
                <span>Remote-first, serving India [PLACEHOLDER]</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-heading text-small font-semibold uppercase tracking-wider text-text">
              Services
            </h3>
            <ul className="space-y-2 text-small">
              <li><Link href="/services" className="text-text-muted hover:text-primary">All Services</Link></li>
              {SERVICE_ITEMS.map((s) => (
                <li key={s.slug}>
                  <Link href={s.href} className="text-text-muted hover:text-primary">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-heading text-small font-semibold uppercase tracking-wider text-text">
              Industries
            </h3>
            <ul className="space-y-2 text-small">
              <li><Link href="/industries" className="text-text-muted hover:text-primary">All Industries</Link></li>
              {INDUSTRY_ITEMS.map((ind) => (
                <li key={ind.slug}>
                  <Link href={ind.href} className="text-text-muted hover:text-primary">{ind.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-heading text-small font-semibold uppercase tracking-wider text-text">
              Company
            </h3>
            <ul className="space-y-2 text-small">
              {COMPANY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-text-muted hover:text-primary">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {currentYear} EliavaTech. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            {LEGAL_NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-text">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
