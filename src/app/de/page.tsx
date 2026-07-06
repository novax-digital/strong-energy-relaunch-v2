import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Battery, GraduationCap, HandHeart, ShieldCheck } from "lucide-react";
import { HomeHero } from "@/components/Hero";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { pageSeo } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.home);

const productWorlds = [
  { title: "Solaranlagen", href: "/de/produkte/solaranlagen", image: "/assets/solaranlagen-2BF5y_wA.webp" },
  { title: "All-in-One Gewerbespeicher", href: "/de/produkte/gewerbespeicher-aio", image: "/assets/gewerbespeicher-aio-kachel-YpXwZeiG.jpg" },
  { title: "Mobile Charging", href: "/de/produkte/mobile-charging", image: "/assets/powerbank-s19-ZCOk-RgR.webp" }
];

const reasons = [
  {
    icon: ShieldCheck,
    title: "VERTRAUEN",
    text: "Wir haben sehr hohe Qualitätsanforderungen, um unseren Kunden Vertrauen und Sicherheit zu geben. Strong Energy bietet 360° Premium Qualität in Design und Technik. In Deutschland geprüft, getestet und zertifiziert."
  },
  {
    icon: GraduationCap,
    title: "ERFAHRUNG",
    text: "Als Teil der Strong Group sind wir seit 1986 tief im europäischen Markt verwurzelt und betreuen mehr als 20 Millionen europäische Familien. Wir sind ein wachsender Konzern mit mehr als 5 GW Erfahrung der Muttergesellschaft Skyworth im Photovoltaikbau."
  },
  {
    icon: Battery,
    title: "STARKE KAPAZITÄT",
    text: "Die Produktionskapazitäten unserer Muttergesellschaft Skyworth lassen es zu in einem einzigen Monat über 20.000 Photovoltaikanlagen zu fertigen."
  },
  {
    icon: HandHeart,
    title: "AUS EINER HAND",
    text: "Wir bieten unseren Kunden maßgeschneiderte saubere Energielösungen und umfassende Dienstleistungen aus einer Hand."
  }
];

export default function HomePage() {
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: pageSeo.home.title, url: "https://strong-energy.eu/de" }} />
      <HomeHero />
      <section id="produktwelten" className="py-14 md:py-20 bg-secondary/30">
        <div className="container-wide">
          <div className="flex items-center gap-6 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <h2 className="text-2xl md:text-3xl lg:text-[2.1rem] font-bold text-foreground whitespace-nowrap">
              Unsere <span className="text-gradient">Produktwelten</span>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {productWorlds.map((world, index) => (
              <Link
                className="group relative block aspect-video rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500"
                href={world.href}
                key={world.href}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Image src={world.image} alt={world.title} fill sizes="(min-width: 900px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">{world.title}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span>Entdecken</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="relative pt-8 md:pt-12 pb-20 md:pb-28 bg-secondary/30 overflow-hidden">
        <div className="absolute top-0 -left-20 right-0 pointer-events-none opacity-[0.18] blur-[3px]">
          <svg viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M-50 120 C150 40, 350 180, 550 100 S850 20, 1050 100 S1250 160, 1300 80" stroke="url(#ws1)" strokeWidth="6" strokeLinecap="round" />
            <path d="M-50 130 C200 50, 400 190, 600 110 S900 30, 1100 110 S1250 170, 1300 90" stroke="url(#ws2)" strokeWidth="4" strokeLinecap="round" />
            <path d="M-50 140 C100 60, 300 170, 500 90 S750 40, 950 120 S1200 150, 1300 70" stroke="url(#ws3)" strokeWidth="5" strokeLinecap="round" />
            <defs>
              <linearGradient id="ws1" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#28a795" stopOpacity="0" /><stop offset="30%" stopColor="#28a795" /><stop offset="70%" stopColor="#d7d42f" /><stop offset="100%" stopColor="#d7d42f" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ws2" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#5fb88a" stopOpacity="0" /><stop offset="40%" stopColor="#5fb88a" /><stop offset="60%" stopColor="#28a795" /><stop offset="100%" stopColor="#28a795" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ws3" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d7d42f" stopOpacity="0" /><stop offset="25%" stopColor="#d7d42f" /><stop offset="75%" stopColor="#28a795" /><stop offset="100%" stopColor="#28a795" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="container-wide">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-10 uppercase tracking-wide">
            <span className="text-gradient">Warum Strong Energy?</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            {reasons.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-xl p-6 md:p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-3">
                    <Icon size={36} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gradient uppercase tracking-wide mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
