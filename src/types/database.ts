export interface ProfileRow {
  id: string;
  full_name: string;
  created_at: string;
}

export interface AuditRow {
  id: string;
  user_id: string;
  target_url: string;
  source_locale: string;
  target_locales: string[];
  status: "pending" | "running" | "completed" | "failed";
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLocaleResultRow {
  id: string;
  audit_id: string;
  locale: string;
  locale_url: string;
  score: number;
  total_checks: number;
  passed_checks: number;
  failed_checks: number;
  critical_issues: number;
  important_issues: number;
  info_issues: number;
  locale_specific_issues: number;
  fetched_at: string;
}

export interface AuditIssueRow {
  id: string;
  audit_id: string;
  locale_result_id: string;
  locale: string;
  check_id: string;
  severity: "critical" | "important" | "info";
  category: string;
  element_selector: string | null;
  element_html: string | null;
  source_value: string | null;
  target_value: string | null;
  is_locale_specific: boolean;
  fix_suggestion: string | null;
  created_at: string;
}
