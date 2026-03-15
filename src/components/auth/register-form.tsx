"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { GradientBlobs } from "@/components/ui/motion";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useT } from "@/lib/i18n/dict-context";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";

export function RegisterForm({ locale }: { locale: string }) {
  const t = useT();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: SignUpFormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || t("auth.errors.generic"));
        return;
      }
      toast.success("Account created! Please sign in.");
      router.push(`/${locale}/login`);
    } catch {
      toast.error(t("auth.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-gray-900 dark:to-purple-950/30 px-4 relative overflow-hidden">
      <GradientBlobs />
      {/* Top right controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <LocaleSwitcher currentLocale={locale} />
        <ThemeToggle />
      </div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card padding="lg" className="shadow-xl shadow-indigo-100/50 dark:shadow-indigo-900/20 border-gray-100 dark:border-gray-700">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <Logo size={44} />
          </motion.div>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{t("auth.register.title")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1 mb-6">{t("auth.register.subtitle")}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <Label htmlFor="fullName">{t("auth.register.fullNameLabel")}</Label>
              <Input id="fullName" placeholder={t("auth.register.fullNamePlaceholder")} error={errors.fullName?.message} {...register("fullName")} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <Label htmlFor="email">{t("auth.register.emailLabel")}</Label>
              <Input id="email" type="email" placeholder={t("auth.register.emailPlaceholder")} error={errors.email?.message} {...register("email")} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <Label htmlFor="password">{t("auth.register.passwordLabel")}</Label>
              <Input id="password" type="password" placeholder={t("auth.register.passwordPlaceholder")} error={errors.password?.message} {...register("password")} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Button type="submit" variant="gradient" className="w-full" size="lg" loading={loading}>
                {t("auth.register.submit")}
              </Button>
            </motion.div>
          </form>
          <p className="mt-6 text-sm text-center text-gray-500">
            {t("auth.register.hasAccount")}{" "}
            <Link href={`/${locale}/login`} className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
              {t("auth.register.signInLink")}
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
