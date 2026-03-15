export interface CheckResult {
  checkId: string;
  passed: boolean;
  severity: "critical" | "important" | "info";
  category: string;
  elementSelector?: string;
  elementHtml?: string;
  sourceValue?: string;
  targetValue?: string;
  isLocaleSpecific?: boolean;
}

export interface LocaleAuditResult {
  locale: string;
  localeUrl: string;
  score: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  criticalIssues: number;
  importantIssues: number;
  infoIssues: number;
  localeSpecificIssues: number;
  issues: CheckResult[];
}

export interface AuditResult {
  sourceLocale: string;
  results: LocaleAuditResult[];
}

export interface DetectedLocale {
  locale: string;
  url: string;
  source: "hreflang" | "url_pattern" | "link_tag" | "meta_tag" | "manual";
}
