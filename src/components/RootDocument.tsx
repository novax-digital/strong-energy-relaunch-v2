import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { languages, type Language } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const rootMetadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  applicationName: site.name,
  authors: [{ name: site.name }],
  icons: {
    icon: "/favicon.png"
  }
};

export function RootDocument({ children, lang }: { children: ReactNode; lang: Language }) {
  return (
    <html lang={languages[lang].htmlLang} className={inter.className} data-scroll-behavior="smooth">
      <body>
        {children}
      </body>
    </html>
  );
}
