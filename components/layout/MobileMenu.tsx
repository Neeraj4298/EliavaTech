"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ArrowRight } from "lucide-react";
import { MAIN_NAV_LINKS, SERVICE_ITEMS } from "@/content/navigation";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { Button } from "@/components/ui/Button";
import {
  EASE_STANDARD,
  MOTION_DURATION,
  STAGGER_SIBLINGS,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}

export function MobileMenu({ open, onClose, currentPath }: MobileMenuProps) {
  const reduced = usePrefersReducedMotion();
  const [subOpen, setSubOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const itemVar = reduced
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: MOTION_DURATION.base, ease: EASE_STANDARD },
        },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-bg p-6 overflow-y-auto lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <Link href="/" onClick={onClose} aria-label="EliavaTech Home">
              <Logo variant="full" size="md" />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface text-text"
              >
                <X strokeWidth={1.5} className="h-5 w-5" />
              </button>
            </div>
          </div>

          <motion.nav
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: STAGGER_SIBLINGS, delayChildren: 0.05 },
              },
            }}
            aria-label="Mobile primary navigation"
            className="my-8 flex flex-col gap-2"
          >
            {MAIN_NAV_LINKS.map((link) => {
              const active =
                currentPath === link.href || currentPath.startsWith(`${link.href}/`);
              return (
                <motion.div key={link.href} variants={itemVar} className="border-b border-border/60 pb-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "flex-1 flex items-center justify-between font-heading text-2xl font-semibold py-2",
                        active ? "text-primary" : "text-text"
                      )}
                    >
                      <span>{link.label}</span>
                      {!link.hasMegaMenu && <ArrowRight strokeWidth={1.5} className="h-5 w-5 text-text-muted" />}
                    </Link>
                    {link.hasMegaMenu && (
                      <button
                        type="button"
                        onClick={() => setSubOpen((v) => !v)}
                        aria-expanded={subOpen}
                        aria-label="Toggle services submenu"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-pill text-text-muted"
                      >
                        <ChevronDown strokeWidth={1.5} className={cn("h-5 w-5", subOpen && "rotate-180")} />
                      </button>
                    )}
                  </div>
                  {link.hasMegaMenu && subOpen && (
                    <div className="mt-2 mb-2 pl-3 border-l-2 border-primary/40 flex flex-col gap-1">
                      {SERVICE_ITEMS.map((s) => (
                        <Link
                          key={s.slug}
                          href={s.href}
                          onClick={onClose}
                          className="flex items-center justify-between rounded-input px-3 py-2 text-small text-text-muted hover:text-text"
                        >
                          <span>{s.title}</span>
                          <span className="font-mono text-xs text-primary">{s.startingPrice}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.nav>

          <div className="border-t border-border pt-6">
            <Link href="/contact" onClick={onClose} className="block">
              <Button variant="primary" size="lg" fullWidth withArrow>
                Book a Free Consultation
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
