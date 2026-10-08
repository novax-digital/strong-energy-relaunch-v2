import Link from "next/link";
import { ArrowLeftRight, ArrowUpRight, Check, X } from "lucide-react";
import { localizedPath, type Language } from "@/lib/i18n";

type LocalizedText = {
  de: string;
  en: string;
};

type ComparisonValue = {
  text?: LocalizedText;
  state?: "yes" | "no";
};

export type AdditionalComparisonProduct = {
  slug: string;
  name: string;
  href: string;
  values: Record<string, ComparisonValue>;
};

type ComparisonRow = {
  label: LocalizedText;
  starH: ComparisonValue;
  starQ: ComparisonValue;
};

type ComparisonGroup = {
  label: LocalizedText;
  rows: ComparisonRow[];
};

const comparisonGroups: ComparisonGroup[] = [
  {
    label: { de: "Elektrische Daten", en: "Electrical data" },
    rows: [
      {
        label: { de: "Kapazität", en: "Capacity" },
        starH: { text: { de: "232 kWh", en: "232 kWh" } },
        starQ: { text: { de: "109 kWh", en: "109 kWh" } }
      },
      {
        label: { de: "Max. AC-Leistung", en: "Max. AC output" },
        starH: { text: { de: "115 kW", en: "115 kW" } },
        starQ: { text: { de: "50 kW", en: "50 kW" } }
      },
      {
        label: { de: "Spannung", en: "Voltage" },
        starH: { text: { de: "400 V~ 3 Ph + N + PE", en: "400 V~ 3-phase + N + PE" } },
        starQ: { text: { de: "400 V~ 3 Ph + N + PE", en: "400 V~ 3-phase + N + PE" } }
      }
    ]
  },
  {
    label: { de: "Betriebsarten", en: "Operating modes" },
    rows: [
      {
        label: { de: "Netzgekoppelt", en: "Grid-connected" },
        starH: { state: "yes" },
        starQ: { state: "yes" }
      },
      {
        label: { de: "Backup bei Netzausfall", en: "Backup during grid failure" },
        starH: { state: "no" },
        starQ: { state: "yes" }
      },
      {
        label: { de: "Offgrid", en: "Off-grid" },
        starH: { state: "no" },
        starQ: { state: "yes" }
      }
    ]
  },
  {
    label: { de: "Zusätzliche Anschlüsse", en: "Additional connections" },
    rows: [
      {
        label: { de: "Anschluss PV-Strings", en: "PV string connection" },
        starH: { state: "no" },
        starQ: { state: "yes" }
      },
      {
        label: { de: "Anschluss Generator", en: "Generator connection" },
        starH: { state: "no" },
        starQ: { state: "yes" }
      }
    ]
  },
  {
    label: { de: "Energiemanagement", en: "Energy management" },
    rows: [
      {
        label: { de: "Internes EMS", en: "Internal EMS" },
        starH: { state: "no" },
        starQ: {
          state: "yes",
          text: {
            de: "Solis EMS/Cloud – Eigenverbrauch, Peak Shaving und dynamische Tarife",
            en: "Solis EMS/Cloud – self-consumption, peak shaving and dynamic tariffs"
          }
        }
      },
      {
        label: { de: "Externes EMS", en: "External EMS" },
        starH: {
          state: "yes",
          text: {
            de: "Z. B. Consolinno CEMS; eigenes EMS möglich – Lesen und Steuern",
            en: "E.g. Consolinno CEMS; custom EMS possible – read and control"
          }
        },
        starQ: {
          state: "yes",
          text: {
            de: "Z. B. Solar Manager HEMS; eigenes EMS möglich – nur Lesen, nicht Steuern",
            en: "E.g. Solar Manager HEMS; custom EMS possible – read only, no control"
          }
        }
      }
    ]
  }
];

const copy = {
  de: {
    eyebrow: "Produktvergleich",
    title: "Star H und Star Q im direkten Vergleich",
    description: "Die wichtigsten Unterschiede der beiden All-in-One-Gewerbespeicher auf einen Blick.",
    feature: "Merkmal",
    current: "Aktuelle Auswahl",
    yes: "Ja",
    no: "Nein",
    view: "Produkt ansehen",
    scroll: "Seitlich scrollen, um alle Produkte zu vergleichen"
  },
  en: {
    eyebrow: "Product comparison",
    title: "Star H and Star Q compared",
    description: "The key differences between the two all-in-one commercial storage systems at a glance.",
    feature: "Feature",
    current: "Current selection",
    yes: "Yes",
    no: "No",
    view: "View product",
    scroll: "Scroll sideways to compare all products"
  }
};

