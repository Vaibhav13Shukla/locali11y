import type { CheckContext, CheckFunction } from "../types";
import type { CheckResult } from "@/types/audit";
import { MAX_ELEMENT_HTML_LENGTH } from "@/lib/constants";

const RTL_LOCALES = new Set(["ar", "he", "fa", "ur"]);

export const checkHtmlLang: CheckFunction = ({ $, locale }: CheckContext): CheckResult[] => {
  const htmlLang = $("html").attr("lang")?.toLowerCase().split("-")[0];
  const passed = htmlLang === locale.toLowerCase().split("-")[0];

  return [
    {
      checkId: "html-lang-present",
      passed,
      severity: "critical",
      category: "lang",
      elementSelector: "html",
      elementHtml: `<html lang="${htmlLang ?? ""}">`.slice(0, MAX_ELEMENT_HTML_LENGTH),
      targetValue: htmlLang ?? "(missing)",
      sourceValue: locale,
      isLocaleSpecific: !passed,
    },
  ];
};

export const checkDirAttribute: CheckFunction = ({ $, locale }: CheckContext): CheckResult[] => {
  if (!RTL_LOCALES.has(locale.toLowerCase().split("-")[0]!)) {
    return [{ checkId: "dir-attribute", passed: true, severity: "critical", category: "lang" }];
  }

  const dir = $("html").attr("dir")?.toLowerCase();
  const passed = dir === "rtl";

  return [
    {
      checkId: "dir-attribute",
      passed,
      severity: "critical",
      category: "lang",
      elementSelector: "html",
      targetValue: dir ?? "(missing)",
      isLocaleSpecific: !passed,
    },
  ];
};
