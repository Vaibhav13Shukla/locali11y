import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { t } from "@/lib/i18n/dictionaries";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { FadeIn, FadeInView, GradientText, SlideIn, TiltCard, MagneticWrap, GradientBlobs, SpotlightCard } from "@/components/ui/motion";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LighthouseComparison } from "@/components/audit/lighthouse-comparison";
import { Globe, Shield, Zap, Scale, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import type { SupportedLocale } from "@/types/i18n";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as SupportedLocale);
  const tr = (path: string) => t(dict, path);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
      <header className="border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size={36} />
          <div className="flex items-center gap-3">
            <LocaleSwitcher currentLocale={locale} />
            <ThemeToggle />
            <Link href={`/${locale}/login`}>
              <Button variant="ghost" size="sm">{tr("auth.login.submit")}</Button>
            </Link>
            <Link href={`/${locale}/register`}>
              <Button size="sm">{tr("landing.hero.cta")}</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/30 dark:via-gray-900 dark:to-purple-950/30" />
        <GradientBlobs />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-100/40 to-transparent rounded-full blur-3xl dark:from-indigo-900/20" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-100/40 to-transparent rounded-full blur-3xl dark:from-purple-900/20" />
        
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideIn>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                {tr("landing.hero.title")}{" "}
                <GradientText>{tr("landing.hero.titleHighlight")}</GradientText>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                {tr("landing.hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <MagneticWrap>
                  <Link href={`/${locale}/register`}>
                    <Button size="lg" className="shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow">
                      {tr("landing.hero.cta")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </MagneticWrap>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-900">SC</div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-900">MJ</div>
                    <div className="w-8 h-8 rounded-full bg-fuchsia-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-900">YT</div>
                  </div>
                  <span>{tr("landing.hero.trustedBy")}</span>
                </div>
              </div>
            </SlideIn>
            
            <FadeIn delay={0.15}>
              <TiltCard>
                <div className="relative">
                  <div className="absolute -inset-6 bg-gradient-to-r from-indigo-200 via-purple-200 to-fuchsia-200 rounded-2xl blur-2xl opacity-70 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-fuchsia-900/30" />
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs text-gray-400">locali11y.io</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{tr("landing.demo.title")}</h3>
                      <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">{tr("landing.demo.complete")}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-emerald-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-600">92</p>
                        <p className="text-xs text-emerald-700">{tr("landing.demo.scoreEn")}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-amber-600">78</p>
                        <p className="text-xs text-amber-700">{tr("landing.demo.scoreJa")}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-600">64</p>
                        <p className="text-xs text-red-700">{tr("landing.demo.scoreEs")}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>{tr("landing.demo.issue1")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-amber-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>{tr("landing.demo.issue2")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </TiltCard>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: tr("landing.stats.checks"), desc: tr("landing.stats.checksDesc"), icon: CheckCircle },
            { value: tr("landing.stats.locales"), desc: tr("landing.stats.localesDesc"), icon: Globe },
            { value: tr("landing.stats.time"), desc: tr("landing.stats.timeDesc"), icon: Zap },
          ].map((stat, i) => (
            <FadeInView key={stat.value} delay={i * 0.1}>
              <SpotlightCard className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <stat.icon className="h-8 w-8 text-indigo-600 mx-auto" />
                <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.desc}</p>
              </SpotlightCard>
            </FadeInView>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-gray-900 dark:to-purple-950/20">
        <div className="max-w-4xl mx-auto px-4">
          <FadeInView>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Why existing tools miss these issues
            </h2>
          </FadeInView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeInView delay={0.1}>
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-indigo-600">20</div>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Targeted checks</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Specifically designed for i18n × a11y</p>
              </div>
            </FadeInView>
            <FadeInView delay={0.2}>
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-red-600">60+</div>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Issues found on Google</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lighthouse cannot detect these</p>
              </div>
            </FadeInView>
            <FadeInView delay={0.3}>
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-amber-600">0</div>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Other tools catching this</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unique to Locali11y</p>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-20">
        <FadeInView>
          <LighthouseComparison />
        </FadeInView>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">{tr("landing.features.title")}</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { key: "comparative", icon: Globe },
            { key: "localeSpecific", icon: Shield },
            { key: "fixes", icon: Zap },
            { key: "compliance", icon: Scale },
          ].map((feature, i) => (
            <FadeInView key={feature.key} delay={i * 0.1}>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-8 w-8 text-indigo-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {tr(`landing.features.${feature.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {tr(`landing.features.${feature.key}.description`)}
                </p>
              </div>
            </FadeInView>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">{tr("landing.howItWorks.title")}</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {["step1", "step2", "step3"].map((step, i) => (
              <FadeInView key={step} delay={i * 0.15}>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mx-auto">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{tr(`landing.howItWorks.${step}.title`)}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{tr(`landing.howItWorks.${step}.description`)}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to find the accessibility your translations broke?</h2>
          <p className="mt-4 text-indigo-100 text-lg">Start your first audit in seconds. No credit card required.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href={`/${locale}/register`}>
              <Button size="lg" variant="secondary" className="shadow-xl bg-white text-indigo-600 hover:bg-gray-100">
                {tr("landing.hero.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size={28} />
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="https://github.com/Vaibhav13Shukla/locali11y" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              GitHub
            </a>
            <a href="https://lingo.dev" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              {tr("app.poweredBy")}
            </a>
          </div>
          <p className="text-sm text-gray-400">© 2026 Locali11y. Built for Lingo.dev Multilingual Hackathon #3</p>
        </div>
      </footer>
    </div>
  );
}
