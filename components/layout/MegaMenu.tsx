"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShoppingBag,
  MessageSquareCode,
  Boxes,
  CloudCog,
  ArrowRight,
} from "lucide-react";
import { SERVICE_ITEMS, type ServiceNavItem } from "@/content/navigation";
import {
  EASE_STANDARD,
  MOTION_DURATION,
  STAGGER_SIBLINGS,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";

const iconMap: Record<
  ServiceNavItem["icon"],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  Globe,
  ShoppingBag,
  MessageSquareCode,
  Boxes,
  CloudCog,
};

export interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: MOTION_DURATION.base, ease: EASE_STANDARD }}
          role="region"
          aria-label="Services menu"
          className="absolute left-0 right-0 top-full pt-3 z-50"
        >
          <div className="container-max">
            <div className="rounded-card border border-border bg-surface p-6 shadow-[var(--shadow-card-hover)]">
              <motion.div
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: STAGGER_SIBLINGS } },
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
              >
                {SERVICE_ITEMS.map((service) => {
                  const Icon = iconMap[service.icon];
                  return (
                    <motion.div
                      key={service.slug}
                      variants={
                        prefersReducedMotion
                          ? undefined
                          : {
                              hidden: { opacity: 0, y: 12 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                  duration: MOTION_DURATION.base,
                                  ease: EASE_STANDARD,
                                },
                              },
                            }
                      }
                    >
                      <Link
                        href={service.href}
                        onClick={onClose}
                        className="group flex h-full flex-col justify-between gap-4 rounded-card border border-border/70 bg-surface-2/50 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-input bg-primary/12 text-primary">
                              <Icon strokeWidth={1.5} className="h-4 w-4" />
                            </span>
                            <ArrowRight
                              strokeWidth={1.5}
                              className="h-4 w-4 text-text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
                            />
                          </div>
                          <h3 className="font-heading text-base font-semibold text-text group-hover:text-primary transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-xs leading-relaxed text-text-muted">
                            {service.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                          <span className="font-mono text-[11px] text-text-muted">
                            {service.startingPrice}
                          </span>
                          <Badge variant="primary" size="sm">
                            Explore
                          </Badge>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-text-muted">
                  Websites, e-commerce, WhatsApp automation, custom CRM/ERP software, and managed cloud support.
                </p>
                <Link
                  href="/services"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  <span>All Services Overview</span>
                  <ArrowRight strokeWidth={1.5} className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MegaMenu;
