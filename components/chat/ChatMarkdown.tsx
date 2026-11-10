"use client";

import * as React from "react";
import Link from "next/link";

export interface ChatMarkdownProps {
  content: string;
  showCaret?: boolean;
}

function renderInlineNodes(text: string, keyPrefix: string): React.ReactNode[] {
  const tokenRegex =
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|(?:\s|^)\/(?:contact|pricing|work|services|industries|about|blog|privacy)(?:\/[a-z0-9-]+)?)/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const raw = match[0];
    const key = `${keyPrefix}-${match.index}`;

    if (raw.startsWith("**") && raw.endsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-text">
          {raw.slice(2, -2)}
        </strong>
      );
    } else if (raw.startsWith("`") && raw.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-xs border border-border bg-surface px-1.5 py-0.5 font-mono text-[13px] text-primary"
        >
          {raw.slice(1, -1)}
        </code>
      );
    } else if (raw.startsWith("[")) {
      const linkMatch = raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, rawHref] = linkMatch;
        const href = rawHref.replace(/^https?:\/\/eliavatech\.com/, "") || "/";
        nodes.push(
          href.startsWith("/") ? (
            <Link
              key={key}
              href={href}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              {label}
            </Link>
          ) : (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              {label}
            </a>
          )
        );
      } else {
        nodes.push(raw);
      }
    } else {
      const leadingSpace = raw.startsWith(" ") ? " " : "";
      const path = raw.trim();
      if (leadingSpace) nodes.push(" ");
      nodes.push(
        <Link
          key={key}
          href={path}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
        >
          {path}
        </Link>
      );
    }

    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block h-4 w-[2px] align-middle bg-primary animate-pulse"
    />
  );
}

export function ChatMarkdown({ content, showCaret = false }: ChatMarkdownProps) {
  const blocks = React.useMemo(() => {
    const lines = content.split("\n");
    const result: Array<
      | { type: "p"; text: string }
      | { type: "ul"; items: string[] }
      | { type: "ol"; items: string[] }
    > = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line === "---") continue;

      const clean = line.replace(/^#{1,4}\s+/, "");
      const bullet = clean.match(/^(?:[-*•])\s+(.*)$/);
      const num = clean.match(/^\d+\.\s+(.*)$/);

      if (bullet) {
        const last = result[result.length - 1];
        if (last?.type === "ul") last.items.push(bullet[1]);
        else result.push({ type: "ul", items: [bullet[1]] });
      } else if (num) {
        const last = result[result.length - 1];
        if (last?.type === "ol") last.items.push(num[1]);
        else result.push({ type: "ol", items: [num[1]] });
      } else {
        result.push({ type: "p", text: clean });
      }
    }
    return result;
  }, [content]);

  return (
    <div className="space-y-2 text-[15px] leading-[1.6] text-text">
      {blocks.map((block, bIdx) => {
        const isLastBlock = bIdx === blocks.length - 1;
        if (block.type === "ul") {
          return (
            <ul key={bIdx} className="space-y-1.5 pl-4 list-disc marker:text-primary">
              {block.items.map((item, iIdx) => (
                <li key={iIdx}>
                  {renderInlineNodes(item, `u-${bIdx}-${iIdx}`)}
                  {showCaret && isLastBlock && iIdx === block.items.length - 1 && <Caret />}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={bIdx} className="space-y-1.5 pl-4 list-decimal marker:text-primary">
              {block.items.map((item, iIdx) => (
                <li key={iIdx}>
                  {renderInlineNodes(item, `o-${bIdx}-${iIdx}`)}
                  {showCaret && isLastBlock && iIdx === block.items.length - 1 && <Caret />}
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={bIdx}>
            {renderInlineNodes(block.text, `p-${bIdx}`)}
            {showCaret && isLastBlock && <Caret />}
          </p>
        );
      })}
    </div>
  );
}

export default ChatMarkdown;
