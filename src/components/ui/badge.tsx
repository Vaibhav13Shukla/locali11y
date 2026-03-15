import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "critical" | "important" | "info" | "success" | "warning";
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    critical: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    important: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    success: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300",
    warning: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
  };

  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
