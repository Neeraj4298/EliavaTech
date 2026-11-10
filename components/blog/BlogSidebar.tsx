import * as React from "react";
import Link from "next/link";
import { ArrowRight, List } from "lucide-react";
import { type BlogPostMeta, type TocHeading } from "@/lib/blog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface BlogAuthorCardProps {
  author: string;
  authorRole: string;
}

export function BlogAuthorCard({ author, authorRole }: BlogAuthorCardProps) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-primary/35"
    >
      <div className="flex items-start gap-4">
        <svg
          viewBox="0 0 56 56"
          className="h-14 w-14 shrink-0 rounded-full border border-border bg-surface p-1"
          role="img"
          aria-label={`Illustrated avatar for ${author}`}
        >
          <circle cx="28" cy="20" r="9" fill="var(--primary)" opacity="0.85" />
          <path
            d="M12 46c2.5-8.5 9.5-13 16-13s13.5 4.5 16 13"
            fill="var(--text-muted)"
            opacity="0.45"
          />
        </svg>
        <div className="space-y-1">
          <Badge variant="default" size="sm">
            Written by
          </Badge>
          <h3 className="font-heading text-lg font-semibold text-text">
            {author}
          </h3>
          <p className="font-mono text-xs text-primary">{authorRole}</p>
          <p className="text-xs text-text-muted pt-1">
            Co-founder at EliavaTech. Helping growing Indian businesses launch
            websites, automate operations, and build custom software.
          </p>
        </div>
      </div>
      <Link href="/contact" className="shrink-0">
        <Button variant="primary" size="sm" withArrow>
          Discuss Your Project
        </Button>
      </Link>
    </Card>
  );
}

export interface BlogSidebarProps {
  toc: TocHeading[];
  relatedPosts: BlogPostMeta[];
}

export function BlogSidebar({ toc, relatedPosts }: BlogSidebarProps) {
  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
      {toc.length > 0 && (
        <Card variant="default" padding="md" className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <List strokeWidth={1.5} className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-small font-semibold uppercase tracking-wider text-text">
              Table of Contents
            </h2>
          </div>
          <nav aria-label="Table of contents">
            <ul className="space-y-2 text-small">
              {toc.map((h) => (
                <li key={h.id} className={h.level === 3 ? "pl-3.5" : ""}>
                  <a
                    href={`#${h.id}`}
                    className="block text-text-muted transition-colors hover:text-primary"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Card>
      )}

      {relatedPosts.length > 0 && (
        <Card variant="default" padding="md" className="space-y-4">
          <h2 className="font-heading text-small font-semibold uppercase tracking-wider text-text border-b border-border pb-3">
            Related Guides
          </h2>
          <div className="space-y-3">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/blog/${rel.slug}`}
                className="group block space-y-1 rounded-input border border-border bg-surface-2 p-3.5 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="text-primary font-medium">
                    {rel.category}
                  </span>
                  <span className="font-mono">{rel.readingTime}</span>
                </div>
                <h3 className="font-heading text-small font-semibold text-text group-hover:text-primary transition-colors">
                  {rel.title}
                </h3>
                <span className="inline-flex items-center gap-1 pt-1 text-xs font-medium text-primary">
                  <span>Read guide</span>
                  <ArrowRight strokeWidth={1.5} className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </aside>
  );
}
