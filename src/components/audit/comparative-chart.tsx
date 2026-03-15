"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { AuditLocaleResultRow } from "@/types/database";

interface ComparativeChartProps {
  localeResults: AuditLocaleResultRow[];
}

function getBarColor(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#d97706";
  return "#dc2626";
}

export function ComparativeChart({ localeResults }: ComparativeChartProps) {
  const data = localeResults.map((r) => ({
    locale: r.locale.toUpperCase(),
    score: r.score,
    issues: r.failed_checks,
    localeIssues: r.locale_specific_issues,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="locale" tick={{ fontSize: 12, fontWeight: 600 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number, name: string) => [value, name === "score" ? "Score" : name]}
          contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
        />
        <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={60}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
