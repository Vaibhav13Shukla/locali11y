import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocaleDirection } from "@/lib/i18n/get-locale-direction";
import { DictProvider } from "@/lib/i18n/dict-context";
import { ToastProvider } from "@/components/ui/toast-provider";
import type { SupportedLocale } from "@/types/i18n";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Locali11y - Find the Accessibility Your Translations Broke",
    es: "Locali11y - Encuentra la Accesibilidad que Rompieron tus Traducciones",
    ja: "Locali11y - 翻訳が壊したアクセシビリティを見つける",
    zh: "Locali11y - 找出翻译破坏的无障碍功能",
  };
  const descriptions: Record<string, string> = {
    en: "Audit website accessibility across every language version. Discover untranslated ARIA labels, missing alt text, and broken locale attributes.",
    es: "Audita la accesibilidad del sitio web en cada versión de idioma. Descubre etiquetas ARIA sin traducir y atributos locale rotos.",
    ja: "すべての言語バージョンでウェブサイトのアクセシビリティを監査します。翻訳されていないARIAラベルを見つけます。",
    zh: "审计每个语言版本的网站无障碍情况。发现未翻译的ARIA标签和损坏的locale属性。",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }, { locale: "ja" }, { locale: "zh" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as SupportedLocale);
  const direction = getLocaleDirection(locale as SupportedLocale);

  return (
    <DictProvider dict={dict}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${direction}";`,
        }}
      />
      <ToastProvider />
      {children}
    </DictProvider>
  );
}
