import type { CheckContext, CheckFunction } from "../types";
import type { CheckResult } from "@/types/audit";
import { MAX_ELEMENT_HTML_LENGTH } from "@/lib/constants";

export const checkHreflangTags: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const hreflangLinks = $('link[rel="alternate"][hreflang]');
  const passed = hreflangLinks.length > 0;

  return [
    {
      checkId: "hreflang-tags",
      passed,
      severity: "info",
      category: "seo",
      targetValue: passed ? `${hreflangLinks.length} found` : "(none)",
    },
  ];
};

export const checkTitleAttrPresent: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const results: CheckResult[] = [];

  $("a[title], img[title]").each((i, el) => {
    const title = $(el).attr("title");
    if (title !== undefined && title.trim().length === 0) {
      results.push({
        checkId: "title-attr-present",
        passed: false,
        severity: "info",
        category: "seo",
        elementSelector: $(el).prop("tagName")?.toLowerCase() ?? `[title]:nth(${i})`,
        elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
        targetValue: "(empty title attribute)",
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "title-attr-present", passed: true, severity: "info", category: "seo" });
  }
  return results;
};
