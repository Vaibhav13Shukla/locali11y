import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const { data: audit } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!audit) {
      return NextResponse.json({ error: "Audit not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const { data: localeResults } = await supabase
      .from("audit_locale_results")
      .select("*")
      .eq("audit_id", audit.id)
      .order("score", { ascending: true });

    const { data: issues } = await supabase
      .from("audit_issues")
      .select("*")
      .eq("audit_id", audit.id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      audit,
      localeResults: localeResults ?? [],
      issues: issues ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
