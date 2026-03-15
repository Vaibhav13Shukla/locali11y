import type { CheerioAPI } from "cheerio";
import type { CheckResult } from "@/types/audit";

export interface CheckContext {
  $: CheerioAPI;
  locale: string;
  source$?: CheerioAPI;
  sourceLocale?: string;
}

export type CheckFunction = (ctx: CheckContext) => CheckResult[];

export interface CheckDefinition {
  id: string;
  fn: CheckFunction;
}
