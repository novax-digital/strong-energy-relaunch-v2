import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { localizedPath, translations, type Language } from "@/lib/i18n";

export function HomeHero({ lang = "de" }: { lang?: Language }) {
  const t = translations[lang].hero;
  return (
    <section className="relative min-h-[78vh] md:min-h-[82vh] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black">
        <video className="w-full h-full object-cover" autoPlay loop muted playsInline preload="metadata" poster="/assets/solaranlagen-2BF5y_wA.webp">
          <source src="/videos/strong-energy-loop-homepage.webm" type="video/webm" />
          <source src="/videos/strong-energy-loop-homepage.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 container-wide text-center pt-16 md:pt-20 pb-10 md:pb-12">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in uppercase tracking-wide">
            <span className="text-white">WE MAKE GREEN</span><br />
            <span className="text-white">ENERGY </span>
            <span className="text-gradient">STRONG</span>
          </h1>

          <p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.15s" }}>
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2 md:pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link className="btn-gradient px-8 py-3.5 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold group flex items-center shadow-lg" href={localizedPath("/produkte", lang)}>
              {t.products}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link className="bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white px-8 py-3.5 md:px-8 md:py-4 rounded-full text-base md:text-lg font-medium transition-all shadow-sm" href={localizedPath("/kontakt", lang)}>
              {t.consultation}
            </Link>
          </div>
        </div>
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
