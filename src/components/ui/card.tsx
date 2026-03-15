import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

export function Card({ className, padding = "md", hover = false, glow = false, gradient = false, children, ...props }: CardProps) {
  const paddings = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm",
        paddings[padding],
        hover && "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600",
        glow && "relative before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-r before:from-indigo-500/20 before:via-purple-500/20 before:to-fuchsia-500/20 before:-z-10",
        gradient && "bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-gray-500 dark:text-gray-400 mt-1", className)} {...props}>
      {children}
    </p>
  );
}
