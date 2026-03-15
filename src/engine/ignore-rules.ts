const BRAND_NAMES = new Set([
  "google",
  "apple",
  "apple pay",
  "youtube",
  "gmail",
  "chrome",
  "gemini",
  "maps",
  "drive",
  "photos",
  "play",
  "youtube music",
  "google play",
  "google maps",
  "google drive",
  "google photos",
  "google chrome",
  "microsoft",
  "amazon",
  "facebook",
  "meta",
  "instagram",
  "twitter",
  "x",
  "linkedin",
  "netflix",
  "spotify",
  "zoom",
  "slack",
  "dropbox",
  "adobe",
  "github",
  "paypal",
  "visa",
  "mastercard",
  "amex",
]);

const LOCALE_NAMES = new Set([
  "english",
  "español",
  "français",
  "deutsch",
  "italiano",
  "português",
  "中文",
  "中文（简体）",
  "中文（繁體）",
  "日本語",
  "한국어",
  "العربية",
  "हिन्दी",
  "বাংলা",
  "русский",
  "polski",
  "türkçe",
  "nederlands",
  "suomi",
  "ελληνικά",
  "čeština",
  "magyar",
  "română",
  "svenska",
  "dansk",
  "norwegian",
  "norsk",
  "íslenska",
  "lietuvių",
  "latviešu",
  "eesti",
  "slovenščina",
  "slovenčina",
  "hrvatski",
  "српски",
  "български",
  "українська",
  "עברית",
  "فارسی",
  "اردو",
  "ไทย",
  "bahasa indonesia",
  "tagalog",
  "tiếng việt",
  "català",
  "galego",
  "euskara",
  " Cymraeg",
  "afrikaans",
  "shqip",
  "amharic",
  "azərbaycan",
  "bosanski",
  " Беларуская",
  "kiswahili",
  "somali",
  "o'zbek",
  "kurdî",
  "maltese",
  "montenegrin",
]);

const STRUCTURAL_TOKENS = new Set([
  "shopping-links",
  "shopping cart",
  "nav",
  "navigation",
  "menu",
  "header",
  "footer",
  "sidebar",
  "main",
  "content",
  "wrapper",
  "container",
  "logo",
  "search",
  "close",
  "open",
  "back",
  "next",
  "previous",
  "submit",
  "cancel",
  "save",
  "delete",
  "edit",
  "add",
  "remove",
  "loading",
  "spinner",
  "cookie",
  "popup",
  "modal",
  "dialog",
  "tooltip",
  "badge",
  "avatar",
  "profile",
  "user",
  "login",
  "logout",
  "signin",
  "signout",
  "register",
  "signup",
  "password",
  "username",
  "email",
  "phone",
  "address",
  "card",
  "button",
  "link",
  "icon",
  "image",
  "picture",
  "video",
  "audio",
  "play",
  "pause",
  "stop",
  "volume",
  "mute",
  "fullscreen",
  "exit",
  "minimize",
  "maximize",
  "restore",
  "settings",
  "preferences",
  "options",
  "help",
  "faq",
  "support",
  "contact",
  "about",
  "terms",
  "privacy",
  "policy",
  "copyright",
  "home",
  "products",
  "services",
  "pricing",
  "plans",
  "features",
  "blog",
  "news",
  "press",
  "careers",
  "jobs",
  "team",
  "company",
  "partners",
  "affiliates",
]);

function containsAnyScript(value: string, locale: string): boolean {
  const scripts: Record<string, RegExp> = {
    ja: /[\u3040-\u309f\u30a0-\u30ff]/,
    zh: /[\u4e00-\u9fff]/,
    ko: /[\uac00-\ud7af]/,
    ar: /[\u0600-\u06ff]/,
    he: /[\u0590-\u05ff]/,
    hi: /[\u0900-\u097f]/,
    ru: /[\u0400-\u04ff]/,
    el: /[\u0370-\u03ff]/,
    th: /[\u0e00-\u0e7f]/,
    bn: /[\u0980-\u09ff]/,
  };
  
  const regex = scripts[locale];
  return regex ? regex.test(value) : false;
}

export function isLikelyBrandName(value: string): boolean {
  const lower = value.toLowerCase().trim();
  return BRAND_NAMES.has(lower) || BRAND_NAMES.has(lower.replace(/\s+/g, " "));
}

export function isLikelyLocaleName(value: string): boolean {
  const lower = value.toLowerCase().trim();
  if (LOCALE_NAMES.has(lower)) return true;
  
  for (const locale of LOCALE_NAMES) {
    if (lower.includes(locale)) return true;
  }
  return false;
}

export function isLikelyToken(value: string): boolean {
  const lower = value.toLowerCase().trim();
  if (STRUCTURAL_TOKENS.has(lower)) return true;
  
  if (value.includes("-") && !value.includes(" ") && value.length < 30) {
    return true;
  }
  
  if (/^[a-z]{1,4}$/i.test(value) && value.length < 3) {
    return true;
  }
  
  return false;
}

export function isLikelyProperNoun(value: string): boolean {
  if (value.length < 3) return false;
  
  const firstChar = value.charAt(0);
  if (firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase()) {
    const words = value.split(/\s+/);
    if (words.length > 1 && words.every(w => w.charAt(0) === w.charAt(0).toUpperCase())) {
      return true;
    }
  }
  
  if (/^[A-Z][a-z]+([A-Z][a-z]+)+$/.test(value)) {
    return true;
  }
  
  return false;
}

export function isValueInTargetScript(value: string, locale: string): boolean {
  return containsAnyScript(value, locale);
}

export function shouldIgnoreComparativeValue(value: string, locale: string): boolean {
  if (!value || value.length === 0) return true;
  
  const trimmed = value.trim();
  
  if (trimmed.length < 3) return true;
  
  if (isValueInTargetScript(trimmed, locale)) return false;
  
  if (isLikelyBrandName(trimmed)) return true;
  
  if (isLikelyLocaleName(trimmed)) return true;
  
  if (isLikelyToken(trimmed)) return true;
  
  if (isLikelyProperNoun(trimmed)) return true;
  
  return false;
}

export type ConfidenceLevel = "high" | "medium" | "low";

export function computeConfidence(
  isLocaleSpecific: boolean,
  sourceValue: string | null,
  targetValue: string,
  locale: string
): ConfidenceLevel {
  if (!isLocaleSpecific) return "low";
  
  if (!sourceValue || sourceValue === targetValue) {
    if (shouldIgnoreComparativeValue(targetValue, locale)) {
      return "low";
    }
    return "high";
  }
  
  if (isLikelyBrandName(targetValue) || isLikelyLocaleName(targetValue) || isLikelyProperNoun(targetValue)) {
    return "low";
  }
  
  if (isLikelyToken(targetValue)) {
    return "low";
  }
  
  if (targetValue.length < 5) {
    return "medium";
  }
  
  return "high";
}
