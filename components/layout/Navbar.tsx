"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/content/navigation";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMegaMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const scheduleCloseMegaMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setMegaMenuOpen(false), 120);
  };

  return (
    <>
      <header
        onMouseLeave={scheduleCloseMegaMenu}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled || megaMenuOpen
            ? "glass-surface border-b shadow-[var(--shadow-card)] py-3"
            : "bg-transparent border-b border-transparent py-4"
        )}
      >
        <div className="container-max flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="EliavaTech Home"
            className="rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Logo variant="full" size="md" />
          </Link>

          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1">
            {MAIN_NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <div
                  key={link.href}
                  onMouseEnter={link.hasMegaMenu ? openMegaMenu : () => setMegaMenuOpen(false)}
                  className="relative"
                >
                  <Link
                    href={link.href}
                    aria-expanded={link.hasMegaMenu ? megaMenuOpen : undefined}
                    aria-haspopup={link.hasMegaMenu ? "true" : undefined}
                    onFocus={link.hasMegaMenu ? openMegaMenu : undefined}
                    className={cn(
                      "group relative inline-flex items-center gap-1 px-3.5 py-2 text-small font-medium transition-colors",
                      isActive || (link.hasMegaMenu && megaMenuOpen)
                        ? "text-primary"
                        : "text-text hover:text-primary"
                    )}
                  >
                    <span
                      className={cn(
                        "relative after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-full after:origin-left after:bg-primary after:transition-transform after:duration-250",
                        isActive
                          ? "after:scale-x-100"
                          : "after:scale-x-0 group-hover:after:scale-x-100"
                      )}
                    >
                      {link.label}
                    </span>
                    {link.hasMegaMenu && (
                      <ChevronDown
                        strokeWidth={1.5}
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          megaMenuOpen && "rotate-180 text-primary"
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <MagneticButton strength={0.22}>
              <Button href="/contact" variant="primary" size="md" withArrow>
                Book a Free Consultation
              </Button>
            </MagneticButton>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-label="Open navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface text-text hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Menu strokeWidth={1.5} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div onMouseEnter={openMegaMenu} onMouseLeave={scheduleCloseMegaMenu}>
          <MegaMenu open={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
        </div>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPath={pathname}
      />
    </>
  );
}

export default Navbar;
