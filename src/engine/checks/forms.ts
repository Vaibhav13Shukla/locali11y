import type { CheckContext, CheckFunction } from "../types";
import type { CheckResult } from "@/types/audit";
import { MAX_ELEMENT_HTML_LENGTH } from "@/lib/constants";

export const checkFormLabels: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const results: CheckResult[] = [];

  $("input, select, textarea").each((i, el) => {
    const type = $(el).attr("type") ?? "";
    if (["hidden", "submit", "button", "reset", "image"].includes(type)) return;

    const id = $(el).attr("id");
    const ariaLabel = $(el).attr("aria-label")?.trim() ?? "";
    const ariaLabelledby = $(el).attr("aria-labelledby") ?? "";
    let hasLabel = ariaLabel.length > 0 || ariaLabelledby.length > 0;

    if (id && !hasLabel) {
      hasLabel = $(`label[for="${id}"]`).length > 0;
    }

    if (!hasLabel) {
      hasLabel = $(el).closest("label").length > 0;
    }

    if (!hasLabel) {
      results.push({
        checkId: "form-labels-present",
        passed: false,
        severity: "critical",
        category: "forms",
        elementSelector: id ? `#${id}` : `${$(el).prop("tagName")?.toLowerCase() ?? "input"}:nth-of-type(${i + 1})`,
        elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
        targetValue: "(no associated label)",
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "form-labels-present", passed: true, severity: "critical", category: "forms" });
  }
  return results;
};

export const checkPlaceholderTranslated: CheckFunction = ({ $, source$ }: CheckContext): CheckResult[] => {
  if (!source$) return [{ checkId: "placeholder-translated", passed: true, severity: "important", category: "forms" }];

  const results: CheckResult[] = [];
  const sourcePlaceholders = new Map<string, string>();

  source$("[placeholder]").each((_, el) => {
    const name = source$(el).attr("name") || source$(el).attr("id") || "";
    const ph = source$(el).attr("placeholder") ?? "";
    if (name && ph.length > 3) sourcePlaceholders.set(name, ph);
  });

  $("[placeholder]").each((i, el) => {
    const name = $(el).attr("name") || $(el).attr("id") || "";
    const ph = $(el).attr("placeholder") ?? "";
    const sourcePh = sourcePlaceholders.get(name);

    if (sourcePh && ph === sourcePh && ph.length > 3) {
      results.push({
        checkId: "placeholder-translated",
        passed: false,
        severity: "important",
        category: "forms",
        elementSelector: name ? `[name="${name}"]` : `[placeholder]:nth(${i})`,
        sourceValue: sourcePh,
        targetValue: ph,
        isLocaleSpecific: true,
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "placeholder-translated", passed: true, severity: "important", category: "forms" });
  }
  return results;
};

export const checkSubmitTranslated: CheckFunction = ({ $, source$ }: CheckContext): CheckResult[] => {
  if (!source$) return [{ checkId: "submit-button-translated", passed: true, severity: "important", category: "forms" }];

  const results: CheckResult[] = [];
  const sourceValues: string[] = [];

  source$('input[type="submit"]').each((_, el) => {
    const val = source$(el).attr("value")?.trim() ?? "";
    if (val.length > 0) sourceValues.push(val);
  });

  $('input[type="submit"]').each((i, el) => {
    const val = $(el).attr("value")?.trim() ?? "";
    if (val.length > 0 && sourceValues.includes(val)) {
      results.push({
        checkId: "submit-button-translated",
        passed: false,
        severity: "important",
        category: "forms",
        elementSelector: `input[type="submit"]:nth-of-type(${i + 1})`,
        sourceValue: val,
        targetValue: val,
        isLocaleSpecific: true,
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "submit-button-translated", passed: true, severity: "important", category: "forms" });
  }
  return results;
};
