"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/motion";
import { useT } from "@/lib/i18n/dict-context";
import { Globe, Search, X, Plus, Zap } from "lucide-react";

interface DetectedLocale {
  locale: string;
  url: string;
  source: string;
}

const EXAMPLE_SITES = [
  {
    name: "Google Support",
    url: "https://support.google.com",
    icon: "🔍",
    description: "60+ locale-specific issues",
  },
  {
    name: "IKEA",
    url: "https://www.ikea.com/us/en/",
    icon: "🪑",
    description: "Untranslated ARIA labels",
  },
  {
    name: "Wikipedia",
    url: "https://en.wikipedia.org",
    icon: "📚",
    description: "World's largest multilingual site",
  },
];

export function AuditForm({ locale }: { locale: string }) {
  const t = useT();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [running, setRunning] = useState(false);
  const [detectedLocales, setDetectedLocales] = useState<DetectedLocale[]>([]);
  const [sourceLocale, setSourceLocale] = useState("en");
  const [targetLocales, setTargetLocales] = useState<string[]>([]);
  const [manualLocale, setManualLocale] = useState("");
  const [detected, setDetected] = useState(false);

  async function handleDetect() {
    if (!url.startsWith("http")) {
      toast.error(t("audit.new.errors.invalidUrl"));
      return;
    }

    setDetecting(true);
    try {
      const res = await fetch("/api/detect-locales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || t("audit.new.errors.fetchFailed"));
        return;
      }

      setDetectedLocales(data.detectedLocales);
      setSourceLocale(data.suggestedSource);
      setTargetLocales(
        data.detectedLocales
          .filter((d: DetectedLocale) => d.locale !== data.suggestedSource)
          .map((d: DetectedLocale) => d.locale)
          .slice(0, 5)
      );
      setDetected(true);
    } catch {
      toast.error(t("audit.new.errors.fetchFailed"));
    } finally {
      setDetecting(false);
    }
  }

  function addManualLocale() {
    const loc = manualLocale.trim().toLowerCase();
    if (loc.length >= 2 && !targetLocales.includes(loc) && loc !== sourceLocale) {
      setTargetLocales([...targetLocales, loc]);
      setManualLocale("");
    }
  }

  function removeTargetLocale(loc: string) {
    setTargetLocales(targetLocales.filter((l) => l !== loc));
  }

  async function handleRunAudit() {
    if (targetLocales.length === 0) {
      toast.error(t("audit.new.errors.noLocales"));
      return;
    }

    setRunning(true);
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl: url, sourceLocale, targetLocales }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || t("audit.new.errors.auditFailed"));
        return;
      }

      if (data.status === "completed") {
        toast.success("Audit completed!");
        router.push(`/${locale}/dashboard/audits/${data.auditId}`);
      } else {
        toast.error(data.errorMessage || t("audit.new.errors.auditFailed"));
      }
    } catch {
      toast.error(t("audit.new.errors.auditFailed"));
    } finally {
      setRunning(false);
    }
  }

  if (running) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="text-center" padding="lg">
          <motion.div
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
            animate={{
              rotate: [0, 90, 180, 270, 360],
              borderRadius: ["16px", "24px", "16px", "24px", "16px"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Globe className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900">{t("audit.new.running")}</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">{t("audit.new.runningDescription")}</p>

          {/* Animated progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-indigo-600"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("audit.new.title")}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{t("audit.new.subtitle")}</p>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <Label htmlFor="url">{t("audit.new.urlLabel")}</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("audit.new.urlPlaceholder")}
              />
              <Button onClick={handleDetect} loading={detecting} variant="secondary">
                <Search className="h-4 w-4 mr-1" />
                {t("audit.new.detectButton")}
              </Button>
            </div>
          </div>

          {!detected && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Try a popular site:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EXAMPLE_SITES.map((site) => (
                  <SpotlightCard key={site.url}>
                    <motion.button
                      type="button"
                      onClick={() => setUrl(site.url)}
                      className="text-left rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group w-full"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{site.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">
                            {site.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {site.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {detected && (
            <>
              {detectedLocales.length > 0 ? (
                <div>
                  <Label>{t("audit.new.detectedLocales")}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {detectedLocales.map((dl) => (
                      <Badge
                        key={dl.locale}
                        variant={dl.locale === sourceLocale ? "success" : "default"}
                      >
                        {dl.locale.toUpperCase()} ({dl.source})
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-amber-600">{t("audit.new.noLocalesDetected")}</p>
              )}

              <div>
                <Label>{t("audit.new.sourceLocale")}</Label>
                <select
                  value={sourceLocale}
                  onChange={(e) => {
                    setSourceLocale(e.target.value);
                    setTargetLocales(targetLocales.filter((l) => l !== e.target.value));
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {[...new Set([sourceLocale, ...detectedLocales.map((d) => d.locale)])].map((loc) => (
                    <option key={loc} value={loc}>{loc.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>{t("audit.new.targetLocales")}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {targetLocales.map((loc) => (
                    <Badge key={loc} variant="info" className="cursor-pointer" onClick={() => removeTargetLocale(loc)}>
                      {loc.toUpperCase()} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={manualLocale}
                    onChange={(e) => setManualLocale(e.target.value)}
                    placeholder={t("audit.new.manualLocale")}
                    className="max-w-[120px]"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addManualLocale())}
                  />
                  <Button variant="ghost" size="sm" onClick={addManualLocale}>
                    <Plus className="h-4 w-4" />
                    {t("audit.new.addLocale")}
                  </Button>
                </div>
              </div>

              <Button onClick={handleRunAudit} className="w-full" size="lg">
                <Globe className="h-5 w-5 mr-2" />
                {t("audit.new.startAudit")}
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
