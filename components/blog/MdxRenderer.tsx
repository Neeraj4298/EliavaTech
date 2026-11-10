import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Info } from "lucide-react";
import { slugifyHeading } from "@/lib/blog";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export interface MdxRendererProps {
  source: string;
}

type MdxBlock =
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title: string; body: string }
  | { type: "checklist"; title: string; items: string[] };

function renderInlineMdx(text: string, keyPrefix: string): React.ReactNode[] {
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-text">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(
        <em key={key} className="italic text-text">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-primary"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        nodes.push(
          href.startsWith("/") ? (
            <Link
              key={key}
              href={href}
              className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              {label}
            </Link>
          ) : (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              {label}
            </a>
          )
        );
      } else {
        nodes.push(token);
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function parseMdxBlocks(source: string): MdxBlock[] {
  const blocks: MdxBlock[] = [];
  const lines = source.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith("<Callout")) {
      const titleMatch = line.match(/title=["']([^"']+)["']/);
      const title = titleMatch?.[1] || "Note";
      const bodyLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("</Callout>")) {
        bodyLines.push(lines[i].trim());
        i++;
      }
      blocks.push({ type: "callout", title, body: bodyLines.join(" ").trim() });
      i++;
      continue;
    }

    if (line.startsWith("<Checklist")) {
      const chunkLines: string[] = [line];
      while (i < lines.length && !lines[i].trim().endsWith("/>")) {
        i++;
        if (i < lines.length) chunkLines.push(lines[i].trim());
      }
      const chunk = chunkLines.join(" ");
      const titleMatch = chunk.match(/title=["']([^"']+)["']/);
      const itemsMatch = chunk.match(/items=\{\[([\s\S]*?)\]\}/);
      const items = itemsMatch
        ? Array.from(itemsMatch[1].matchAll(/["']([^"']+)["']/g)).map((m) => m[1])
        : [];
      blocks.push({
        type: "checklist",
        title: titleMatch?.[1] || "Checklist",
        items,
      });
      i++;
      continue;
    }

    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      const text = h2[1].trim();
      blocks.push({ type: "h2", id: slugifyHeading(text), text });
      i++;
      continue;
    }

    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      const text = h3[1].trim();
      blocks.push({ type: "h3", id: slugifyHeading(text), text });
      i++;
      continue;
    }

    const ul = line.match(/^[-*]\s+(.+)$/);
    if (ul) {
      const items: string[] = [ul[1].trim()];
      i++;
      while (i < lines.length) {
        const nextUl = lines[i].trim().match(/^[-*]\s+(.+)$/);
        if (!nextUl) break;
        items.push(nextUl[1].trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      const items: string[] = [ol[1].trim()];
      i++;
      while (i < lines.length) {
        const nextOl = lines[i].trim().match(/^\d+\.\s+(.+)$/);
        if (!nextOl) break;
        items.push(nextOl[1].trim());
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    blocks.push({ type: "p", text: line });
    i++;
  }

  return blocks;
}

export function MdxRenderer({ source }: MdxRendererProps) {
  const blocks = parseMdxBlocks(source);

  return (
    <div className="space-y-6 text-body text-text-muted leading-relaxed">
      {blocks.map((block, idx) => {
        if (block.type === "h2") {
          return (
            <h2 key={idx} id={block.id} className="scroll-mt-28 pt-6 text-h2 text-text">
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={idx} id={block.id} className="scroll-mt-28 pt-3 text-h3 text-text">
              {block.text}
            </h3>
          );
        }
        if (block.type === "callout") {
          return (
            <Card key={idx} variant="elevated" padding="md" className="border-gold/40 space-y-2">
              <div className="flex items-center gap-2">
                <Info strokeWidth={1.5} className="h-4 w-4 text-gold" />
                <Badge variant="gold" size="sm">{block.title}</Badge>
              </div>
              <p className="text-small text-text leading-relaxed">
                {renderInlineMdx(block.body, `callout-${idx}`)}
              </p>
            </Card>
          );
        }
        if (block.type === "checklist") {
          return (
            <Card key={idx} variant="default" padding="md" className="space-y-3">
              <h4 className="font-heading text-lg font-semibold text-text">{block.title}</h4>
              <ul className="space-y-2.5">
                {block.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2.5 text-small text-text">
                    <CheckCircle2 strokeWidth={1.5} className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{renderInlineMdx(item, `chk-${idx}-${iIdx}`)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={idx} className="space-y-2.5 pl-5 list-disc marker:text-primary">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="text-body text-text-muted">
                  {renderInlineMdx(item, `ul-${idx}-${iIdx}`)}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={idx} className="space-y-2.5 pl-5 list-decimal marker:text-primary">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="text-body text-text-muted">
                  {renderInlineMdx(item, `ol-${idx}-${iIdx}`)}
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={idx} className="text-body text-text-muted leading-relaxed">
            {renderInlineMdx(block.text, `p-${idx}`)}
          </p>
        );
      })}
    </div>
  );
}

export default MdxRenderer;

