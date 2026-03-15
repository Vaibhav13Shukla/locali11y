"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/utils/dates";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { AuditSummary } from "@/types/api";

interface AuditListProps {
  audits: AuditSummary[];
  locale: string;
}

export function AuditList({ audits, locale }: AuditListProps) {

  return (
    <div className="space-y-3">
      {audits.map((audit, index) => (
        <motion.div
          key={audit.id}
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
        >
          <Link href={`/${locale}/dashboard/audits/${audit.id}`}>
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {audit.targetUrl}
                    </p>
                    <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={audit.status === "completed" ? "success" : audit.status === "failed" ? "critical" : "default"}>
                      {audit.status}
                    </Badge>
                    <span className="text-xs text-gray-400">{formatRelative(audit.createdAt)}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">
                      {audit.targetLocales.length + 1} locales
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Worst</span>
                    <motion.p
                      className={`text-lg font-bold tabular-nums ${
                        audit.worstScore >= 80
                          ? "text-emerald-600"
                          : audit.worstScore >= 60
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {audit.worstScore}
                    </motion.p>
                  </div>
                  {audit.totalLocaleSpecificIssues > 0 && (
                    <Badge variant="warning">{audit.totalLocaleSpecificIssues} locale issues</Badge>
                  )}
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </motion.div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
