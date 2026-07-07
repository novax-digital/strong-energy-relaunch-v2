import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { PagePreloader } from "@/components/PagePreloader";
import { SitePasswordGate } from "@/components/SitePasswordGate";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  applicationName: site.name,
  authors: [{ name: site.name }],
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de" className={inter.className} data-scroll-behavior="smooth">
      <body>
        <PagePreloader />
        <SitePasswordGate>{children}</SitePasswordGate>
      </body>
    </html>
  );
}
