import { createServerSupabaseClient } from "@/lib/db/server";
import { redirect } from "next/navigation";

export async function getSession() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth(locale: string = "en") {
  const user = await getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }
  return user;
}

export async function getProfile() {
  const supabase = await createServerSupabaseClient();
  const user = await getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}
