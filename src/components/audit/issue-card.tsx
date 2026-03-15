"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/dict-context";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type { AuditIssueRow } from "@/types/database";

interface IssueCardProps {
  issue: AuditIssueRow;
  index?: number;
}

export function IssueCard({ issue, index = 0 }: IssueCardProps) {
  const t = useT();

  const checkTitle = String(t(`audit.checks.${issue.check_id}.title`) || issue.check_id);
  const failureDesc = String(t(`audit.checks.${issue.check_id}.failureDescription`) || "Check failed");
  const fixRec = String(t(`audit.checks.${issue.check_id}.fixRecommendation`) || "No recommendation");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5), ease: "easeOut" }}
    >
      <Card padding="sm" hover className="group">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={issue.severity} label={String(t(`audit.severity.${issue.severity}`))} />
            <Badge variant="default">{String(t(`audit.categories.${issue.category}`))}</Badge>
            {issue.is_locale_specific && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Badge variant="warning">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Locale-specific
                </Badge>
              </motion.div>
            )}
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">
          {checkTitle}
        </h4>
        <p className="text-sm text-gray-600 mt-1">{failureDesc}</p>

        {issue.source_value && issue.target_value && (
          <motion.div
            className="mt-3 flex items-center gap-3 text-xs bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex-1">
              <span className="font-semibold text-gray-500 block mb-1.5 uppercase tracking-wider text-[10px]">
                {String(t("common.source"))}
              </span>
              <code className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg font-medium border border-emerald-100">
                {issue.source_value}
              </code>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-semibold text-gray-500 block mb-1.5 uppercase tracking-wider text-[10px]">
                {String(t("common.target"))}
              </span>
              <code className="text-red-700 bg-red-50 px-2 py-1 rounded-lg font-medium border border-red-100">
                {issue.target_value}
              </code>
            </div>
          </motion.div>
        )}

        {issue.element_selector && (
          <div className="mt-2 text-xs text-gray-400 font-mono">
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">{issue.element_selector}</code>
          </div>
        )}

        {issue.fix_suggestion && (
          <motion.div
            className="mt-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              ✨ Fix suggestion
            </span>
            <p className="text-sm text-indigo-900 mt-1 font-medium">{issue.fix_suggestion}</p>
          </motion.div>
        )}

        <div className="mt-3 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="font-medium">Recommended fix:</span> {fixRec}
        </div>
      </Card>
    </motion.div>
  );
}
