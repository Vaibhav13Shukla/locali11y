import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/db/admin";
import { signUpSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues[0]?.message ?? parsed.error.message ?? "Invalid input";
      return NextResponse.json(
        { error: errorMessage, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { email, password, fullName } = parsed.data;
    const supabase = createAdminSupabaseClient();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError) {
      if (authError.message.includes("already")) {
        return NextResponse.json({ error: "This email is already registered", code: "EMAIL_TAKEN" }, { status: 409 });
      }
      return NextResponse.json({ error: authError.message, code: "AUTH_ERROR" }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user", code: "CREATE_FAILED" }, { status: 500 });
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      full_name: fullName,
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: "Failed to create profile", code: "PROFILE_ERROR" }, { status: 500 });
    }

    return NextResponse.json({
      userId: authData.user.id,
      redirectTo: "/en/login",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
