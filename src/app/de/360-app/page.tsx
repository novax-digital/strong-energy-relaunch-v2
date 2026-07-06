import Link from "next/link";
import type { Metadata } from "next";
import { Activity, ArrowRight, Settings, ShieldCheck } from "lucide-react";
import { AppPhoneSlider } from "@/components/AppPhoneSlider";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { pageSeo } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.app);

const features = [
  {
    icon: Activity,
    title: "Echtzeitüberwachung und Optimierung",
    text: "Behalten Sie den Überblick über den Status Ihrer Geräte und die Effizienz Ihrer Stromerzeugung - jederzeit und von überall. Die App liefert Ihnen Echtzeitdaten, Verlaufsprotokolle und ermöglicht sowohl lokale als auch entfernte Einrichtung und Steuerung Ihrer Systeme."
  },
  {
    icon: Settings,
    title: "Einfache Installation und Wartung",
    text: "Vereinfachen Sie Installation und Wartung Ihrer Energiesysteme durch bequeme Fernsteuerung und klare Anweisungen. Mit nur wenigen Klicks können Sie Befehle senden, den Betriebsstatus prüfen und Anpassungen vornehmen."
  },
  {
    icon: ShieldCheck,
    title: "Smarte Energieverwaltung und Backup-Lösungen",
    text: "Verwalten Sie Ihre Batteriekapazität effizient und priorisieren Sie die wichtigsten Stromkreise in Ihrem Haushalt. Aktivieren Sie die Backup-Leistung für den Fall eines Netzausfalls."
  }
];

export default function AppPage() {
  return (
    <>
      <SEOJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Strong Energy 360 App",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "iOS, Android"
        }}
      />
      <section className="relative overflow-hidden pb-20 pt-32 md:pt-40">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.12),transparent_45%,hsl(var(--accent)/0.1))]" />
        <div className="container-wide relative z-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Strong Energy <span className="text-gradient">360 App</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                Intelligente Überwachung für Ihre Energielösungen. Ihre zentrale Plattform für die Überwachung und Verwaltung von Energiegeräten - Wechselrichter, Energiespeicher und Zubehör.
              </p>
              <AppStoreButtons direction="row" order="apple-first" />
            </div>
            <div className="flex justify-center">
              <AppPhoneSlider />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 py-20">
        <div className="container-wide">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Alles in einer App</h2>
            <p className="text-muted-foreground">Die Strong Energy 360 App bietet Ihnen volle Kontrolle über Ihre Energiezukunft.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-xl border border-border bg-card px-6 pb-6 pt-8 text-center shadow-md transition-shadow hover:shadow-lg">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-wide text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Erleben Sie die Energie von morgen!</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">Unser Team berät Sie unverbindlich zu unseren Produkten.</p>
          <Link href="/de/kontakt" className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-semibold shadow-lg">
            Unverbindlich informieren
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
