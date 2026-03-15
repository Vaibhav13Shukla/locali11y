function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  get NEXT_PUBLIC_APP_URL(): string {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },
  get NEXT_PUBLIC_SUPABASE_URL(): string {
    return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  },
  get NEXT_PUBLIC_SUPABASE_ANON_KEY(): string {
    return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get SUPABASE_SERVICE_ROLE_KEY(): string {
    return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
  get GROQ_API_KEY(): string {
    return requireEnv("GROQ_API_KEY");
  },
  get DEFAULT_LOCALE(): string {
    return process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en";
  },
};
