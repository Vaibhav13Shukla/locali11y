import type { SupportedLocale } from "@/types/i18n";
import { LOCALES } from "./config";

export function getLocaleDirection(locale: SupportedLocale): "ltr" | "rtl" {
  return LOCALES[locale]?.direction ?? "ltr";
}
