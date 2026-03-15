import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locali11y — Find the accessibility your translations broke",
  description:
    "Audit accessibility across every language version of your site. Find untranslated ARIA labels, missing alt text, and broken locale attributes.",
  openGraph: {
    title: "Locali11y",
    description: "Find the accessibility your translations broke.",
    type: "website",
    url: "https://locali11y.io",
    images: [
      {
        url: "https://locali11y.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "Locali11y - Multilingual Accessibility Auditing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Locali11y",
    description: "Find the accessibility your translations broke.",
    images: ["https://locali11y.io/og-image.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
