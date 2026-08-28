import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { GoogleReviewsWidget } from "@/components/GoogleReviewsWidget";
import { HomeHeroVideo } from "@/components/HomeHeroVideo";
import { localizedPath, translations, type Language } from "@/lib/i18n";

export function HomeHero({ lang = "de" }: { lang?: Language }) {
  const t = translations[lang].hero;
  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-white md:min-h-[82vh]">
      <HomeHeroVideo />

      <div className="container-wide relative z-10 w-full pb-8 pt-24 text-center md:pb-4 md:pt-28">
        <div className="mx-auto max-w-6xl space-y-4 md:space-y-6">
          <h1 className="animate-fade-in text-[clamp(1.875rem,3.88vw,3.5rem)] font-bold uppercase leading-[1.05] tracking-wide md:whitespace-nowrap">
            <span className="text-white">WE MAKE GREEN ENERGY </span>
            <span className="text-gradient">STRONG</span>
          </h1>

          <p className="animate-fade-in mx-auto max-w-3xl text-base text-white/80 md:text-lg" style={{ animationDelay: "0.15s" }}>
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2 md:pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link className="btn-gradient px-7 py-3 md:px-7 md:py-3.5 rounded-full text-base font-semibold group flex items-center shadow-lg" href={localizedPath("/produkte", lang)}>
              {t.products}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link className="bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white px-7 py-3 md:px-7 md:py-3.5 rounded-full text-base font-medium transition-all shadow-sm" href={localizedPath("/kontakt", lang)}>
              {t.consultation}
            </Link>
          </div>
        </div>

        <GoogleReviewsWidget loadingLabel={lang === "en" ? "Loading Google reviews…" : "Google-Bewertungen werden geladen…"} />
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative pt-32 pb-12 overflow-hidden">
      <div className="absolute top-24 -left-20 right-0 pointer-events-none opacity-[0.18] blur-[3px]">
        <svg viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M-50 120 C150 40, 350 180, 550 100 S850 20, 1050 100 S1250 160, 1300 80" stroke="url(#page-wave-1)" strokeWidth="6" strokeLinecap="round" />
          <path d="M-50 130 C200 50, 400 190, 600 110 S900 30, 1100 110 S1250 170, 1300 90" stroke="url(#page-wave-2)" strokeWidth="4" strokeLinecap="round" />
          <path d="M-50 140 C100 60, 300 170, 500 90 S750 40, 950 120 S1200 150, 1300 70" stroke="url(#page-wave-3)" strokeWidth="5" strokeLinecap="round" />
          <defs>
            <linearGradient id="page-wave-1" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#28a795" stopOpacity="0" /><stop offset="30%" stopColor="#28a795" /><stop offset="70%" stopColor="#d7d42f" /><stop offset="100%" stopColor="#d7d42f" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="page-wave-2" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5fb88a" stopOpacity="0" /><stop offset="40%" stopColor="#5fb88a" /><stop offset="60%" stopColor="#28a795" /><stop offset="100%" stopColor="#28a795" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="page-wave-3" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d7d42f" stopOpacity="0" /><stop offset="25%" stopColor="#d7d42f" /><stop offset="75%" stopColor="#28a795" /><stop offset="100%" stopColor="#28a795" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="container-wide text-center relative z-10">
        {eyebrow ? <p className="text-sm font-semibold uppercase text-primary mb-3">{eyebrow}</p> : null}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-normal [&_span]:text-gradient">{title}</h1>
        {children ? <div className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg">{children}</div> : null}
      </div>
    </section>
  );
}
