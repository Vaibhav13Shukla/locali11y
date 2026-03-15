export const SUPPORTED_LOCALES = ["en", "es", "ja", "zh"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type Dictionary = Record<string, unknown>;

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
}
