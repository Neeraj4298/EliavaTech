"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  floatingLabel?: boolean;
  helperText?: string;
  error?: string;
  success?: boolean | string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Section 6 Primitive — Input
 * - Radius: 12px (rounded-input) per Section 2.5
 * - Supports standard or floating labels, inline validation, and animated checkmark on success (Section 5.6)
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      floatingLabel = false,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      disabled,
      placeholder,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const messageId = `${inputId}-description`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;
    const feedbackMessage =
      error || (typeof success === "string" ? success : helperText);

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && !floatingLabel && (
          <label
            htmlFor={inputId}
            className="text-small font-medium text-text select-none"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3.5 text-text-muted flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            placeholder={floatingLabel ? " " : placeholder}
            aria-invalid={hasError}
            aria-describedby={feedbackMessage ? messageId : undefined}
            className={cn(
              "peer w-full rounded-input border bg-surface text-text text-small",
              "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "placeholder:text-text-muted/70",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-2",
              floatingLabel ? "h-13 pt-5 pb-1.5 px-4" : "h-11 px-4 py-2.5",
              Boolean(leftIcon) && "pl-10",
              Boolean(rightIcon || hasError || hasSuccess) && "pr-10",
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
              htmlFor={inputId}
              className={cn(
                "pointer-events-none absolute left-4 origin-left select-none text-text-muted",
                "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "top-2 text-xs translate-y-0 scale-90",
                "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-small",
                "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:scale-90 peer-focus:text-xs",
                hasError
                  ? "peer-focus:text-danger text-danger"
                  : hasSuccess
                  ? "peer-focus:text-success text-success"
                  : "peer-focus:text-primary",
                Boolean(leftIcon) && "left-10"
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

          {(rightIcon || hasError || hasSuccess) && (
            <span className=" absolute right-3.5 flex items-center text-text-muted">
              {hasError ? (
                <AlertCircle
                  strokeWidth={1.5}
                  className="h-4 w-4 text-danger"
                  aria-hidden="true"
                />
              ) : hasSuccess ? (
                <CheckCircle2
                  strokeWidth={1.5}
                  className="h-4 w-4 text-success transition-transform duration-200 scale-100"
                  aria-hidden="true"
                />
              ) : (
                rightIcon
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

Input.displayName = "Input";

export default Input;
