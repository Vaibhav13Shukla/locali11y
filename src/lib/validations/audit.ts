import { z } from "zod";

export const createAuditSchema = z.object({
  targetUrl: z
    .string()
    .url("Please enter a valid URL")
    .refine((url) => url.startsWith("https://") || url.startsWith("http://"), {
      message: "URL must start with http:// or https://",
    }),
  sourceLocale: z.string().min(2, "Source locale is required"),
  targetLocales: z
    .array(z.string().min(2))
    .min(1, "Select at least one target locale")
    .max(5, "Maximum 5 target locales"),
});

export const detectLocalesSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine((url) => url.startsWith("https://") || url.startsWith("http://"), {
      message: "URL must start with http:// or https://",
    }),
});

export const VALID_LOCALES = ["en", "es", "ja", "zh"] as const;

export const generateFixesSchema = z.object({
  locale: z.string().min(2).max(5).refine(
    (val) => VALID_LOCALES.includes(val as typeof VALID_LOCALES[number]),
    { message: "Invalid locale. Supported: en, es, ja, zh" }
  ),
  issueIds: z.array(z.string().uuid()).min(1).max(20),
});

export type CreateAuditFormData = z.infer<typeof createAuditSchema>;
export type DetectLocalesFormData = z.infer<typeof detectLocalesSchema>;
