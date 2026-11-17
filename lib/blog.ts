import fs from "fs";
import path from "path";

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogPostMeta {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  authorRole: string;
  draft: boolean;
  keywords: string[];
  readingTime: string;
  wordCount: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  toc: TocHeading[];
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function parseFrontmatter(raw: string): {
  meta: Omit<BlogPostMeta, "readingTime" | "wordCount">;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid MDX frontmatter format");
  }

  const [, yamlBlock, body] = match;
  const lines = yamlBlock.split(/\r?\n/);

  const fields: Record<string, string> = {};
  const keywords: string[] = [];
  let inKeywords = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("- ") && inKeywords) {
      keywords.push(line.slice(2).replace(/^["']|["']$/g, "").trim());
      continue;
    }

    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kv) {
      const [, key, val] = kv;
      if (key === "keywords") {
        inKeywords = true;
      } else {
        inKeywords = false;
        fields[key] = val.replace(/^["']|["']$/g, "").trim();
      }
    }
  }

  return {
    meta: {
      title: fields.title || "Untitled",
      slug: fields.slug || "untitled",
      excerpt: fields.excerpt || "",
      category: fields.category || "General",
      publishedAt: fields.publishedAt || "2026-11-10",
      updatedAt: fields.updatedAt || fields.publishedAt || "2026-11-10",
      author: fields.author || "EliavaTech Team",
      authorRole: fields.authorRole || "EliavaTech",
      draft: fields.draft !== "false",
      keywords,
    },
    body: body.trim(),
  };
}

function extractToc(mdxBody: string): TocHeading[] {
  const lines = mdxBody.split(/\r?\n/);
  const toc: TocHeading[] = [];

  for (const rawLine of lines) {
    const h2 = rawLine.match(/^##\s+(.+)$/);
    if (h2) {
      const text = h2[1].trim();
      toc.push({ id: slugifyHeading(text), text, level: 2 });
      continue;
    }
    const h3 = rawLine.match(/^###\s+(.+)$/);
    if (h3) {
      const text = h3[1].trim();
      toc.push({ id: slugifyHeading(text), text, level: 3 });
    }
  }

  return toc;
}

function computeReadingTime(mdxBody: string): {
  readingTime: string;
  wordCount: number;
} {
  const plain = mdxBody
    .replace(/<[\s\S]*?>/g, " ")
    .replace(/[#*_`>-]/g, " ")
    .trim();
  const words = plain ? plain.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return {
    readingTime: `${minutes} min read`,
    wordCount: words,
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * A post is public only when it is not a draft and its publish date is a valid
 * date that is not in the future.
 */
export function isPostPublished(
  post: Pick<BlogPostMeta, "draft" | "publishedAt">
): boolean {
  if (post.draft) return false;
  if (!ISO_DATE.test(post.publishedAt)) return false;
  const published = new Date(`${post.publishedAt}T00:00:00Z`).getTime();
  return Number.isFinite(published) && published <= Date.now();
}

/**
 * Drafts are visible only in local development (or when SHOW_DRAFT_POSTS=true)
 * so they can be reviewed. They never appear in production pages, the sitemap
 * or search indexing.
 */
export function draftPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.SHOW_DRAFT_POSTS === "true"
  );
}

/** Every post on disk, including drafts. Prefer `getAllBlogPosts` for pages. */
function readAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const fullPath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { meta, body } = parseFrontmatter(raw);
    const { readingTime, wordCount } = computeReadingTime(body);
    const toc = extractToc(body);

    return {
      ...meta,
      readingTime,
      wordCount,
      content: body,
      toc,
    };
  });

  return posts.sort(
    (a, b) =>
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.title.localeCompare(b.title)
  );
}

/** Posts that may be shown on the site right now. */
export function getAllBlogPosts(): BlogPost[] {
  const all = readAllBlogPosts();
  return draftPreviewEnabled() ? all : all.filter(isPostPublished);
}

/** Posts that search engines may index (used by the sitemap). */
export function getPublishedBlogPosts(): BlogPost[] {
  return readAllBlogPosts().filter(isPostPublished);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = getAllBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function getBlogCategories(): string[] {
  const posts = getAllBlogPosts();
  const unique = Array.from(new Set(posts.map((p) => p.category)));
  return ["All", ...unique];
}

export function getRelatedBlogPosts(
  currentSlug: string,
  category: string,
  limit = 2
): BlogPostMeta[] {
  const all = getAllBlogPosts().filter((p) => p.slug !== currentSlug);
  const sameCategory = all.filter((p) => p.category === category);
  const others = all.filter((p) => p.category !== category);
  return [...sameCategory, ...others].slice(0, limit);
}
