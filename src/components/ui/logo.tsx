"use client";

import { motion } from "framer-motion";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <motion.div
        className="rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white font-bold flex items-center justify-center shadow-lg shadow-indigo-200"
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
        transition={{ duration: 0.45 }}
      >
        L
      </motion.div>
      <span className="font-bold text-gray-900 text-lg tracking-tight">
        Locali
        <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
          11y
        </span>
      </span>
    </div>
  );
}