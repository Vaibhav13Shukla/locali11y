import type { SupportedLocale } from "@/types/i18n";

const dictionaries: Record<SupportedLocale, () => Promise<Record<string, unknown>>> = {
  en: () => import("../../../messages/en.json").then((m) => m.default),
  es: () => import("../../../messages/es.json").then((m) => m.default),
  ja: () => import("../../../messages/ja.json").then((m) => m.default),
  zh: () => import("../../../messages/zh.json").then((m) => m.default),
};

export async function getDictionary(locale: SupportedLocale): Promise<Record<string, unknown>> {
  const loader = dictionaries[locale];
  if (!loader) {
    return dictionaries.en();
  }
  return loader();
}

export function t(dict: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = dict;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return path;
    }
    current = (current as Record<string, unknown>)[key];
  }

  if (typeof current === "string") return current;
  return path;
}
