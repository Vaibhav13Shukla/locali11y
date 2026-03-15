import type { CheckContext, CheckFunction } from "../types";
import type { CheckResult } from "@/types/audit";
import { MAX_ELEMENT_HTML_LENGTH } from "@/lib/constants";
import type { CheerioAPI } from "cheerio";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasAccessibleName($el: any, $: CheerioAPI): boolean {
  const text = $el.text().trim();
  const ariaLabel = $el.attr("aria-label")?.trim();
  const ariaLabelledby = $el.attr("aria-labelledby");
  const title = $el.attr("title")?.trim();

  if (text && text.length > 0) return true;
  if (ariaLabel && ariaLabel.length > 0) return true;
  if (title && title.length > 0) return true;
  if (ariaLabelledby) {
    const ref = $(`#${ariaLabelledby}`);
    if (ref.text().trim().length > 0) return true;
  }
  return false;
}

export const checkButtonTextPresent: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const results: CheckResult[] = [];

  $("button, [role='button']").each((i, el) => {
    if (!hasAccessibleName($(el), $)) {
      results.push({
        checkId: "button-text-present",
        passed: false,
        severity: "critical",
        category: "navigation",
        elementSelector: `button:nth-of-type(${i + 1})`,
        elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
        targetValue: "(no accessible name)",
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "button-text-present", passed: true, severity: "critical", category: "navigation" });
  }
  return results;
};

export const checkLinkTextPresent: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const results: CheckResult[] = [];

  $("a[href]").each((i, el) => {
    const href = $(el).attr("href") ?? "";
    if (href.startsWith("#") || href.startsWith("javascript:")) return;

    if (!hasAccessibleName($(el), $)) {
      results.push({
        checkId: "link-text-present",
        passed: false,
        severity: "critical",
        category: "navigation",
        elementSelector: href ? `a[href="${href.slice(0, 60)}"]` : `a:nth-of-type(${i + 1})`,
        elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
        targetValue: "(no accessible name)",
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "link-text-present", passed: true, severity: "critical", category: "navigation" });
  }
  return results;
};

export const checkEmptyInteractive: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const results: CheckResult[] = [];

  $("button, a[href], [role='button'], [role='link']").each((i, el) => {
    const innerHTML = $(el).html()?.trim() ?? "";
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label")?.trim() ?? "";

    if (innerHTML.length > 0 && text.length === 0 && ariaLabel.length === 0) {
      results.push({
        checkId: "empty-interactive",
        passed: false,
        severity: "critical",
        category: "navigation",
        elementSelector: $(el).prop("tagName")?.toLowerCase() ?? `interactive:nth(${i})`,
        elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
        targetValue: "(has content but no accessible text)",
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "empty-interactive", passed: true, severity: "critical", category: "navigation" });
  }
  return results;
};
