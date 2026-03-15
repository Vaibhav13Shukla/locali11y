"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";

const LOCALES: Array<{ code: string; name: string; flag: string }> = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const currentItem = LOCALES.find((l) => l.code === currentLocale);
  const current = currentItem !== undefined ? currentItem : { code: "en", name: "English", flag: "🇺🇸" };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(code: string) {
    const path = window.location.pathname.replace(`/${currentLocale}`, `/${code}`);
    router.push(path);
    setIsOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span>{current.flag} {current.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50"
          >
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleSelect(locale.code)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  locale.code === currentLocale ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <span>{locale.flag}</span>
                <span>{locale.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
