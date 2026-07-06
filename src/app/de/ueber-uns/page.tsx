import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Award, Building2, Factory, Globe, Headphones, Mail, Network, Shield, Users, Zap } from "lucide-react";
import { PageHero } from "@/components/Hero";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { pageSeo } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.about);

const pillars = [
  {
    icon: Globe,
    title: "HISTORIE",
    text: "Als Teil der Strong Group ist Strong Energy seit 1986 tief im europäischen Markt verwurzelt und betreut mehr als 20 Millionen europäische Familien."
  },
  {
    icon: Headphones,
    title: "SUPPORT",
    text: "Wir bieten deutschen Support und eine gratis Hotline mit Test Centern in Köln und nahe Berlin - persönlich, schnell und kompetent."
  },
  {
    icon: Zap,
    title: "ERFAHRUNG",
    text: "Skyworth verfügt über weit mehr als 5 GW Kraftwerksbauerfahrung. Weltweit wurden bereits mehr als 200.000 Solar/PV-Anlagen verbaut und ans Netz angeschlossen."
  },
  {
    icon: Shield,
    title: "SICHERHEIT",
    text: "Strong Energy Produkte werden in Deutschland getestet. Unser Team steht eng in Kontakt mit Partnern und Installateuren und bietet regelmäßige Schulungen an."
  },
  {
    icon: Building2,
    title: "SKYWORTH",
    text: "Unsere Muttergesellschaft Skyworth ist weltweit bekannt als Unterhaltungselektronikunternehmen für Smart-TVs, digitale Set-Top-Boxen und weitere Dienstleistungen."
  },
  {
    icon: Factory,
    title: "STARKE KAPAZITÄT",
    text: "Strong Energy hat uneingeschränkten Zugriff auf die leistungsstarken Fertigungs- und Lieferketten-Management-Fähigkeiten von Skyworth."
  },
  {
    icon: Network,
    title: "NETZWERK",
    text: "Skyworth beschäftigt weltweit mehr als 40.000 Mitarbeiter und hat sich seit der Gründung 1988 ein weltweites Netzwerk aufgebaut."
  },
  {
    icon: Award,
    title: "REFERENZEN",
    text: "Die Strong Group und Skyworth beliefern marktführende Großhändler und Unternehmen wie Deutsche Telekom, Saturn, Euronics und Walmart."
  }
];

const team = [
  ["David Norris", "Deputy GM of Strong Energy D/A/CH", "dnorris@strong-energy.eu", "/assets/david-norris-B7MVbvOm.jpg"],
  ["Nils Beck", "Head of Technical Solutions", "n.beck@strong-energy.eu", "/assets/nils-beck-BQ8OoITI.jpg"],
  ["Niklas Balakowski", "Key Account Manager", "nbalakowski@strong-energy.eu", "/assets/niklas-balakowski-DyTINIJV.jpg"],
  ["Michael Müller", "Head of Marketing", "m.muller@strong-energy.eu", "/assets/michael-mueller-BnLIIN3Z.jpg"],
  ["Jason Gao", "Product Engineer PV & Battery", "jgao@strong-energy.eu", "/assets/jason-gao-DwOvahh8.jpg"],
  ["Farideh M. Nezamabadi", "Order Operation Management", "fnezamabadi@strong-eu.com", "/assets/farideh-nezamabadi-DrisO523.jpg"]
];

export default function AboutPage() {
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: "Über uns", url: "https://strong-energy.eu/de/ueber-uns" }} />
      <PageHero title={<>Über <span>Uns</span></>}>
        <p>Hochqualifizierte Experten, die gemeinsam daran arbeiten, innovative Lösungen für erneuerbare Energien zu entwickeln.</p>
      </PageHero>

      <section className="py-16">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Warum <span className="text-gradient">Strong Energy</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title} className="group flex gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="h-fit shrink-0 rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-base font-bold uppercase tracking-wide text-foreground">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">Unsere Muttergesellschaft</span>
              <h2 className="mb-6 text-3xl md:text-4xl font-bold text-foreground">
                Powered by <span className="text-gradient">Skyworth</span>
              </h2>
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  Strong Energy ist als Teil der{" "}
                  <a href="https://www.strong-eu.com/de" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                    Strong Group
                  </a>{" "}
                  seit 1986 tief im europäischen Markt verwurzelt und betreut mehr als 20 Millionen europäische Familien.
                </p>
                <p>
                  Basierend auf den Vorteilen und Erfahrungen der Muttergesellschaft{" "}
                  <a href="https://www.skyworthes.com/#/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                    Skyworth
                  </a>{" "}
                  im Bereich der neuen Energien startete Strong Energy ab Mitte 2023 mit der Einführung von Wechselrichtern, Energiespeicherbatterien und Systemlösungen in Europa.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Deutsche Telekom", "Saturn", "Mediamarkt", "Walmart", "Expert", "Euronics"].map((brand) => (
                  <span key={brand} className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    {brand}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Referenzkunden der Strong Group und Skyworth.</p>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-border shadow-xl">
                <Image src="/assets/skyworth-D-_I0vKY.jpg" alt="Skyworth" width={720} height={420} className="w-full bg-white object-cover p-8" />
              </div>
              <div className="mt-6 overflow-hidden rounded-3xl border border-border shadow-xl">
                <Image src="/assets/strong-energy-haeuser-DVL7HDbk.jpg" alt="Strong Energy" width={720} height={405} className="aspect-video w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-secondary/30 py-20">
        <div className="container-wide relative z-10">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">Die Menschen dahinter</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Unser <span className="text-gradient">Team</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Hochqualifizierte Experten, die gemeinsam daran arbeiten, innovative Lösungen für erneuerbare Energien zu entwickeln.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {team.map(([name, role, email, image]) => (
              <article key={name} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-secondary/30">
                  <Image src={image} alt={name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold leading-tight text-foreground">{name}</h3>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{role}</p>
                  <a href={`mailto:${email}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80">
                    <Mail className="h-3 w-3" />
                    Kontakt
                  </a>
                </div>
              </article>
            ))}
            <article className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Werde Teil unseres Teams</p>
              <p className="text-xs text-muted-foreground">Wir freuen uns über Initiativbewerbungen.</p>
              <a href="mailto:info@strong-energy.eu" className="btn-gradient mt-1 rounded-full px-4 py-2 text-xs font-semibold">
                Bewerben
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl md:text-4xl font-bold text-foreground">
              Unsere <span className="text-gradient">Mission</span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Wir folgen dem Trend der Entwicklung sauberer Energie und leisten einen positiven Beitrag zum globalen Umweltschutz.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/de/produkte" className="btn-gradient rounded-full px-8 py-4 text-base font-semibold shadow-lg">
                Unsere Produkte
              </Link>
              <Link href="/de/kontakt" className="rounded-full border-2 border-border px-8 py-4 text-base font-medium transition-all hover:border-primary/40 hover:bg-secondary/50">
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
