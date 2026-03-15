import type { CheckContext, CheckFunction } from "../types";
import type { CheckResult } from "@/types/audit";
import { MAX_ELEMENT_HTML_LENGTH } from "@/lib/constants";
import { shouldIgnoreComparativeValue } from "../ignore-rules";

export const checkAriaLabelPresent: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const results: CheckResult[] = [];

  $("[aria-label]").each((i, el) => {
    const value = $(el).attr("aria-label");
    if (!value || value.trim().length === 0) {
      results.push({
        checkId: "aria-label-present",
        passed: false,
        severity: "critical",
        category: "aria",
        elementSelector: $(el).prop("tagName")?.toLowerCase() ?? `[aria-label]:nth(${i})`,
        elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
        targetValue: value ?? "(empty)",
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "aria-label-present", passed: true, severity: "critical", category: "aria" });
  }
  return results;
};

export const checkAriaLabelTranslated: CheckFunction = ({ $, source$, locale }: CheckContext): CheckResult[] => {
  if (!source$) return [{ checkId: "aria-label-translated", passed: true, severity: "important", category: "aria" }];

  const results: CheckResult[] = [];
  const sourceLabels: string[] = [];

  source$("[aria-label]").each((_, el) => {
    const val = source$(el).attr("aria-label");
    if (val && val.trim().length > 0) sourceLabels.push(val);
  });

  $("[aria-label]").each((i, el) => {
    const val = $(el).attr("aria-label");
    if (val && val.trim().length > 3 && sourceLabels.includes(val)) {
      if (shouldIgnoreComparativeValue(val, locale)) {
        return;
      }
      
      results.push({
        checkId: "aria-label-translated",
        passed: false,
        severity: "important",
        category: "aria",
        elementSelector: $(el).prop("tagName")?.toLowerCase() ?? `[aria-label]:nth(${i})`,
        elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
        sourceValue: val,
        targetValue: val,
        isLocaleSpecific: true,
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "aria-label-translated", passed: true, severity: "important", category: "aria" });
  }
  return results;
};

export const checkAriaDescribedby: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const results: CheckResult[] = [];

  $("[aria-describedby]").each((i, el) => {
    const refId = $(el).attr("aria-describedby");
    if (refId) {
      const target = $(`#${refId}`);
      if (target.length === 0 || (target.text() ?? "").trim().length === 0) {
        results.push({
          checkId: "aria-describedby-valid",
          passed: false,
          severity: "critical",
          category: "aria",
          elementSelector: `[aria-describedby="${refId}"]`,
          elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
          targetValue: target.length === 0 ? "(element not found)" : "(empty text)",
        });
      }
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "aria-describedby-valid", passed: true, severity: "critical", category: "aria" });
  }
  return results;
};
