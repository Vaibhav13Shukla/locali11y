import type { AuditIssueRow, AuditLocaleResultRow, AuditRow } from "./database";

export interface ErrorResponse {
  error: string;
  code: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface SignUpResponse {
  userId: string;
  redirectTo: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  redirectTo: string;
}

export interface DetectLocalesRequest {
  url: string;
}

export interface DetectLocalesResponse {
  detectedLocales: Array<{
    locale: string;
    url: string;
    source: string;
  }>;
  suggestedSource: string;
}

export interface CreateAuditRequest {
  targetUrl: string;
  sourceLocale: string;
  targetLocales: string[];
}

export interface CreateAuditResponse {
  auditId: string;
  status: "completed" | "failed";
  errorMessage?: string;
  results?: {
    sourceLocale: {
      locale: string;
      score: number;
      issues: number;
    };
    targetLocales: Array<{
      locale: string;
      score: number;
      issues: number;
      localeSpecificIssues: number;
    }>;
  };
}

export interface AuditSummary {
  id: string;
  targetUrl: string;
  sourceLocale: string;
  targetLocales: string[];
  status: string;
  createdAt: string;
  bestScore: number;
  worstScore: number;
  worstLocale: string;
  totalLocaleSpecificIssues: number;
}

export interface ListAuditsResponse {
  audits: AuditSummary[];
}

export interface GetAuditResponse {
  audit: AuditRow;
  localeResults: AuditLocaleResultRow[];
  issues: AuditIssueRow[];
}

export interface GenerateFixesRequest {
  locale: string;
  issueIds: string[];
}

export interface GenerateFixesResponse {
  fixes: Array<{
    issueId: string;
    checkId: string;
    sourceValue: string;
    suggestedFix: string;
    locale: string;
  }>;
  exportableJson: Record<string, string>;
}
