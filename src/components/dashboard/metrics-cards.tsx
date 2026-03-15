"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useT } from "@/lib/i18n/dict-context";
import { BarChart3, Globe, AlertTriangle } from "lucide-react";

interface MetricsCardsProps {
  totalAudits: number;
  avgScore: number;
  totalLocaleSpecificIssues: number;
}

export function MetricsCards({ totalAudits, avgScore, totalLocaleSpecificIssues }: MetricsCardsProps) {
  const t = useT();

  const cards = [
    {
      title: t("dashboard.totalAudits"),
      value: totalAudits,
      icon: BarChart3,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      title: t("dashboard.avgScore"),
      value: avgScore,
      icon: Globe,
      color: avgScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : avgScore >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400",
      bg: avgScore >= 80 ? "bg-emerald-50 dark:bg-emerald-900/30" : avgScore >= 60 ? "bg-amber-50 dark:bg-amber-900/30" : "bg-red-50 dark:bg-red-900/30",
    },
    {
      title: t("dashboard.localeIssues"),
      value: totalLocaleSpecificIssues,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
          >
            <Card hover>
              <div className="flex items-center gap-4">
                <motion.div
                  className={`p-3.5 rounded-xl ${card.bg}`}
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 240 }}
                >
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.title}</p>
                  <p className={`text-3xl font-bold tabular-nums ${card.color}`}>{card.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
