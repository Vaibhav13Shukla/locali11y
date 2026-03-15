import type { CheckContext, CheckFunction } from "../types";
import type { CheckResult } from "@/types/audit";
import { MAX_ELEMENT_HTML_LENGTH } from "@/lib/constants";

export const checkImgAltPresent: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const results: CheckResult[] = [];

  $("img").each((i, el) => {
    const alt = $(el).attr("alt");
    const src = $(el).attr("src") ?? "";
    const passed = alt !== undefined && alt.trim().length > 0;

    if (!passed) {
      results.push({
        checkId: "img-alt-present",
        passed: false,
        severity: "critical",
        category: "images",
        elementSelector: src ? `img[src="${src.slice(0, 60)}"]` : `img:nth-of-type(${i + 1})`,
        elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
        targetValue: alt ?? "(missing)",
      });
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "img-alt-present", passed: true, severity: "critical", category: "images" });
  }

  return results;
};

export const checkImgAltTranslated: CheckFunction = ({ $, source$ }: CheckContext): CheckResult[] => {
  if (!source$) return [{ checkId: "img-alt-translated", passed: true, severity: "important", category: "images" }];

  const results: CheckResult[] = [];
  const sourceAlts = new Map<string, string>();

  source$("img").each((_, el) => {
    const src = source$(el).attr("src");
    const alt = source$(el).attr("alt");
    if (src && alt && alt.trim().length > 0) {
      sourceAlts.set(src, alt);
    }
  });

  $("img").each((i, el) => {
    const src = $(el).attr("src");
    const alt = $(el).attr("alt");
    if (src && alt && alt.trim().length > 0) {
      const sourceAlt = sourceAlts.get(src);
      if (sourceAlt && sourceAlt === alt && sourceAlt.length > 3) {
        results.push({
          checkId: "img-alt-translated",
          passed: false,
          severity: "important",
          category: "images",
          elementSelector: `img[src="${src.slice(0, 60)}"]`,
          elementHtml: $.html(el)?.slice(0, MAX_ELEMENT_HTML_LENGTH) ?? "",
          sourceValue: sourceAlt,
          targetValue: alt,
          isLocaleSpecific: true,
        });
      }
    }
  });

  if (results.length === 0) {
    results.push({ checkId: "img-alt-translated", passed: true, severity: "important", category: "images" });
  }

  return results;
};
