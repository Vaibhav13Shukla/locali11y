import { cn } from "@/lib/utils/cn";
import type { LabelHTMLAttributes } from "react";

export function Label({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", className)} {...props}>
      {children}
    </label>
  );
}
