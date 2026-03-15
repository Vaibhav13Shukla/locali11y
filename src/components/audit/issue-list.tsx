"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { IssueCard } from "./issue-card";
import { useT } from "@/lib/i18n/dict-context";
import type { AuditIssueRow } from "@/types/database";

interface IssueListProps {
  issues: AuditIssueRow[];
  locale: string;
}

export function IssueList({ issues, locale }: IssueListProps) {
  const t = useT();
  const localeIssues = issues.filter((i) => i.locale === locale);
  const [filter, setFilter] = useState("all");

  const tabs = [
    { id: "all", label: "All", count: localeIssues.length },
    { id: "locale-specific", label: "Locale-specific", count: localeIssues.filter((i) => i.is_locale_specific).length },
    { id: "critical", label: t("audit.severity.critical"), count: localeIssues.filter((i) => i.severity === "critical").length },
    { id: "important", label: t("audit.severity.important"), count: localeIssues.filter((i) => i.severity === "important").length },
  ];

  const filtered = localeIssues.filter((issue) => {
    if (filter === "all") return true;
    if (filter === "locale-specific") return issue.is_locale_specific;
    return issue.severity === filter;
  });

  if (localeIssues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg font-medium text-emerald-600">{t("audit.results.allPassed")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs tabs={tabs} activeTab={filter} onChange={setFilter} />
      <div className="space-y-3">
        {filtered.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
