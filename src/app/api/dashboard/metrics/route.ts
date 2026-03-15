import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const { data: audits } = await supabase
      .from("audits")
      .select("id")
      .eq("user_id", user.id);

    const auditIds = (audits ?? []).map((a) => a.id);
    const totalAudits = auditIds.length;

    if (totalAudits === 0) {
      return NextResponse.json({
        totalAudits: 0,
        avgScore: 0,
        totalLocaleSpecificIssues: 0,
      });
    }

    const { data: localeResults } = await supabase
      .from("audit_locale_results")
      .select("score, locale_specific_issues")
      .in("audit_id", auditIds);

    const scores = (localeResults ?? []).map((r) => r.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const totalLocaleSpecificIssues = (localeResults ?? []).reduce((sum, r) => sum + r.locale_specific_issues, 0);

    return NextResponse.json({
      totalAudits,
      avgScore,
      totalLocaleSpecificIssues,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
