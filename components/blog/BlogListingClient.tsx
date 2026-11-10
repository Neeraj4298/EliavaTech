"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Search } from "lucide-react";
import { type BlogPostMeta } from "@/lib/blog";
import { Badge } from "@/components/ui/Badge";
import { TiltCard } from "@/components/motion/TiltCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { cn } from "@/lib/utils";

export interface BlogListingClientProps {
  posts: BlogPostMeta[];
  categories: string[];
}

export function BlogListingClient({ posts, categories }: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [query, setQuery] = React.useState("");

  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const matchCat = selectedCategory === "All" || post.category === selectedCategory;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [posts, selectedCategory, query]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div role="tablist" aria-label="Blog categories" className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const active = cat === selectedCategory;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-pill border px-4 py-2 text-small font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "border-primary bg-primary text-on-primary shadow-xs"
                    : "border-border bg-surface text-text-muted hover:bg-surface-2 hover:text-text"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search strokeWidth={1.5} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides..."
            aria-label="Search blog articles"
            className="w-full rounded-pill border border-border bg-surface pl-10 pr-4 py-2 text-small text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-card border border-border bg-surface p-10 text-center space-y-2">
          <p className="font-heading text-lg font-semibold text-text">No articles match your filter</p>
          <p className="text-small text-text-muted">Try selecting &ldquo;All&rdquo; categories or clearing your search query.</p>
        </div>
      ) : (
        <StaggerGroup key={`${selectedCategory}-${query}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <StaggerItem key={post.slug} className="h-full">
              <Link href={`/blog/${post.slug}`} className="block h-full group">
                <TiltCard cursorLabel="Read" className="h-full">
                  <article className="flex h-full flex-col justify-between gap-6">
                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="primary" size="sm">{post.category}</Badge>
                          {post.draft && <Badge variant="gold" size="sm" dot>Draft for Review</Badge>}
                        </div>
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted">
                          <Clock strokeWidth={1.5} className="h-3.5 w-3.5" />
                          <span>{post.readingTime}</span>
                        </span>
                      </div>

                      <h2 className="font-heading text-2xl font-semibold text-text group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-small text-text-muted leading-relaxed">{post.excerpt}</p>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                      <div className="text-xs text-text-muted">
                        <span className="font-medium text-text">{post.author}</span> · {post.publishedAt}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-small font-medium text-primary">
                        <span>Read Guide</span>
                        <ArrowRight strokeWidth={1.5} className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </TiltCard>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}

export default BlogListingClient;
