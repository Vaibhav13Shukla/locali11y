import { load } from "cheerio";
import type { DetectedLocale } from "@/types/audit";

export function detectLocales(html: string, baseUrl: string): DetectedLocale[] {
  const $ = load(html);
  const detected: DetectedLocale[] = [];
  const seen = new Set<string>();

  $('link[rel="alternate"][hreflang]').each((_, el) => {
    const hreflang = $(el).attr("hreflang");
    const href = $(el).attr("href");
    if (hreflang && href && hreflang !== "x-default") {
      const locale = hreflang.split("-")[0]!.toLowerCase();
      if (!seen.has(locale)) {
        seen.add(locale);
        const resolvedUrl = href.startsWith("http") ? href : new URL(href, baseUrl).toString();
        detected.push({ locale, url: resolvedUrl, source: "hreflang" });
      }
    }
  });

  $('a[hreflang]').each((_, el) => {
    const hreflang = $(el).attr("hreflang");
    const href = $(el).attr("href");
    if (hreflang && href) {
      const locale = hreflang.split("-")[0]!.toLowerCase();
      if (!seen.has(locale)) {
        seen.add(locale);
        const resolvedUrl = href.startsWith("http") ? href : new URL(href, baseUrl).toString();
        detected.push({ locale, url: resolvedUrl, source: "link_tag" });
      }
    }
  });

  const url = new URL(baseUrl);
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (pathParts.length >= 2 && pathParts[0]?.length === 2 && pathParts[1]?.length === 2) {
    const countryLocalePairs: Array<{ country: string; locale: string }> = [
      { country: "us", locale: "en" },
      { country: "gb", locale: "en" },
      { country: "jp", locale: "ja" },
      { country: "es", locale: "es" },
      { country: "de", locale: "de" },
      { country: "fr", locale: "fr" },
      { country: "it", locale: "it" },
      { country: "nl", locale: "nl" },
      { country: "se", locale: "sv" },
      { country: "cn", locale: "zh" },
      { country: "kr", locale: "ko" },
      { country: "br", locale: "pt" },
      { country: "ru", locale: "ru" },
    ];

    for (const pair of countryLocalePairs) {
      if (!seen.has(pair.locale)) {
        const newParts = [...pathParts];
        newParts[0] = pair.country;
        newParts[1] = pair.locale;
        const candidateUrl = `${url.origin}/${newParts.join("/")}`;
        seen.add(pair.locale);
        detected.push({ locale: pair.locale, url: candidateUrl, source: "url_pattern" });
      }
    }
  } else if (pathParts.length >= 1 && pathParts[0]?.length === 2) {
    const commonLocales = ["en", "es", "fr", "de", "ja", "zh", "ko", "pt", "it", "nl", "ru", "ar", "hi", "vi", "sv"];
    const baseLocale = pathParts[0]!.toLowerCase();

    for (const loc of commonLocales) {
      if (loc !== baseLocale && !seen.has(loc)) {
        const newParts = [...pathParts];
        newParts[0] = loc;
        const candidateUrl = `${url.origin}/${newParts.join("/")}`;
        seen.add(loc);
        detected.push({ locale: loc, url: candidateUrl, source: "url_pattern" });
      }
    }
  }

  const currentLang = $("html").attr("lang")?.split("-")[0]?.toLowerCase();
  if (currentLang && !seen.has(currentLang)) {
    seen.add(currentLang);
    detected.push({ locale: currentLang, url: baseUrl, source: "meta_tag" });
  }

  return detected;
}
