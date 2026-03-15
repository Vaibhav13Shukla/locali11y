import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";
import { createAuditSchema } from "@/lib/validations/audit";
import { fetchHtml } from "@/engine/fetcher";
import { runAudit } from "@/engine/audit-runner";
import { buildLocaleResult } from "@/engine/comparator";
import { logger } from "@/lib/utils/logger";
import type { LocaleAuditResult } from "@/types/audit";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createAuditSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues[0]?.message ?? parsed.error.message ?? "Invalid input";
      return NextResponse.json(
        { error: errorMessage, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { targetUrl, sourceLocale, targetLocales } = parsed.data;

    const { data: audit, error: auditError } = await supabase
      .from("audits")
      .insert({
        user_id: user.id,
        target_url: targetUrl,
        source_locale: sourceLocale,
        target_locales: targetLocales,
        status: "running",
      })
      .select()
      .single();

    if (auditError || !audit) {
      return NextResponse.json({ error: "Failed to create audit", code: "CREATE_FAILED" }, { status: 500 });
    }

    try {
      const sourceHtml = await fetchHtml(targetUrl);
      const sourceCheckResults = runAudit(sourceHtml, sourceLocale);
      const sourceResult = buildLocaleResult(sourceLocale, targetUrl, sourceCheckResults);

      const { data: sourceLocaleResult } = await supabase
        .from("audit_locale_results")
        .insert({
          audit_id: audit.id,
          locale: sourceResult.locale,
          locale_url: sourceResult.localeUrl,
          score: sourceResult.score,
          total_checks: sourceResult.totalChecks,
          passed_checks: sourceResult.passedChecks,
          failed_checks: sourceResult.failedChecks,
          critical_issues: sourceResult.criticalIssues,
          important_issues: sourceResult.importantIssues,
          info_issues: sourceResult.infoIssues,
          locale_specific_issues: 0,
        })
        .select()
        .single();

      if (sourceLocaleResult) {
        const sourceIssues = sourceResult.issues.map((issue) => ({
          audit_id: audit.id,
          locale_result_id: sourceLocaleResult.id,
          locale: sourceResult.locale,
          check_id: issue.checkId,
          severity: issue.severity,
          category: issue.category,
          element_selector: issue.elementSelector ?? null,
          element_html: issue.elementHtml ?? null,
          source_value: null,
          target_value: issue.targetValue ?? null,
          is_locale_specific: false,
        }));

        if (sourceIssues.length > 0) {
          await supabase.from("audit_issues").insert(sourceIssues);
        }
      }

      const targetResults: LocaleAuditResult[] = [];

      for (const targetLoc of targetLocales) {
        try {
          const targetLocaleUrl = buildLocaleUrl(targetUrl, sourceLocale, targetLoc);
          const targetHtml = await fetchHtml(targetLocaleUrl);
          const targetCheckResults = runAudit(targetHtml, targetLoc, sourceHtml, sourceLocale);
          const targetResult = buildLocaleResult(targetLoc, targetLocaleUrl, targetCheckResults);
          targetResults.push(targetResult);

          const { data: localeResult } = await supabase
            .from("audit_locale_results")
            .insert({
              audit_id: audit.id,
              locale: targetResult.locale,
              locale_url: targetResult.localeUrl,
              score: targetResult.score,
              total_checks: targetResult.totalChecks,
              passed_checks: targetResult.passedChecks,
              failed_checks: targetResult.failedChecks,
              critical_issues: targetResult.criticalIssues,
              important_issues: targetResult.importantIssues,
              info_issues: targetResult.infoIssues,
              locale_specific_issues: targetResult.localeSpecificIssues,
            })
            .select()
            .single();

          if (localeResult && targetResult.issues.length > 0) {
            const issues = targetResult.issues.map((issue) => ({
              audit_id: audit.id,
              locale_result_id: localeResult.id,
              locale: targetLoc,
              check_id: issue.checkId,
              severity: issue.severity,
              category: issue.category,
              element_selector: issue.elementSelector ?? null,
              element_html: issue.elementHtml ?? null,
              source_value: issue.sourceValue ?? null,
              target_value: issue.targetValue ?? null,
              is_locale_specific: issue.isLocaleSpecific ?? false,
            }));

            await supabase.from("audit_issues").insert(issues);
          }
        } catch (error) {
          logger.warn(`Failed to audit locale ${targetLoc}`, error);
        }
      }

      await supabase
        .from("audits")
        .update({ status: "completed" })
        .eq("id", audit.id);

      return NextResponse.json({
        auditId: audit.id,
        status: "completed",
        results: {
          sourceLocale: {
            locale: sourceResult.locale,
            score: sourceResult.score,
            issues: sourceResult.failedChecks,
          },
          targetLocales: targetResults.map((r) => ({
            locale: r.locale,
            score: r.score,
            issues: r.failedChecks,
            localeSpecificIssues: r.localeSpecificIssues,
          })),
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Audit failed";
      await supabase
        .from("audits")
        .update({ status: "failed", error_message: message })
        .eq("id", audit.id);

      return NextResponse.json({
        auditId: audit.id,
        status: "failed",
        errorMessage: message,
      });
    }
  } catch {
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const { data: audits } = await supabase
      .from("audits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!audits || audits.length === 0) {
      return NextResponse.json({ audits: [] });
    }

    const auditIds = audits.map((a) => a.id);
    const { data: localeResults } = await supabase
      .from("audit_locale_results")
      .select("*")
      .in("audit_id", auditIds);

    const summaries = audits.map((audit) => {
      const results = (localeResults ?? []).filter((r) => r.audit_id === audit.id);
      const scores = results.map((r) => r.score);
      const localeSpecificTotal = results.reduce((sum, r) => sum + r.locale_specific_issues, 0);

      return {
        id: audit.id,
        targetUrl: audit.target_url,
        sourceLocale: audit.source_locale,
        targetLocales: audit.target_locales,
        status: audit.status,
        createdAt: audit.created_at,
        bestScore: scores.length > 0 ? Math.max(...scores) : 0,
        worstScore: scores.length > 0 ? Math.min(...scores) : 0,
        worstLocale: results.length > 0
          ? results.reduce((worst, r) => (r.score < worst.score ? r : worst), results[0]!).locale
          : "",
        totalLocaleSpecificIssues: localeSpecificTotal,
      };
    });

    return NextResponse.json({ audits: summaries });
  } catch {
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}

function buildLocaleUrl(baseUrl: string, sourceLocale: string, targetLocale: string): string {
  const url = new URL(baseUrl);
  const pathParts = url.pathname.split("/").filter(Boolean);

  const countryLocaleMap: Record<string, { country: string; locale: string }> = {
    en: { country: "us", locale: "en" },
    ja: { country: "jp", locale: "ja" },
    es: { country: "es", locale: "es" },
    de: { country: "de", locale: "de" },
    fr: { country: "fr", locale: "fr" },
    zh: { country: "cn", locale: "zh" },
    ko: { country: "kr", locale: "ko" },
    pt: { country: "br", locale: "pt" },
    it: { country: "it", locale: "it" },
    nl: { country: "nl", locale: "nl" },
    ru: { country: "ru", locale: "ru" },
  };

  if (pathParts.length >= 2) {
    const possibleCountry = pathParts[0]?.toLowerCase();
    const possibleLocale = pathParts[1]?.toLowerCase();
    if (possibleLocale && possibleLocale.length === 2) {
      const targetMapping = countryLocaleMap[targetLocale];
      if (targetMapping) {
        const newParts = [...pathParts];
        newParts[0] = targetMapping.country;
        newParts[1] = targetMapping.locale;
        url.pathname = "/" + newParts.join("/");
        return url.toString();
      }
    }
  }

  if (pathParts.length >= 1 && pathParts[0]?.length === 2) {
    const firstPart = pathParts[0]!.toLowerCase();
    if (firstPart === sourceLocale.split("-")[0]) {
      pathParts[0] = targetLocale.split("-")[0]!;
      url.pathname = "/" + pathParts.join("/");
      return url.toString();
    }
  }

  if (url.searchParams.has("lang")) {
    url.searchParams.set("lang", targetLocale);
    return url.toString();
  }

  if (url.searchParams.has("locale")) {
    url.searchParams.set("locale", targetLocale);
    return url.toString();
  }

  const sourceShort = sourceLocale.split("-")[0]!;
  const targetShort = targetLocale.split("-")[0]!;
  const regex = new RegExp(`\\b${sourceShort}\\b`, "gi");
  if (regex.test(url.pathname)) {
    url.pathname = url.pathname.replace(regex, targetShort);
    return url.toString();
  }

  url.pathname = `/${targetShort}${url.pathname}`;
  return url.toString();
}
