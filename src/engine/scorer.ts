import type { CheckResult } from "@/types/audit";
import { SEVERITY_WEIGHTS } from "@/lib/constants";

export function computeScore(results: CheckResult[]): number {
  const failures = results.filter((r) => !r.passed);

  const checkGroups = new Map<string, { severity: "critical" | "important" | "info"; count: number }>();

  for (const f of failures) {
    const existing = checkGroups.get(f.checkId);
    if (existing) {
      existing.count++;
    } else {
      checkGroups.set(f.checkId, { severity: f.severity, count: 1 });
    }
  }

  let penalty = 0;
  for (const [, group] of checkGroups) {
    const weight = SEVERITY_WEIGHTS[group.severity] ?? 1;
    penalty += weight + Math.min(group.count - 1, 10) * (weight * 0.1);
  }

  return Math.max(0, Math.round(100 - penalty));
}

export function countBySeverity(results: CheckResult[]): {
  critical: number;
  important: number;
  info: number;
} {
  const failures = results.filter((r) => !r.passed);
  return {
    critical: failures.filter((r) => r.severity === "critical").length,
    important: failures.filter((r) => r.severity === "important").length,
    info: failures.filter((r) => r.severity === "info").length,
  };
}