export function ProductComparisonTable({ currentProductSlug, categorySlug, lang, additionalProduct }: { currentProductSlug: string; categorySlug: string; lang: Language; additionalProduct?: AdditionalComparisonProduct }) {
  const t = copy[lang];
  const products = [
    { slug: "star-h", name: "Star H", href: `${localizedPath(`/produkte/${categorySlug}/star-h`, lang)}#${lang === "de" ? "vergleich" : "comparison"}` },
    { slug: "star-q", name: "Star Q", href: `${localizedPath(`/produkte/${categorySlug}/star-q`, lang)}#${lang === "de" ? "vergleich" : "comparison"}` },
    ...(additionalProduct ? [additionalProduct] : [])
  ];

  return (
    <div>
      <div className="mb-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{t.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold leading-tight text-foreground md:text-3xl">{additionalProduct ? `${products.map((item) => item.name).join(", ")} ${lang === "de" ? "im Vergleich" : "compared"}` : t.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">{additionalProduct ? (lang === "de" ? "Die wichtigsten Unterschiede der All-in-One-Gewerbespeicher auf einen Blick." : "The key differences between the all-in-one commercial storage systems at a glance.") : t.description}</p>
      </div>

      <p className={`mb-3 flex items-center gap-2 text-sm text-muted-foreground ${additionalProduct ? "xl:hidden" : "lg:hidden"}`}>
        <ArrowLeftRight aria-hidden="true" className="h-4 w-4 shrink-0" />
        {t.scroll}
      </p>
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div aria-label={t.eyebrow} className="overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary" role="region" tabIndex={0}>
          <table className={`w-full table-fixed border-separate border-spacing-0 text-left text-sm ${additionalProduct ? "min-w-[calc(300vw-336px)] sm:min-w-[960px]" : "min-w-[calc(200vw-184px)] sm:min-w-[720px]"}`}>
            <caption className="sr-only">{additionalProduct ? `${products.map((item) => item.name).join(", ")} – ${t.eyebrow}` : t.title}</caption>
            <colgroup>
              <col className={additionalProduct ? "w-[120px] sm:w-[22%]" : "w-[120px] sm:w-[28%]"} />
              {products.map((item) => <col className={additionalProduct ? "sm:w-[26%]" : "sm:w-[36%]"} key={item.slug} />)}
            </colgroup>
            <thead>
              <tr className="bg-secondary/50">
                <th className="sticky left-0 z-10 border-b border-border bg-secondary px-5 py-6 align-bottom text-xs font-bold uppercase tracking-wider text-muted-foreground" scope="col">{t.feature}</th>
                {products.map((item) => {
                  const current = currentProductSlug === item.slug;
                  return (
                    <th className={`border-b border-l border-border px-5 py-6 align-top ${current ? "bg-primary/10" : "bg-white"}`} key={item.slug} scope="col">
                      <Link
                        aria-current={current ? "page" : undefined}
                        className="group flex items-start justify-between gap-3 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        href={item.href}
                      >
                        <span>
                          <strong className="block break-words text-xl font-bold leading-tight text-foreground">{item.name}</strong>
                          <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${current ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                            {current ? t.current : t.view}
                          </span>
                        </span>
                        {!current ? <ArrowUpRight aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /> : null}
                      </Link>
                    </th>
                  );
                })}
              </tr>
            </thead>
            {comparisonGroups.map((group) => (
              <tbody key={group.label.en}>
                <tr>
                  <th className="border-b border-border bg-secondary/60 px-5 py-3 text-xs font-bold uppercase tracking-wider text-foreground" colSpan={products.length + 1} scope="rowgroup">
                    <span className="sticky left-5">{localize(group.label, lang)}</span>
                  </th>
                </tr>
                {group.rows.map((row, rowIndex) => (
                  <tr className={`group/row ${rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}`} key={row.label.en}>
                    <th className={`sticky left-0 z-10 border-b border-r border-border px-5 py-5 align-top font-semibold leading-relaxed text-foreground ${rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}`} scope="row">
                      {localize(row.label, lang)}
                    </th>
                    <ComparisonCell current={currentProductSlug === "star-h"} lang={lang} value={row.starH} />
                    <ComparisonCell current={currentProductSlug === "star-q"} lang={lang} value={row.starQ} />
                    {additionalProduct ? <ComparisonCell current={currentProductSlug === additionalProduct.slug} lang={lang} value={additionalProduct.values[row.label.en] || { text: { de: "Nicht angegeben", en: "Not specified" } }} /> : null}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

function ComparisonCell({ value, current, lang }: { value: ComparisonValue; current: boolean; lang: Language }) {
  const t = copy[lang];
  return (
    <td className={`border-b border-l border-border px-5 py-5 align-top transition-colors ${current ? "bg-primary/[0.045]" : "group-hover/row:bg-secondary/20"}`}>
      <div className="space-y-2.5 break-words">
        {value.state ? (
          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${value.state === "yes" ? "bg-primary/[0.12] text-primary" : "bg-secondary text-muted-foreground"}`}>
            {value.state === "yes" ? <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} /> : <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />}
            {value.state === "yes" ? t.yes : t.no}
          </span>
        ) : null}
        {value.text ? <p className="leading-relaxed text-muted-foreground">{localize(value.text, lang)}</p> : null}
      </div>
    </td>
  );
}

function localize(value: LocalizedText, lang: Language) {
  return value[lang];
}
