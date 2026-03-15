import type { LocaleConfig, SupportedLocale } from "@/types/i18n";

export const LOCALES: Record<SupportedLocale, LocaleConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
  },
  ja: {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    direction: "ltr",
  },
  zh: {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    direction: "ltr",
  },
};

export const DEFAULT_LOCALE: SupportedLocale = "en";
export const SUPPORTED_LOCALE_CODES = Object.keys(LOCALES) as SupportedLocale[];

export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALE_CODES.includes(locale as SupportedLocale);
}
