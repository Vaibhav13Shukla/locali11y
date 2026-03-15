import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm shadow-sm transition-all duration-200",
          "bg-white text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500",
          "hover:border-gray-400",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
export { Select };
