"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { AuditList } from "@/components/dashboard/audit-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useT } from "@/lib/i18n/dict-context";
import { Globe, Plus } from "lucide-react";
import type { AuditSummary } from "@/types/api";

function DashboardContent() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useT();
  const [metrics, setMetrics] = useState({ totalAudits: 0, avgScore: 0, totalLocaleSpecificIssues: 0 });
  const [audits, setAudits] = useState<AuditSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [metricsRes, auditsRes] = await Promise.all([
          fetch("/api/dashboard/metrics"),
          fetch("/api/audits"),
        ]);

        if (metricsRes.ok) setMetrics(await metricsRes.json());
        if (auditsRes.ok) {
          const data = await auditsRes.json();
          setAudits(data.audits || []);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.title")}</h1>
          <p className="text-gray-500 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <Link href={`/${locale}/dashboard/audits/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("nav.newAudit")}
          </Button>
        </Link>
      </div>

      {metrics.totalAudits > 0 && (
        <MetricsCards
          totalAudits={metrics.totalAudits}
          avgScore={metrics.avgScore}
          totalLocaleSpecificIssues={metrics.totalLocaleSpecificIssues}
        />
      )}

      {audits.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("dashboard.recentAudits")}</h2>
          <AuditList audits={audits.slice(0, 10)} locale={locale} />
        </div>
      ) : (
        <EmptyState
          icon={<Globe className="h-12 w-12" />}
          title={t("dashboard.noAudits")}
          description={t("dashboard.noAuditsDescription")}
          action={
            <Link href={`/${locale}/dashboard/audits/new`}>
              <Button>{t("dashboard.startAudit")}</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
