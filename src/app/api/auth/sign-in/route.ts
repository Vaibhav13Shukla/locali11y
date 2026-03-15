import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";
import { signInSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues[0]?.message ?? parsed.error.message ?? "Invalid input";
      return NextResponse.json(
        { error: errorMessage, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return NextResponse.json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    return NextResponse.json({ redirectTo: "/en/dashboard" });
  } catch {
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
