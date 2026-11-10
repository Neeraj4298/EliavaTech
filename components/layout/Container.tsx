import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "header" | "footer" | "main";
}

/**
 * Section 2.5 & 6 — Container:
 * Max content width 1200px (--container-max) with consistent horizontal padding.
 */
export function Container({
  as: Tag = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={cn("container-max", className)} {...props}>
      {children}
    </Tag>
  );
}

export default Container;
