import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Clock3,
  Code2,
  ExternalLink,
  FileText,
  FolderOpen,
  ImageIcon,
  Languages,
  LayoutTemplate,
  Link2,
  ListChecks,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  WandSparkles
} from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Developer Review: Blog & Media | Strong Energy",
  description: "Interne Review-Seite für die geplante Blog-, SEO- und Media-Struktur von Strong Energy.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

const existingFeatures = [
  "Blog-Entwürfe und Veröffentlichungsstatus",
  "Deutsch/Englisch als verknüpftes Übersetzungspaar",
  "KI-Generator für beide Sprachversionen",
  "Media-Haupt- und Unterkategorien",
  "Stapel-Upload für mehrere Bilder",
  "Produktverknüpfung an einzelnen Medien"
];

const extensionFeatures = [
  "SEO-Titel, Meta-Description und Fokus-Keyword als eigene Felder",
  "Produktverknüpfung direkt am Blogbeitrag",
  "Bilder und Galerien als feste Inhaltsblöcke im Beitrag",
  "Alt-Texte, Bildunterschriften und Social-Preview pro Artikel",
  "Vorschau-Link vor Veröffentlichung",
  "Redaktioneller SEO-Check vor dem Livegang"
];

const seoChecks = [
  ["Suchintention", "Informationssuche + gewerbliche Lösungsrecherche", "ready"],
  ["SEO-Titel", "Gewerbespeicher im Einsatz: EDI Hohenlohe | Strong Energy", "review"],
  ["Slug", "/de/blog/gewerbespeicher-edi-hohenlohe", "ready"],
  ["Meta-Description", "Installation, Nutzen und Projektablauf kompakt in 150–160 Zeichen", "review"],
  ["Interne Links", "Gewerbespeicher, Kontakt, passende Downloads und weitere Referenzen", "ready"],
  ["Strukturierte Daten", "BlogPosting + BreadcrumbList + optionale FAQPage", "planned"]
] as const;

const articleOutline = [
  "Ausgangslage bei EDI Hohenlohe",
  "Warum ein Gewerbespeicher die passende Lösung war",
  "Planung und Installation vor Ort",
  "Technik, Leistung und Einbindung",
  "Nutzen im laufenden Betrieb",
  "Fazit und nächster Schritt"
];

const mediaImages = [
  "/assets/gewerbespeicher-container-scene-1-C4Hv32Tu.png",
  "/assets/gewerbespeicher-container-scene-3-Dgn3Ua5-.jpg",
  "/assets/gewerbespeicher-container-scene-5-BkyF3f2E.jpg"
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function StatusBadge({ status }: { status: "ready" | "review" | "planned" }) {
  const labels = {
    ready: "Vorhanden",
    review: "Abstimmen",
    planned: "Erweitern"
  };

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        status === "ready" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        status === "review" && "border-amber-200 bg-amber-50 text-amber-700",
        status === "planned" && "border-sky-200 bg-sky-50 text-sky-700"
      )}
    >
      <span className={cx("h-1.5 w-1.5 rounded-full", status === "ready" && "bg-emerald-500", status === "review" && "bg-amber-500", status === "planned" && "bg-sky-500")} />
      {labels[status]}
    </span>
  );
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">{title}</h2>
      <div className="mt-4 text-base leading-7 text-slate-600">{children}</div>
    </div>
  );
}

function ReviewCard({ icon, title, children, className }: { icon: ReactNode; title: string; children: ReactNode; className?: string }) {
  return (
    <article className={cx("rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_60px_rgba(15,23,42,0.06)]", className)}>
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-primary">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div>
    </article>
  );
}

