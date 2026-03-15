export const AUDIT_STATUSES = [
  "pending",
  "running",
  "completed",
  "failed",
] as const;

export type AuditStatus = (typeof AUDIT_STATUSES)[number];

export const SEVERITY_WEIGHTS = {
  critical: 5,
  important: 2,
  info: 1,
} as const;

export const CHECK_CATEGORIES = [
  "lang",
  "images",
  "aria",
  "forms",
  "meta",
  "navigation",
  "headings",
  "seo",
] as const;

export const MAX_LOCALES_PER_AUDIT = 5;
export const FETCH_TIMEOUT_MS = 8000;
export const MAX_ELEMENT_HTML_LENGTH = 200;
