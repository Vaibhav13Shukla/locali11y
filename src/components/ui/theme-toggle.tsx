"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
        <div className="w-9 h-9" />
      </div>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        className={`flex items-center justify-center w-9 h-9 rounded-lg ${
          theme === "light" ? "bg-white shadow-sm" : "bg-gray-700"
        }`}
        initial={false}
        animate={{ 
          backgroundColor: theme === "light" ? "rgb(255 255 255)" : "rgb(55 65 81)",
          scale: theme === "light" ? 1 : 0.95
        }}
        transition={{ duration: 0.2 }}
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4 text-indigo-600" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-400" />
        )}
      </motion.div>
    </motion.button>
  );
}
