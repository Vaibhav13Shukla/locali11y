import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";
import { detectLocalesSchema } from "@/lib/validations/audit";
import { fetchHtml } from "@/engine/fetcher";
import { detectLocales } from "@/engine/locale-detector";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = detectLocalesSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues[0]?.message ?? parsed.error.message ?? "Invalid input";
      return NextResponse.json(
        { error: errorMessage, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const html = await fetchHtml(parsed.data.url);
    const detected = detectLocales(html, parsed.data.url);

    const suggestedSource = detected.find((d) => d.locale === "en")?.locale ?? detected[0]?.locale ?? "en";

    return NextResponse.json({
      detectedLocales: detected,
      suggestedSource,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to detect locales";
    return NextResponse.json({ error: message, code: "DETECT_FAILED" }, { status: 500 });
  }
}
