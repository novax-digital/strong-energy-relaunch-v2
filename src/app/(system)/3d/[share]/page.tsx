import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnovoModelViewer } from "@/components/OnovoModelViewer";
import { isValidModelShare } from "@/lib/privateModelShare";
import type { Language } from "@/lib/i18n";

export const dynamic = "force-dynamic";
type SearchParams = Promise<{ lang?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const lang = (await searchParams).lang === "en" ? "en" : "de";
  return {
    title: lang === "en" ? "3D model | Strong Energy" : "3D-Modell | Strong Energy",
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
    referrer: "no-referrer"
  };
}

export default async function ModelSharePage({ params, searchParams }: { params: Promise<{ share: string }>; searchParams: SearchParams }) {
  const [{ share }, query] = await Promise.all([params, searchParams]);
  const lang: Language = query.lang === "en" ? "en" : "de";
  if (!isValidModelShare(share)) notFound();

  return (
    <main lang={lang} className="flex min-h-dvh flex-col justify-center bg-secondary/30 py-4 sm:py-6">
      <div className="container-wide mb-3 flex w-full justify-end gap-2 text-sm font-semibold" aria-label={lang === "en" ? "Language" : "Sprache"}>
        {(["de", "en"] as const).map((option) => (
          <a href={`?lang=${option}`} hrefLang={option} lang={option} aria-current={lang === option ? "true" : undefined} key={option} className={`rounded-lg px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${lang === option ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5"}`}>
            {option === "de" ? "Deutsch" : "English"}
          </a>
        ))}
      </div>
      <OnovoModelViewer lang={lang} src={`/api/model-share/${share}`} standalone />
    </main>
  );
}
