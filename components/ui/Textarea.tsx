"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  floatingLabel?: boolean;
  helperText?: string;
  error?: string;
  success?: boolean | string;
  showCount?: boolean;
  containerClassName?: string;
}

/**
 * Section 6 Primitive — Textarea
 * - Radius: 12px (rounded-input) per Section 2.5
 * - Supports standard or floating labels, inline validation, and character count
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      label,
      floatingLabel = false,
      helperText,
      error,
      success,
      showCount = false,
      maxLength,
      className,
      containerClassName,
      disabled,
      placeholder,
      value,
      defaultValue,
      onChange,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const messageId = `${textareaId}-description`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;
    const feedbackMessage =
      error || (typeof success === "string" ? success : helperText);

    const [charCount, setCharCount] = React.useState(() =>
      String(value ?? defaultValue ?? "").length
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && !floatingLabel && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={textareaId}
              className="text-small font-medium text-text select-none"
            >
              {label}
              {props.required && (
                <span className="ml-1 text-danger" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            {showCount && maxLength && (
              <span className="font-mono text-xs text-text-muted">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            placeholder={floatingLabel ? " " : placeholder}
            aria-invalid={hasError}
            aria-describedby={feedbackMessage ? messageId : undefined}
            className={cn(
              "peer w-full rounded-input border bg-surface text-text text-small resize-y",
              "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-2",
              floatingLabel ? "pt-6 pb-2.5 px-4" : "p-3.5",
              (hasError || hasSuccess) && "pr-10",
              hasError
                ? "border-danger focus:border-danger focus:ring-danger/25"
                : hasSuccess
                ? "border-success focus:border-success focus:ring-success/25"
                : "border-border hover:border-text-muted/50 focus:border-primary focus:ring-primary/25",
              className
            )}
            {...props}
          />

          {label && floatingLabel && (
            <label
              htmlFor={textareaId}
              className={cn(
                "pointer-events-none absolute left-4 origin-left select-none text-text-muted",
                "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "top-2 text-xs scale-90",
                "peer-placeholder-shown:top-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-small",
                "peer-focus:top-2 peer-focus:scale-90 peer-focus:text-xs",
                hasError
                  ? "peer-focus:text-danger text-danger"
                  : hasSuccess
                  ? "peer-focus:text-success text-success"
                  : "peer-focus:text-primary"
              )}
            >
              {label}
              {props.required && (
                <span className="ml-0.5 text-danger" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}

          {(hasError || hasSuccess) && (
            <span className="pointer-events-none absolute right-3.5 top-3.5 flex items-center">
              {hasError ? (
                <AlertCircle
                  strokeWidth={1.5}
                  className="h-4 w-4 text-danger"
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2
                  strokeWidth={1.5}
                  className="h-4 w-4 text-success"
                  aria-hidden="true"
                />
              )}
            </span>
          )}
        </div>

        {feedbackMessage && (
          <p
            id={messageId}
            role={hasError ? "alert" : undefined}
            className={cn(
              "text-xs leading-relaxed",
              hasError
                ? "text-danger"
                : hasSuccess
                ? "text-success"
                : "text-text-muted"
            )}
          >
            {feedbackMessage}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
