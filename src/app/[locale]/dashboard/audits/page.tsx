"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AuditList } from "@/components/dashboard/audit-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useT } from "@/lib/i18n/dict-context";
import { Globe, Plus } from "lucide-react";
import type { AuditSummary } from "@/types/api";

export default function AuditsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useT();
  const [audits, setAudits] = useState<AuditSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audits")
      .then((res) => res.json())
      .then((data) => setAudits(data.audits ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t("nav.audits")}</h1>
        <Link href={`/${locale}/dashboard/audits/new`}>
          <Button><Plus className="h-4 w-4 mr-2" />{t("nav.newAudit")}</Button>
        </Link>
      </div>

      {audits.length > 0 ? (
        <AuditList audits={audits} locale={locale} />
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
