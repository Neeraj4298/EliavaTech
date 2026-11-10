"use client";

import * as React from "react";
import { ChevronDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  placeholder?: string;
  helperText?: string;
  error?: string;
  success?: boolean | string;
  containerClassName?: string;
}

/**
 * Section 6 Primitive — Select
 * - Radius: 12px (rounded-input) per Section 2.5
 * - Custom styled native select with Lucide ChevronDown (1.5px stroke)
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      options,
      placeholder,
      helperText,
      error,
      success,
      className,
      containerClassName,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const messageId = `${selectId}-description`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;
    const feedbackMessage =
      error || (typeof success === "string" ? success : helperText);

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={feedbackMessage ? messageId : undefined}
            className={cn(
              "w-full appearance-none rounded-input border bg-surface text-text text-small",
              "h-11 pl-4 pr-10 py-2.5",
              "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-2",
              hasError
                ? "border-danger focus:border-danger focus:ring-danger/25"
                : hasSuccess
                ? "border-success focus:border-success focus:ring-success/25"
                : "border-border hover:border-text-muted/50 focus:border-primary focus:ring-primary/25",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <span className="pointer-events-none absolute right-3.5 flex items-center gap-1.5 text-text-muted">
            {hasError && (
              <AlertCircle
                strokeWidth={1.5}
                className="h-4 w-4 text-danger"
                aria-hidden="true"
              />
            )}
            {hasSuccess && (
              <CheckCircle2
                strokeWidth={1.5}
                className="h-4 w-4 text-success"
                aria-hidden="true"
              />
            )}
            <ChevronDown
              strokeWidth={1.5}
              className="h-4 w-4 text-text-muted"
              aria-hidden="true"
            />
          </span>
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

Select.displayName = "Select";

export default Select;
