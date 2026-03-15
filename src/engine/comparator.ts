import type { CheckResult, LocaleAuditResult } from "@/types/audit";
import { computeScore, countBySeverity } from "./scorer";

export function buildLocaleResult(
  locale: string,
  localeUrl: string,
  checkResults: CheckResult[]
): LocaleAuditResult {
  const failures = checkResults.filter((r) => !r.passed);
  const passed = checkResults.filter((r) => r.passed);
  const severity = countBySeverity(checkResults);
  const localeSpecificIssues = failures.filter((r) => r.isLocaleSpecific).length;

  return {
    locale,
    localeUrl,
    score: computeScore(checkResults),
    totalChecks: checkResults.length,
    passedChecks: passed.length,
    failedChecks: failures.length,
    criticalIssues: severity.critical,
    importantIssues: severity.important,
    infoIssues: severity.info,
    localeSpecificIssues,
    issues: failures,
  };
}
