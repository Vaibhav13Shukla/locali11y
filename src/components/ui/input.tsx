import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm transition-all duration-200",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          "hover:border-gray-400 dark:hover:border-gray-500",
          error
            ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-200",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export { Input };
