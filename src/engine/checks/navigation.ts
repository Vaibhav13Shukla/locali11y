import type { CheckContext, CheckFunction } from "../types";
import type { CheckResult } from "@/types/audit";

export const checkSkipNavigation: CheckFunction = ({ $ }: CheckContext): CheckResult[] => {
  const firstLinks = $("a").slice(0, 5);
  let hasSkipLink = false;

  firstLinks.each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const text = $(el).text().toLowerCase();
    if (
      href.startsWith("#") &&
      (text.includes("skip") || text.includes("content") || text.includes("main") || text.includes("navigation"))
    ) {
      hasSkipLink = true;
    }
  });

  $("a[href^='#']").each((_, el) => {
    const text = $(el).text().toLowerCase();
    const className = $(el).attr("class") ?? "";
    if (
      (text.includes("skip") || text.includes("main")) &&
      (className.includes("sr-only") || className.includes("visually-hidden") || className.includes("skip"))
    ) {
      hasSkipLink = true;
    }
  });

  return [
    {
      checkId: "skip-navigation",
      passed: hasSkipLink,
      severity: "important",
      category: "navigation",
      targetValue: hasSkipLink ? "found" : "(no skip link)",
    },
  ];
};
