import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-bg text-text">
      <header className="container-max py-6 flex items-center justify-between border-b border-border">
        <Logo variant="full" size="md" />
        <div className="flex items-center gap-3">
          <ThemeToggle showLabel />
          <Link href="/styleguide">
            <Button variant="secondary" size="sm" withArrow>
              Styleguide
            </Button>
          </Link>
        </div>
      </header>

      <section className="container-max section-spacing flex flex-col items-start gap-6">
        <Badge variant="primary" size="md" dot>
          Digital solutions for growing businesses
        </Badge>
        <h1 className="text-h1 max-w-3xl">Building What&apos;s Next.</h1>
        <p className="text-body text-text-muted max-w-2xl">
          Websites, software and AI automation that help growing businesses
          operate smarter. Phase 1 Foundation &amp; Design System initialized.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link href="/styleguide">
            <Button variant="primary" size="lg" withArrow>
              Open Design System Styleguide
            </Button>
          </Link>
        </div>
      </section>

      <footer className="container-max py-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-small text-text-muted">
        <span>EliavaTech · Websites. Automation. Software. Support.</span>
        <span className="font-mono text-xs">Section 2 &amp; Section 6 Ready</span>
      </footer>
    </main>
  );
}

