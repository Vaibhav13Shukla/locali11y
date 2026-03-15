import { createBrowserSupabaseClient } from "@/lib/db/browser";

export async function signOut(): Promise<void> {
  const supabase = createBrowserSupabaseClient();
  await supabase.auth.signOut();
  window.location.href = "/en/login";
}
