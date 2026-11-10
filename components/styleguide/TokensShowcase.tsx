import * as React from "react";
import {
  COLOR_TOKENS,
  TYPOGRAPHY_SCALE,
  SPACING_TOKENS,
  RADIUS_TOKENS,
} from "@/lib/tokens";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function TokensShowcase() {
  return (
    <div className="space-y-14">
      <section className="space-y-5" id="colors">
        <div className="border-b border-border pb-4">
          <Badge variant="primary" dot className="mb-2">
            Section 2.3
          </Badge>
          <h2 className="text-h2">Color Tokens (Light &amp; Dark)</h2>
          <p className="text-body text-text-muted mt-1">
            Defined on <code className="font-mono text-small">:root</code> (light) and{" "}
            <code className="font-mono text-small">[data-theme=&apos;dark&apos;]</code>, mapped in Tailwind CSS v4.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLOR_TOKENS.map((item) => (
            <Card key={item.token} variant="default" padding="sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <code className="font-mono text-small font-semibold text-text">
                  {item.token}
                </code>
                <span className="font-mono text-xs text-text-muted">
                  {item.tailwindClass}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="space-y-1">
                  <div
                    className="h-11 w-full rounded-input border border-border"
                    style={{ backgroundColor: `var(${item.token})` }}
                  />
                  <p className="font-mono text-[11px] text-text-muted text-center">
                    Active
                  </p>
                </div>
                <div className="space-y-1">
                  <div
                    className="h-11 w-full rounded-input border border-[#222C47]"
                    style={{ backgroundColor: item.darkHex }}
                  />
                  <p className="font-mono text-[11px] text-text-muted text-center">
                    {item.darkHex}
                  </p>
                </div>
                <div className="space-y-1">
                  <div
                    className="h-11 w-full rounded-input border border-[#DDE1EC]"
                    style={{ backgroundColor: item.lightHex }}
                  />
                  <p className="font-mono text-[11px] text-text-muted text-center">
                    {item.lightHex}
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-muted">{item.use}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5" id="typography">
        <div className="border-b border-border pb-4">
          <Badge variant="primary" dot className="mb-2">
            Section 2.4
          </Badge>
          <h2 className="text-h2">Typography &amp; Fluid Scale</h2>
          <p className="text-body text-text-muted mt-1">
            Sora (Headings), Inter (Body &amp; UI), and JetBrains Mono (Code &amp; Numbers) via next/font.
          </p>
        </div>

        <div className="space-y-4">
          {TYPOGRAPHY_SCALE.map((spec) => (
            <Card key={spec.name} variant="default" padding="md">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Badge variant="default">{spec.name}</Badge>
                  <code className="font-mono text-xs text-primary">.{spec.className}</code>
                </div>
                <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-text-muted">
                  <span>{spec.font}</span>
                  <span>Desktop: {spec.desktop}</span>
                  <span>Mobile: {spec.mobile}</span>
                  <span>Tracking: {spec.tracking}</span>
                </div>
              </div>
              <p className={spec.className}>{spec.sample}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5" id="spacing-shape">
        <div className="border-b border-border pb-4">
          <Badge variant="primary" dot className="mb-2">
            Section 2.5
          </Badge>
          <h2 className="text-h2">Spacing, Radius &amp; Elevation</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="default">
            <h3 className="text-h3 mb-4">8px Spacing Grid</h3>
            <div className="space-y-3">
              {SPACING_TOKENS.map((sp) => (
                <div key={sp.name} className="flex items-center justify-between gap-4 text-small">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <code className="font-mono text-xs text-primary">{sp.name}</code>
                    <span className="font-mono text-xs text-text-muted">{sp.px}</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 rounded-pill bg-primary/80" style={{ width: sp.px }} />
                  </div>
                  <span className="text-xs text-text-muted hidden sm:inline">{sp.usage}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="default" className="space-y-4">
            <h3 className="text-h3">Shape &amp; Border Radius Tokens</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RADIUS_TOKENS.map((rad) => (
                <div
                  key={rad.name}
                  className="p-4 border border-border bg-surface-2 flex flex-col justify-between gap-2"
                  style={{ borderRadius: `var(${rad.name})` }}
                >
                  <code className="font-mono text-xs text-primary">{rad.name}</code>
                  <p className="font-mono text-xs text-text font-semibold">{rad.value}</p>
                  <p className="text-xs text-text-muted">{rad.usage}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default TokensShowcase;
