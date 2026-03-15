"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useT } from "@/lib/i18n/dict-context";
import { signOut } from "@/lib/auth/client";
import { BarChart3, Plus, Globe, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SUPPORTED_LOCALE_CODES } from "@/lib/i18n/config";

interface AppShellProps {
  locale: string;
  children: React.ReactNode;
}

export function AppShell({ locale, children }: AppShellProps) {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: `/${locale}/dashboard`, label: t("nav.dashboard"), icon: BarChart3 },
    { href: `/${locale}/dashboard/audits`, label: t("nav.audits"), icon: Globe },
    { href: `/${locale}/dashboard/audits/new`, label: t("nav.newAudit"), icon: Plus },
  ];

  function switchLocale(newLocale: string) {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20">
      <header className="sticky top-0 z-50 bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}/dashboard`}>
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href.includes("/audits") &&
                    pathname.startsWith(item.href) &&
                    item.href !== `/${locale}/dashboard`);

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <select
                value={locale}
                onChange={(e) => switchLocale(e.target.value)}
                className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-2.5 py-1.5 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:outline-none hover:border-gray-300 dark:hover:border-gray-500 transition-all"
              >
                {SUPPORTED_LOCALE_CODES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc.toUpperCase()}
                  </option>
                ))}
              </select>

              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-1" />
                {t("nav.signOut")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        {children}
      </motion.main>
    </div>
  );
}
