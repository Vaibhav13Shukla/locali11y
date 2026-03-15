import type { AuditIssueRow } from "@/types/database";

export interface TopFinding {
  id: string;
  title: string;
  description: string;
  count: number;
  severity: "critical" | "important" | "info";
  checkIds: string[];
}

const HIGH_VALUE_CHECK_PRIORITY: Record<string, number> = {
  "html-lang-present": 1,
  "aria-label-translated": 2,
  "page-title-translated": 3,
  "placeholder-translated": 4,
  "meta-description-translated": 5,
  "og-tags-translated": 6,
  "img-alt-translated": 7,
  "aria-describedby-valid": 8,
  "form-labels-present": 9,
  "submit-button-translated": 10,
  "img-alt-present": 20,
  "button-text-present": 21,
  "link-text-present": 22,
  "empty-interactive": 23,
  "hreflang-tags": 24,
  "title-attr-present": 25,
  "heading-hierarchy": 26,
  "skip-navigation": 27,
  "dir-attribute": 28,
};

const SEVERITY_ORDER: Record<AuditIssueRow["severity"], number> = {
  critical: 1,
  important: 2,
  info: 3,
};

export function prioritizeIssues(issues: AuditIssueRow[]): AuditIssueRow[] {
  return [...issues].sort((a, b) => {
    if (a.is_locale_specific !== b.is_locale_specific) {
      return a.is_locale_specific ? -1 : 1;
    }

    const aPriority = HIGH_VALUE_CHECK_PRIORITY[a.check_id] ?? 999;
    const bPriority = HIGH_VALUE_CHECK_PRIORITY[b.check_id] ?? 999;
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    const severityDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (severityDiff !== 0) {
      return severityDiff;
    }

    return a.check_id.localeCompare(b.check_id);
  });
}

export function buildTopFindings(issues: AuditIssueRow[]): TopFinding[] {
  const localeSpecificIssues = issues.filter((issue) => issue.is_locale_specific);
  const groups: TopFinding[] = [];

  const htmlLangIssues = localeSpecificIssues.filter((issue) => issue.check_id === "html-lang-present");
  if (htmlLangIssues.length > 0) {
    groups.push({
      id: "wrong-html-lang",
      title: "Incorrect html lang attribute",
      description: "This locale declares the wrong page language, which can cause screen readers to use the wrong voice profile.",
      count: htmlLangIssues.length,
      severity: "critical",
      checkIds: ["html-lang-present"],
    });
  }

  const untranslatedAria = localeSpecificIssues.filter((issue) => issue.check_id === "aria-label-translated");
  if (untranslatedAria.length > 0) {
    groups.push({
      id: "untranslated-aria",
      title: "Untranslated ARIA labels",
      description: "Screen reader labels are still in the source language, so blind users hear English controls on non-English pages.",
      count: untranslatedAria.length,
      severity: "important",
      checkIds: ["aria-label-translated"],
    });
  }

  const untranslatedTitle = localeSpecificIssues.filter((issue) => issue.check_id === "page-title-translated");
  if (untranslatedTitle.length > 0) {
    groups.push({
      id: "untranslated-title",
      title: "Untranslated page title",
      description: "The page title matches the source locale, which can confuse screen reader navigation and browser tabs.",
      count: untranslatedTitle.length,
      severity: "important",
      checkIds: ["page-title-translated"],
    });
  }

  const untranslatedPlaceholder = localeSpecificIssues.filter((issue) => issue.check_id === "placeholder-translated");
  if (untranslatedPlaceholder.length > 0) {
    groups.push({
      id: "untranslated-placeholder",
      title: "Untranslated placeholders",
      description: "Inputs still use source-language placeholder text, which makes forms harder to understand in this locale.",
      count: untranslatedPlaceholder.length,
      severity: "important",
      checkIds: ["placeholder-translated"],
    });
  }

  const untranslatedMeta = localeSpecificIssues.filter(
    (issue) => issue.check_id === "meta-description-translated" || issue.check_id === "og-tags-translated"
  );
  if (untranslatedMeta.length > 0) {
    groups.push({
      id: "untranslated-meta",
      title: "Untranslated metadata",
      description: "SEO and social preview metadata are still in the source language for this locale.",
      count: untranslatedMeta.length,
      severity: "important",
      checkIds: ["meta-description-translated", "og-tags-translated"],
    });
  }

  const untranslatedAlt = localeSpecificIssues.filter((issue) => issue.check_id === "img-alt-translated");
  if (untranslatedAlt.length > 0) {
    groups.push({
      id: "untranslated-alt",
      title: "Untranslated image alt text",
      description: "Images still use source-language alt text, so screen reader users get the wrong language context.",
      count: untranslatedAlt.length,
      severity: "important",
      checkIds: ["img-alt-translated"],
    });
  }

  return groups.sort((a, b) => {
    const severityDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return b.count - a.count;
  });
}
