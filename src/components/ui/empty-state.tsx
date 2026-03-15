"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      className={cn("flex flex-col items-center justify-center py-20 px-4 text-center", className)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {icon ? (
        <motion.div
          className="mb-4 text-gray-300"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 180 }}
        >
          {icon}
        </motion.div>
      ) : null}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm">{description}</p>
      {action ? (
        <motion.div className="mt-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {action}
        </motion.div>
      ) : null}
    </motion.div>
  );
}