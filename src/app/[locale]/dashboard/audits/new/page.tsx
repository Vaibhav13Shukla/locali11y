import { AuditForm } from "@/components/audit/audit-form";

export default async function NewAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AuditForm locale={locale} />;
}
