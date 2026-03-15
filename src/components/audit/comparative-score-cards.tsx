"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { AuditLocaleResultRow } from "@/types/database";

interface ComparativeScoreCardsProps {
  localeResults: AuditLocaleResultRow[];
  sourceLocale: string;
  onLocaleClick?: (locale: string) => void;
  activeLocale?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-50 border-emerald-200 hover:border-emerald-300";
  if (score >= 60) return "bg-amber-50 border-amber-200 hover:border-amber-300";
  return "bg-red-50 border-red-200 hover:border-red-300";
}

function getGlow(score: number): string {
  if (score >= 80) return "hover:shadow-emerald-100";
  if (score >= 60) return "hover:shadow-amber-100";
  return "hover:shadow-red-100";
}

export function ComparativeScoreCards({
  localeResults,
  sourceLocale,
  onLocaleClick,
  activeLocale,
}: ComparativeScoreCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {localeResults.map((result, index) => (
        <motion.button
          key={result.locale}
          onClick={() => onLocaleClick?.(result.locale)}
          className={cn(
            "text-left rounded-2xl border-2 p-5 transition-all hover:shadow-xl",
            getScoreBg(result.score),
            getGlow(result.score),
            activeLocale === result.locale && "ring-2 ring-indigo-500 ring-offset-2"
          )}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold uppercase tracking-wider text-gray-700">
              {result.locale}
            </span>
            {result.locale === sourceLocale && (
              <Badge variant="success" className="text-[10px]">
                source
              </Badge>
            )}
          </div>
          <motion.div
            className={cn("text-4xl font-bold tabular-nums", getScoreColor(result.score))}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
          >
            {result.score}
          </motion.div>
          <div className="text-xs text-gray-500 mt-2">
            {result.failed_checks} issues
            {result.locale_specific_issues > 0 && (
              <span className="text-red-600 font-semibold">
                {" "}· {result.locale_specific_issues} locale
              </span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
