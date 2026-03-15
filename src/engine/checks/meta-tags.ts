import type { CheckContext, CheckFunction } from "../types";
import type { CheckResult } from "@/types/audit";

export const checkPageTitleTranslated: CheckFunction = ({ $, source$ }: CheckContext): CheckResult[] => {
  const title = $("title").text().trim();
  const sourceTitle = source$ ? source$("title").text().trim() : "";

  if (!source$ || !sourceTitle) {
    return [{ checkId: "page-title-translated", passed: title.length > 0, severity: "important", category: "meta", targetValue: title || "(empty)" }];
  }

  const passed = title !== sourceTitle || title.length === 0;
  return [
    {
      checkId: "page-title-translated",
      passed,
      severity: "important",
      category: "meta",
      elementSelector: "title",
      sourceValue: sourceTitle,
      targetValue: title || "(empty)",
      isLocaleSpecific: !passed,
    },
  ];
};

export const checkMetaDescTranslated: CheckFunction = ({ $, source$ }: CheckContext): CheckResult[] => {
  const desc = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const sourceDesc = source$ ? source$('meta[name="description"]').attr("content")?.trim() ?? "" : "";

  if (!source$ || !sourceDesc) {
    return [{ checkId: "meta-description-translated", passed: true, severity: "important", category: "meta" }];
  }

  const passed = desc !== sourceDesc || desc.length === 0;
  return [
    {
      checkId: "meta-description-translated",
      passed,
      severity: "important",
      category: "meta",
      elementSelector: 'meta[name="description"]',
      sourceValue: sourceDesc,
      targetValue: desc || "(empty)",
      isLocaleSpecific: !passed,
    },
  ];
};

export const checkOgTagsTranslated: CheckFunction = ({ $, source$ }: CheckContext): CheckResult[] => {
  if (!source$) return [{ checkId: "og-tags-translated", passed: true, severity: "info", category: "meta" }];

  const results: CheckResult[] = [];
  const tags = ["og:title", "og:description"];

  for (const tag of tags) {
    const val = $(`meta[property="${tag}"]`).attr("content")?.trim() ?? "";
    const sourceVal = source$(`meta[property="${tag}"]`).attr("content")?.trim() ?? "";

    if (sourceVal && val && val === sourceVal && val.length > 3) {
      results.push({
        checkId: "og-tags-translated",
        passed: false,
        severity: "info",
        category: "meta",
        elementSelector: `meta[property="${tag}"]`,
        sourceValue: sourceVal,
        targetValue: val,
        isLocaleSpecific: true,
      });
    }
  }

  if (results.length === 0) {
    results.push({ checkId: "og-tags-translated", passed: true, severity: "info", category: "meta" });
  }
  return results;
};
