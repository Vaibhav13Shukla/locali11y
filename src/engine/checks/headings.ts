import type { CheckContext, CheckFunction } from "../types";
import type { CheckResult } from "@/types/audit";

export const checkHeadingHierarchy: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const results: CheckResult[] = [];
  let lastLevel = 0;

  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tag = $(el).prop("tagName")?.toLowerCase() ?? "";
    const level = parseInt(tag.replace("h", ""), 10);

    if (lastLevel > 0 && level > lastLevel + 1) {
      results.push({
        checkId: "heading-hierarchy",
        passed: false,
        severity: "important",
        category: "headings",
        elementSelector: tag,
        targetValue: `${tag} after h${lastLevel} (skipped h${lastLevel + 1})`,
      });
    }
    lastLevel = level;
  });

  if (results.length === 0) {
    results.push({ checkId: "heading-hierarchy", passed: true, severity: "important", category: "headings" });
  }
  return results;
};
