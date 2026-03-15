"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  const sizes = { sm: 24, md: 40, lg: 56 };
  const s = sizes[size];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <motion.div
        className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
        style={{ width: s, height: s }}
        animate={{
          rotate: [0, 90, 180, 270, 360],
          borderRadius: ["22%", "34%", "22%", "34%", "22%"],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="rounded-lg bg-white/35"
          style={{ width: s * 0.42, height: s * 0.42 }}
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      {label ? <p className="text-sm text-gray-500 font-medium">{label}</p> : null}
    </div>
  );
}