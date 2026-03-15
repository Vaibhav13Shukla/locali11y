import { AppShell } from "@/components/ui/app-shell";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <AppShell locale={locale}>{children}</AppShell>;
}
