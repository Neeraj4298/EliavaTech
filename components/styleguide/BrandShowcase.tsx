import * as React from "react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function BrandShowcase() {
  return (
    <section className="space-y-6" id="brand">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <Badge variant="gold" dot className="mb-2">
            Section 2.2 &amp; 5.7
          </Badge>
          <h2 className="text-h2">Logo Variants &amp; ThemeToggle</h2>
          <p className="text-body text-text-muted mt-1">
            Three-bar stepped ascending E monogram (top bar gold, lower bars
            currentColor) + Sora wordmark across all four variants.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-small text-text-muted">Live Theme Toggle:</span>
          <ThemeToggle showLabel />
        </div>
      </div>

      {/* Four Logo Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <Badge variant="default">1. variant=&quot;full&quot;</Badge>
            <span className="font-mono text-xs text-text-muted">Adaptive</span>
          </div>
          <div className="py-4 flex items-center justify-center">
            <Logo variant="full" size="lg" />
          </div>
          <p className="text-xs text-text-muted">
            Full horizontal wordmark + monogram following active theme CSS
            variables.
          </p>
        </Card>

        <Card variant="default" className="flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <Badge variant="default">2. variant=&quot;monogram&quot;</Badge>
            <span className="font-mono text-xs text-text-muted">Mark + Favicon</span>
          </div>
          <div className="py-4 flex items-center justify-center gap-4">
            <Logo variant="monogram" size="sm" />
            <Logo variant="monogram" size="md" />
            <Logo variant="monogram" size="lg" />
          </div>
          <p className="text-xs text-text-muted">
            Monogram only in sm, md, and lg sizes. Also exported as{" "}
            <code className="font-mono">app/icon.svg</code>.
          </p>
        </Card>

        <div
          data-theme="light"
          className="rounded-card border border-[#DDE1EC] bg-[#FFFFFF] p-6 text-[#0B1020] flex flex-col justify-between gap-6"
        >
          <div className="flex items-center justify-between">
            <Badge variant="outline">3. variant=&quot;light&quot;</Badge>
            <span className="font-mono text-xs text-[#55607A]">#FFFFFF Surface</span>
          </div>
          <div className="py-4 flex items-center justify-center">
            <Logo variant="light" size="lg" />
          </div>
          <p className="text-xs text-[#55607A]">
            Locked light-theme palette (#0B1020 text, #C98A12 gold) for light
            backgrounds.
          </p>
        </div>

        <div
          data-theme="dark"
          className="rounded-card border border-[#222C47] bg-[#060912] p-6 text-[#EEF1F8] flex flex-col justify-between gap-6"
        >
          <div className="flex items-center justify-between">
            <Badge variant="outline">4. variant=&quot;dark&quot;</Badge>
            <span className="font-mono text-xs text-[#9AA6C3]">#060912 Ink</span>
          </div>
          <div className="py-4 flex items-center justify-center">
            <Logo variant="dark" size="lg" />
          </div>
          <p className="text-xs text-[#9AA6C3]">
            Locked dark-theme palette (#EEF1F8 text, #F2B84B gold) for deep ink
            backgrounds.
          </p>
        </div>
      </div>
    </section>
  );
}

export default BrandShowcase;