function Checklist({ items, tone = "green" }: { items: string[]; tone?: "green" | "blue" }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li className="flex gap-3" key={item}>
          <span className={cx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", tone === "green" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700")}>
            {tone === "green" ? <Check className="h-3 w-3" strokeWidth={3} /> : <ChevronRight className="h-3 w-3" strokeWidth={3} />}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FolderRow({ level, children, accent = false }: { level: number; children: ReactNode; accent?: boolean }) {
  return (
    <div className={cx("flex items-center gap-2 rounded-xl px-3 py-2 text-sm", accent ? "bg-primary/10 font-semibold text-primary" : "text-slate-700")} style={{ marginLeft: `${level * 24}px` }}>
      {level < 3 ? <FolderOpen className="h-4 w-4 shrink-0" /> : <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />}
      <span>{children}</span>
    </div>
  );
}

export default function BlogMediaReviewPage() {
  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-950">
      <header className="border-b border-white/10 bg-[#102b2c] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Image alt="Strong Energy" className="h-9 w-auto object-contain brightness-0 invert" height={48} priority src="/assets/logo-CkaIU7X8.png" width={156} />
            <span className="hidden h-6 w-px bg-white/20 sm:block" />
            <span className="hidden text-sm text-white/65 sm:block">Developer Review</span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-100">
            <CircleDashed className="h-3.5 w-3.5" />
            Nicht live · nur Review
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#102b2c] text-white">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-48 left-1/4 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/75">
              <Clock3 className="h-3.5 w-3.5" />
              Stand: 16. November 2026
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Review-Konzept für Blog, SEO und Media
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
              Eine gemeinsame „Maske“ für den ersten Musterbeitrag – inklusive redaktionellem Aufbau, Backend-Feldern, Produktvernetzung und der neuen Installationsstruktur in der Media Gallery.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["06", "Bausteine vorhanden"],
              ["06", "Erweiterungen"],
              ["01", "Musterbeitrag"]
            ].map(([value, label]) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur" key={label}>
                <p className="text-2xl font-semibold text-lime-200">{value}</p>
                <p className="mt-1 text-[11px] leading-4 text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-4 text-sm font-medium text-slate-500 md:px-8">
          {[
            ["#ziel", "Review-Ziel"],
            ["#musterbeitrag", "Musterbeitrag"],
            ["#cms", "CMS & SEO"],
            ["#media", "Media-Struktur"],
            ["#status", "Status & Abnahme"]
          ].map(([href, label]) => (
            <a className="whitespace-nowrap transition-colors hover:text-primary" href={href} key={href}>{label}</a>
          ))}
        </div>
      </nav>

      <section className="scroll-mt-20 border-b border-slate-200" id="ziel">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHeading eyebrow="01 · Zielbild" title="Erst ein Template abstimmen, dann skalieren">
            <p>
              Der erste Artikel wird als verbindliche Blaupause umgesetzt. Erst nach Freigabe von Struktur, Bildsprache, SEO-Feldern und CTA werden die weiteren Drive-Folder nach demselben Schema verarbeitet.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <ReviewCard icon={<LayoutTemplate className="h-5 w-5" />} title="Ein festes Artikel-Template">
              Wiederholbare Reihenfolge aus Hero, Einleitung, Inhaltsverzeichnis, modularen Abschnitten, Galerie, Produktbezug, FAQ und Kontakt-CTA.
            </ReviewCard>
            <ReviewCard icon={<Search className="h-5 w-5" />} title="SEO von Anfang an">
              Suchintention, URL, Meta-Daten, Überschriften, Alt-Texte, interne Links und strukturierte Daten werden Teil des Workflows – nicht nachträglich ergänzt.
            </ReviewCard>
            <ReviewCard icon={<Boxes className="h-5 w-5" />} title="Content mehrfach nutzen">
              Bilder liegen zentral in Media, werden im Artikel eingebunden und mit passenden Produkten verknüpft. Das vermeidet doppelte Uploads und lose Dateien.
            </ReviewCard>
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 bg-white" id="musterbeitrag">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="02 · Musterbeitrag" title="Vorgeschlagene Artikel-Maske">
              <p>
                Als erste Review-Story bietet sich „Gewerbespeicher EDI Hohenlohe“ an. Die Ausrichtung ist eine SEO-taugliche Referenzstory: verständlich für Interessenten, fachlich belastbar und eng mit der Gewerbespeicher-Lösung vernetzt.
              </p>
            </SectionHeading>
            <StatusBadge status="review" />
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-[#fbfcfb] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-6 sm:p-10 lg:p-12">
                <div className="mb-7 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-700">Referenzprojekt</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">6–8 Min. Lesezeit</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">DE + EN</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Gewerbespeicher im Einsatz</p>
                <h3 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl">
                  Wie EDI Hohenlohe mit einem Gewerbespeicher Energie flexibler nutzt
                </h3>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                  Ein Blick hinter die Kulissen: von der Ausgangslage über Planung und Installation bis zum erwarteten Nutzen im täglichen Betrieb.
                </p>
                <div className="mt-9 grid gap-5 border-t border-slate-200 pt-8 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Primäres Keyword</p>
                    <p className="mt-2 text-sm font-medium text-slate-800">Gewerbespeicher Unternehmen</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Produktverknüpfung</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary"><Package className="h-4 w-4" /> Gewerbespeicher</p>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[360px] bg-[#e7eeeb] lg:min-h-full">
                <Image alt="Platzhalter für das Titelbild des EDI-Hohenlohe-Projekts" className="object-cover" fill sizes="(min-width: 1024px) 42vw, 100vw" src="/assets/gewerbespeicher-container-scene-1-C4Hv32Tu.png" />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/40 bg-slate-950/65 p-4 text-sm text-white backdrop-blur-md">
                  <p className="font-semibold">Titelbild-Platzhalter</p>
                  <p className="mt-1 text-xs text-white/65">Finales Motiv wird aus dem Drive-Folder ausgewählt.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-3xl border border-slate-200 bg-[#f7f9f8] p-6 md:p-8">
              <div className="flex items-center gap-3">
                <ListChecks className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Feste Artikelstruktur</h3>
              </div>
              <ol className="mt-6 space-y-3">
                {articleOutline.map((item, index) => (
                  <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700" key={item}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[11px] font-semibold text-white">{String(index + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-[#f7f9f8] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Bildkonzept im Beitrag</h3>
                </div>
                <span className="text-xs font-medium text-slate-400">Beispielbilder</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {mediaImages.map((src, index) => (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200" key={src}>
                    <Image alt={`Beispiel für Bildposition ${index + 1}`} className="object-cover" fill sizes="(min-width: 1024px) 15vw, 30vw" src={src} />
                    <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/70 text-[10px] font-bold text-white">{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Hero", "Stärkstes Gesamtmotiv"],
                  ["Inline", "2–3 Bilder entlang der Story"],
                  ["Galerie", "Weitere Installationsdetails"],
                  ["CTA", "Produkt + Beratung verlinken"]
                ].map(([label, description]) => (
                  <div className="rounded-2xl bg-white p-4" key={label}>
                    <p className="text-sm font-semibold text-slate-900">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-500">
                Die gezeigten Motive sind nur Layout-Platzhalter. Die finalen EDI-Bilder werden nach Auswahl, Freigabe und Optimierung eingesetzt.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 border-y border-slate-200 bg-[#eef3f1]" id="cms">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHeading eyebrow="03 · Backend & SEO" title="Die Maske führt durch den gesamten Beitrag">
            <p>
              Redakteure sollen keinen freien Blanko-Editor bekommen, sondern einen verständlichen Ablauf mit Pflichtfeldern, Hilfetexten und einem SEO-Status. Das schafft konsistente Beiträge und macht neue Artikel deutlich schneller.
            </p>
          </SectionHeading>

          <div className="mt-12 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Beitrag bearbeiten</p>
                  <p className="mt-1 text-xs text-slate-500">Gewerbespeicher EDI Hohenlohe · Entwurf</p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">SEO 72%</span>
              </div>
              <div className="grid gap-0 md:grid-cols-[0.78fr_1.22fr]">
                <div className="border-b border-slate-200 bg-slate-50 p-5 md:border-b-0 md:border-r">
                  <div className="space-y-1">
                    {[
                      [FileText, "Grunddaten", true],
                      [LayoutTemplate, "Inhaltsblöcke", false],
                      [Search, "SEO & Social", false],
                      [Link2, "Produkte & Links", false],
                      [Languages, "Übersetzung", false],
                      [ShieldCheck, "Freigabe", false]
                    ].map(([Icon, label, active]) => {
                      const EntryIcon = Icon as typeof FileText;
                      return (
                        <div className={cx("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", active ? "bg-primary text-white" : "text-slate-600")} key={String(label)}>
                          <EntryIcon className="h-4 w-4" />
                          {String(label)}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-5 p-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Beitragstitel *</label>
                    <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800">Wie EDI Hohenlohe mit einem Gewerbespeicher Energie flexibler nutzt</div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Kategorie *</label>
                      <div className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">Referenzprojekte</div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Autor *</label>
                      <div className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">Strong Energy Redaktion</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Kurzbeschreibung *</label>
                    <div className="mt-2 min-h-20 rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-500">Kurzer Teaser für Listing, Social Preview und Einleitung …</div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Verknüpfte Produkte *</label>
                    <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-slate-200 p-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><Package className="h-3.5 w-3.5" /> Gewerbespeicher <span>×</span></span>
                      <span className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-400">+ Produkt</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                    <span className="text-xs text-slate-500">Zuletzt gespeichert: vor 2 Min.</span>
                    <div className="flex gap-2">
                      <span className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">Vorschau</span>
                      <span className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white">Entwurf speichern</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <div className="space-y-6">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">SEO-Prüfung pro Beitrag</h3>
                </div>
                <div className="mt-6 divide-y divide-slate-100">
                  {seoChecks.map(([label, value, status]) => (
                    <div className="grid gap-2 py-4 sm:grid-cols-[120px_1fr_auto] sm:items-center" key={label}>
                      <p className="text-xs font-semibold text-slate-500">{label}</p>
                      <p className="text-sm leading-5 text-slate-700">{value}</p>
                      <StatusBadge status={status} />
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-[#102b2c] p-6 text-white md:p-8">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-lime-200" />
                  <h3 className="text-lg font-semibold">KI als Redaktionshilfe</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/65">
                  Die KI übersetzt und optimiert, aber arbeitet innerhalb des festen Schemas. Fakten, Produktdaten, Bildrechte und Freigabe bleiben ein menschlicher Review-Schritt.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  {[
                    "DE → EN",
                    "Text kürzen",
                    "SEO-Vorschläge",
                    "Alt-Texte",
                    "FAQ-Entwurf"
                  ].map((item) => <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-white/75" key={item}>{item}</span>)}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 bg-white" id="media">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHeading eyebrow="04 · Media Gallery" title="Installationen werden nach Projekten gruppiert">
            <p>
              „Installationen“ bleibt der sichtbare Haupt-Tab. Darunter entstehen zwei klare Bereiche: bestehende ALFRED-Projekte und neue Gewerbespeicher-Projekte. Jedes Projekt ist eine eigene Unterkategorie und kann direkt mit Artikeln und Produkten verknüpft werden.
            </p>
          </SectionHeading>

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-3xl border border-slate-200 bg-[#f7f9f8] p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Zielstruktur</h3>
                </div>
                <StatusBadge status="planned" />
              </div>
              <div className="mt-6 space-y-1 rounded-2xl border border-slate-200 bg-white p-3">
                <FolderRow level={0}>Media</FolderRow>
                <FolderRow level={1}>Installationen</FolderRow>
                <FolderRow level={2}>ALFRED Installationen</FolderRow>
                <FolderRow level={3}>T&amp;S Solar Installation ALFRED</FolderRow>
                <FolderRow level={3}>Endkunde ALFRED 10 (24 kWh)</FolderRow>
                <FolderRow level={2} accent>Gewerbespeicher Installationen</FolderRow>
                <FolderRow level={3}>Gewerbespeicher EDI Hohenlohe</FolderRow>
                <FolderRow level={3}>01 · Titelmotiv</FolderRow>
                <FolderRow level={3}>02 · Anlieferung</FolderRow>
                <FolderRow level={3}>03 · Installation</FolderRow>
              </div>
              <div className="mt-5 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Dateinamenschema</p>
                <code className="mt-2 block break-all text-sm text-slate-700">gewerbespeicher-edi-hohenlohe-01.webp</code>
                <p className="mt-2 text-xs leading-5 text-slate-500">Durchgehend nummeriert, weboptimiert und ohne Handy-Dateinamen.</p>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-[#f7f9f8] p-6 md:p-8">
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Stapelverarbeitung im Backend</h3>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["01", "Bilder auswählen", "Alle freigegebenen Bilder gemeinsam hochladen."],
                  ["02", "Projekt wählen", "Unterkategorie und passendes Produkt einmalig zuordnen."],
                  ["03", "Automatisch optimieren", "Dateien nummerieren, WebP erzeugen und Größe reduzieren."],
                  ["04", "Metadaten prüfen", "Alt-Texte, Bildtitel, Reihenfolge und Veröffentlichung freigeben."]
                ].map(([number, title, description]) => (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5" key={number}>
                    <span className="text-xs font-bold text-primary">{number}</span>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-[#102b2c] p-5 text-white">
                <div className="flex items-center gap-3">
                  <WandSparkles className="h-5 w-5 text-lime-200" />
                  <p className="text-sm font-semibold">Empfohlene Automatik</p>
                </div>
                <p className="mt-3 text-xs leading-5 text-white/65">Alt-Texte werden auf Basis von Projekt, Motiv und Produkt vorgeschlagen. Vor der Veröffentlichung bleiben sie editierbar.</p>
              </div>
            </article>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90" href="/de/media">
              Aktuelle Media Gallery ansehen <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary" href="/admin">
              Bestehendes Backend öffnen <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 border-t border-slate-200 bg-[#f7f9f8]" id="status">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHeading eyebrow="05 · Umsetzung" title="Was schon steht – und was vor Live noch fehlt">
            <p>
              Die technische Basis ist bereits vorhanden. Der nächste Entwicklungsschritt schließt gezielt die Lücken für ein belastbares SEO- und Content-System, ohne die bestehende Administration neu zu bauen.
            </p>
          </SectionHeading>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <ReviewCard className="p-7 md:p-8" icon={<CheckCircle2 className="h-5 w-5" />} title="Im aktuellen System vorhanden">
              <div className="mt-5"><Checklist items={existingFeatures} /></div>
            </ReviewCard>
            <ReviewCard className="p-7 md:p-8" icon={<Code2 className="h-5 w-5" />} title="Gezielte Erweiterungen">
              <div className="mt-5"><Checklist items={extensionFeatures} tone="blue" /></div>
            </ReviewCard>
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div className="max-w-xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Für die Freigabe des Musterbeitrags</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Sobald diese fünf Punkte abgestimmt sind, kann der erste Artikel mit den echten Drive-Inhalten umgesetzt und anschließend als Template für die weiteren Folder verwendet werden.
                </p>
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                {[
                  "Finaler Ausgangstext aus Drive",
                  "Freigegebene EDI-Bilder + Bildrechte",
                  "Konkrete Produkt- und Leistungsdaten",
                  "Gewünschter Autor / Ansprechpartner",
                  "CTA-Ziel: Produktseite oder Anfrage"
                ].map((item, index) => (
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4" key={item}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">{index + 1}</span>
                    <p className="text-sm leading-5 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#102b2c] text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 text-sm md:flex-row md:items-center md:px-8">
          <div>
            <p className="font-semibold">Strong Energy · Developer Review</p>
            <p className="mt-1 text-xs text-white/50">Interner Konzeptstand · nicht zur Veröffentlichung bestimmt</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/55">
            <ShieldCheck className="h-4 w-4" />
            noindex · nicht in Navigation oder Sitemap
          </div>
        </div>
      </footer>
    </main>
  );
}
