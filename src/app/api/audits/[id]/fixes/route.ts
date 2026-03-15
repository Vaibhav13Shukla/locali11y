import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";
import { generateFixesSchema } from "@/lib/validations/audit";
import { Groq } from "groq-sdk";
import { env } from "@/lib/utils/env";

const groqClient = new Groq({ apiKey: env.GROQ_API_KEY });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = generateFixesSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues[0]?.message ?? parsed.error.message ?? "Invalid input";
      return NextResponse.json(
        { error: errorMessage, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
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

    const { data: issues } = await supabase
      .from("audit_issues")
      .select("*")
      .in("id", parsed.data.issueIds)
      .eq("audit_id", id);

    if (!issues || issues.length === 0) {
      return NextResponse.json({ error: "No issues found", code: "NO_ISSUES" }, { status: 404 });
    }

    const returnedIssueIds = new Set(issues.map((i) => i.id));
    const unauthorizedIds = parsed.data.issueIds.filter((id) => !returnedIssueIds.has(id));
    if (unauthorizedIds.length > 0) {
      return NextResponse.json({ error: "Invalid issue IDs for this audit", code: "UNAUTHORIZED" }, { status: 403 });
    }

    if (issues.length !== parsed.data.issueIds.length) {
      return NextResponse.json({ error: "Some issue IDs not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const issueDescriptions = issues.map((issue) => ({
      id: issue.id,
      checkId: issue.check_id,
      sourceValue: issue.source_value ?? "",
      targetValue: issue.target_value ?? "",
      elementSelector: issue.element_selector ?? "",
      severity: issue.severity,
      category: issue.category,
      locale: parsed.data.locale,
    }));

    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an accessibility and i18n expert. Generate translated fix suggestions for web accessibility issues. 
          For each issue, provide the corrected value in the target locale (${parsed.data.locale}).
          Respond with a JSON array of objects with fields: id, suggestedFix.
          Be concise and accurate. Translate content naturally, not literally.`,
        },
        {
          role: "user",
          content: `Fix these accessibility issues for locale "${parsed.data.locale}":\n${JSON.stringify(issueDescriptions, null, 2)}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    let fixes: Array<{ id: string; suggestedFix: string }> = [];
    try {
      const content = chatCompletion.choices[0]?.message?.content ?? "{}";
      const parsed2 = JSON.parse(content);
      fixes = parsed2.fixes ?? parsed2.results ?? [];
    } catch {
      fixes = [];
    }

    const exportableJson: Record<string, string> = {};
    for (const fix of fixes) {
      const issue = issues.find((i) => i.id === fix.id);
      if (issue) {
        const key = issue.element_selector ?? issue.check_id;
        exportableJson[key] = fix.suggestedFix;
      }
    }

    for (const fix of fixes) {
      await supabase
        .from("audit_issues")
        .update({ fix_suggestion: fix.suggestedFix })
        .eq("id", fix.id);
    }

    return NextResponse.json({
      fixes: fixes.map((f) => {
        const issue = issues.find((i) => i.id === f.id);
        return {
          issueId: f.id,
          checkId: issue?.check_id ?? "",
          sourceValue: issue?.source_value ?? "",
          suggestedFix: f.suggestedFix,
          locale: parsed.data.locale,
        };
      }),
      exportableJson,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate fixes";
    return NextResponse.json({ error: message, code: "FIX_GENERATION_FAILED" }, { status: 500 });
  }
}
