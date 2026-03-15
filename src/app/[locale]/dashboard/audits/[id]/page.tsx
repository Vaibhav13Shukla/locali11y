"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ComparativeScoreCards } from "@/components/audit/comparative-score-cards";
import { ComparativeChart } from "@/components/audit/comparative-chart";
import { IssueList } from "@/components/audit/issue-list";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/dict-context";
import { ArrowLeft, Download, Wand2, ExternalLink, AlertTriangle, AlertCircle, Info, Share2 } from "lucide-react";
import { buildTopFindings } from "@/lib/audit/issue-insights";
import type { AuditRow, AuditLocaleResultRow, AuditIssueRow } from "@/types/database";

const severityConfig = {
  critical: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
  important: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
};

function AuditDetailContent() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const t = useT();
  const [audit, setAudit] = useState<AuditRow | null>(null);
  const [localeResults, setLocaleResults] = useState<AuditLocaleResultRow[]>([]);
  const [issues, setIssues] = useState<AuditIssueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLocale, setActiveLocale] = useState<string>("");
  const [generatingFixes, setGeneratingFixes] = useState(false);

  useEffect(() => {
    fetch(`/api/audits/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAudit(data.audit);
        setLocaleResults(data.localeResults ?? []);
        setIssues(data.issues ?? []);

        const worst = (data.localeResults ?? []).reduce(
          (w: AuditLocaleResultRow | null, r: AuditLocaleResultRow) =>
            !w || r.score < w.score ? r : w,
          null
        );
        if (worst) setActiveLocale(worst.locale);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleGenerateFixes() {
    const localeSpecificIssues = issues.filter((i) => i.locale === activeLocale && i.is_locale_specific);
    if (localeSpecificIssues.length === 0) {
      toast.info("No locale-specific issues to fix for this locale");
      return;
    }

    setGeneratingFixes(true);
    try {
      const res = await fetch(`/api/audits/${id}/fixes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: activeLocale,
          issueIds: localeSpecificIssues.slice(0, 20).map((i) => i.id),
        }),
      });

      const data = await res.json();

      if (res.ok && data.fixes) {
        setIssues((prev) =>
          prev.map((Issue) => {
            const fix = data.fixes.find((f: { issueId: string }) => f.issueId === Issue.id);
            return fix ? { ...Issue, fix_suggestion: fix.suggestedFix } : Issue;
          })
        );
        toast.success(`Generated ${data.fixes.length} fix suggestions`);
      } else {
        toast.error(data.error || "Failed to generate fixes");
      }
    } catch {
      toast.error("Failed to generate fixes");
    } finally {
      setGeneratingFixes(false);
    }
  }

  function exportFixes() {
    const localeIssuesWithFixes = issues.filter(
      (i) => i.locale === activeLocale && i.fix_suggestion
    );

    const exportData: Record<string, string> = {};
    localeIssuesWithFixes.forEach((issue) => {
      const key = issue.element_selector || issue.check_id;
      exportData[key] = issue.fix_suggestion!;
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `locali11y-fixes-${activeLocale}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Fixes exported!");
  }

  function handleShareResults() {
    if (!audit || !sourceResult) return;
    
    const worstResult = localeResults.reduce((w, r) => (!w || r.score < w.score ? r : w), localeResults[0]);
    const hostname = new URL(audit.target_url).hostname;
    const text = `${hostname} scores ${sourceResult.score} in ${audit.source_locale.toUpperCase()} but ${worstResult?.score ?? "?"} in ${worstResult?.locale.toUpperCase() ?? "?"}. ${totalLocaleSpecific} locale-specific accessibility issues found with Locali11y.`;

    if (navigator.share) {
      navigator.share({
        title: "Locali11y Audit Results",
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text + " " + window.location.href);
      toast.success("Results copied to clipboard!");
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  if (!audit) {
    return <div className="text-center py-20 text-gray-500">Audit not found</div>;
  }

  const sourceResult = localeResults.find((r) => r.locale === audit.source_locale);
  const totalLocaleSpecific = localeResults.reduce((sum, r) => sum + r.locale_specific_issues, 0);
  const activeLocaleIssues = issues.filter((i) => i.locale === activeLocale);
  const topFindings = activeLocale.length > 0 ? buildTopFindings(activeLocaleIssues) : [];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/${locale}/dashboard/audits`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("audit.results.backToList")}
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("audit.results.title")}</h1>
            <div className="flex items-center gap-2 mt-1">
              <a href={audit.target_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
                {audit.target_url} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <Link href={`/${locale}/dashboard/audits/new`}>
            <Button variant="secondary">{t("audit.results.runAnother")}</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500">{t("audit.results.sourceBaseline")}</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{sourceResult?.score ?? "—"}</p>
          <p className="text-xs text-gray-400">{audit.source_locale.toUpperCase()}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">{t("audit.results.worstLocale")}</p>
          <p className="text-3xl font-bold text-red-600 mt-1">
            {localeResults.length > 0 ? Math.min(...localeResults.map((r) => r.score)) : "—"}
          </p>
          <p className="text-xs text-gray-400">
            {localeResults.length > 0
              ? localeResults.reduce((w, r) => (r.score < w.score ? r : w)).locale.toUpperCase()
              : "—"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">{t("audit.results.localeSpecific")}</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{totalLocaleSpecific}</p>
          <p className="text-xs text-gray-400">{t("audit.results.localeSpecificDescription")}</p>
        </Card>
      </div>

      <ComparativeScoreCards
        localeResults={localeResults}
        sourceLocale={audit.source_locale}
        onLocaleClick={setActiveLocale}
        activeLocale={activeLocale}
      />

      <Card>
        <CardTitle>{t("audit.results.overallScore")}</CardTitle>
        <div className="mt-4">
          <ComparativeChart localeResults={localeResults} />
        </div>
      </Card>

      {activeLocale && topFindings.length > 0 && (
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            {t("audit.results.topFindings") || "Top Findings"}
          </CardTitle>
          <div className="mt-4 space-y-3">
            {topFindings.slice(0, 4).map((finding) => {
              const config = severityConfig[finding.severity];
              const Icon = config.icon;
              return (
                <div
                  key={finding.id}
                  className={`p-3 rounded-lg ${config.bg} flex items-start gap-3`}
                >
                  <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{finding.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>
                        {finding.count} {finding.count === 1 ? "issue" : "issues"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {activeLocale && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeLocale.toUpperCase()} — {t("audit.results.issuesLabel")}
              </h2>
              <Badge variant="info">
                {issues.filter((i) => i.locale === activeLocale).length} total
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleShareResults}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="secondary" size="sm" onClick={handleGenerateFixes} loading={generatingFixes}>
                <Wand2 className="h-4 w-4 mr-1" />
                {t("audit.results.generateFixes")}
              </Button>
              {issues.some((i) => i.locale === activeLocale && i.fix_suggestion) && (
                <Button variant="secondary" size="sm" onClick={exportFixes}>
                  <Download className="h-4 w-4 mr-1" />
                  {t("audit.results.exportFixes")}
                </Button>
              )}
            </div>
          </div>
          <IssueList issues={issues} locale={activeLocale} />
        </div>
      )}
    </div>
  );
}

export default function AuditDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>}>
      <AuditDetailContent />
    </Suspense>
  );
}
