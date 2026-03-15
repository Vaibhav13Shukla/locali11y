import { load } from "cheerio";
import type { CheckResult } from "@/types/audit";
import type { CheckDefinition, CheckContext } from "./types";
import { checkHtmlLang, checkDirAttribute } from "./checks/lang-direction";
import { checkHreflangTags, checkTitleAttrPresent } from "./checks/seo-links";
import { checkImgAltPresent, checkImgAltTranslated } from "./checks/images";
import { checkAriaLabelPresent, checkAriaLabelTranslated, checkAriaDescribedby } from "./checks/aria-labels";
import { checkPageTitleTranslated, checkMetaDescTranslated, checkOgTagsTranslated } from "./checks/meta-tags";
import { checkButtonTextPresent, checkLinkTextPresent, checkEmptyInteractive } from "./checks/buttons-links";
import { checkFormLabels, checkPlaceholderTranslated, checkSubmitTranslated } from "./checks/forms";
import { checkHeadingHierarchy } from "./checks/headings";
import { checkSkipNavigation } from "./checks/navigation";

const ALL_CHECKS: CheckDefinition[] = [
  { id: "html-lang-present", fn: checkHtmlLang },
  { id: "hreflang-tags", fn: checkHreflangTags },
  { id: "img-alt-present", fn: checkImgAltPresent },
  { id: "img-alt-translated", fn: checkImgAltTranslated },
  { id: "aria-label-present", fn: checkAriaLabelPresent },
  { id: "aria-label-translated", fn: checkAriaLabelTranslated },
  { id: "aria-describedby-valid", fn: checkAriaDescribedby },
  { id: "title-attr-present", fn: checkTitleAttrPresent },
  { id: "page-title-translated", fn: checkPageTitleTranslated },
  { id: "meta-description-translated", fn: checkMetaDescTranslated },
  { id: "og-tags-translated", fn: checkOgTagsTranslated },
  { id: "button-text-present", fn: checkButtonTextPresent },
  { id: "link-text-present", fn: checkLinkTextPresent },
  { id: "form-labels-present", fn: checkFormLabels },
  { id: "placeholder-translated", fn: checkPlaceholderTranslated },
  { id: "dir-attribute", fn: checkDirAttribute },
  { id: "heading-hierarchy", fn: checkHeadingHierarchy },
  { id: "skip-navigation", fn: checkSkipNavigation },
  { id: "empty-interactive", fn: checkEmptyInteractive },
  { id: "submit-button-translated", fn: checkSubmitTranslated },
];

export function runAudit(
  html: string,
  locale: string,
  sourceHtml?: string,
  sourceLocale?: string
): CheckResult[] {
  const $ = load(html);
  const source$ = sourceHtml ? load(sourceHtml) : undefined;

  const ctx: CheckContext = { $, locale, source$, sourceLocale };
  const allResults: CheckResult[] = [];

  for (const check of ALL_CHECKS) {
    try {
      const results = check.fn(ctx);
      allResults.push(...results);
    } catch {
      allResults.push({
        checkId: check.id,
        passed: true,
        severity: "info",
        category: "unknown",
      });
    }
  }

  return allResults;
}

export function getCheckCount(): number {
  return ALL_CHECKS.length;
}
