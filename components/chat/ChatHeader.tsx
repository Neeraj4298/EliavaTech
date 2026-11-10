"use client";

import * as React from "react";
import { Info, RotateCcw, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Tooltip } from "@/components/ui/Tooltip";

export interface ChatHeaderProps {
  mode: "floating" | "full";
  onReset: () => void;
  onClose: () => void;
}

/**
 * Clean single-row header:
 * - Round avatar with the EliavaTech monogram and a small green online dot
 * - Title "EliavaTech Assistant" on a single line + info icon with tooltip
 *   ("Answers are based on EliavaTech's services and pricing")
 * - Subtitle "Typically replies in seconds"
 * - Right side: refresh (new chat) and close icon buttons with aria-labels
 */
export function ChatHeader({ mode, onReset, onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2/80 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
          <Logo variant="monogram" size="sm" className="scale-75" />
          <span
            aria-label="Online"
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate whitespace-nowrap font-heading text-small font-semibold text-text">
              EliavaTech Assistant
            </h2>
            <Tooltip
              content="Answers are based on EliavaTech's services and pricing"
              placement="bottom"
            >
              <button
                type="button"
                aria-label="Answers are based on EliavaTech's services and pricing"
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Info strokeWidth={1.5} className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
          </div>
          <p className="truncate text-xs text-text-muted">
            Typically replies in seconds
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onReset}
          aria-label="Start new chat"
          title="Start new chat"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-text active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <RotateCcw strokeWidth={1.5} className="h-4 w-4" />
        </button>

        {mode === "floating" && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            title="Close assistant"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-text active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X strokeWidth={1.5} className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
