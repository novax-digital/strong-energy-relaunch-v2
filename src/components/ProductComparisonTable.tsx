import Link from "next/link";
import { ArrowUpRight, Check, X } from "lucide-react";
import { localizedPath, type Language } from "@/lib/i18n";

type LocalizedText = {
  de: string;
  en: string;
};

type ComparisonValue = {
  text?: LocalizedText;
  state?: "yes" | "no";
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
    category: "Kategorie",
    feature: "Merkmal",
    current: "Aktuelle Auswahl",
    yes: "Ja",
    no: "Nein",
    view: "Produkt ansehen"
  },
  en: {
    eyebrow: "Product comparison",
    title: "Star H and Star Q compared",
    description: "The key differences between the two all-in-one commercial storage systems at a glance.",
    category: "Category",
    feature: "Feature",
    current: "Current selection",
    yes: "Yes",
    no: "No",
    view: "View product"
  }
};

export function ProductComparisonTable({ currentProductSlug, categorySlug, lang }: { currentProductSlug: string; categorySlug: string; lang: Language }) {
  const t = copy[lang];
  const products = [
    { slug: "star-h", name: "Star H" },
    { slug: "star-q", name: "Star Q" }
  ];

  return (
    <div>
      <div className="mb-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{t.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold leading-tight text-foreground md:text-3xl">{t.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">{t.description}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left text-sm md:text-base">
            <thead>
              <tr className="bg-secondary/50">
                <th className="w-[18%] border-b border-border px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.category}</th>
                <th className="w-[22%] border-b border-border px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.feature}</th>
                {products.map((item) => {
                  const current = currentProductSlug === item.slug;
                  return (
                    <th className={`w-[30%] border-b border-l border-border px-5 py-4 ${current ? "bg-primary/10" : "bg-white/70"}`} key={item.slug}>
                      <Link
                        aria-current={current ? "page" : undefined}
                        className="group flex items-center justify-between gap-4"
                        href={`${localizedPath(`/produkte/${categorySlug}/${item.slug}`, lang)}#${lang === "de" ? "vergleich" : "comparison"}`}
                      >
                        <span>
                          <strong className="block text-xl font-bold text-foreground">{item.name}</strong>
                          <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${current ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                            {current ? t.current : t.view}
                          </span>
                        </span>
                        {!current ? <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /> : null}
                      </Link>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {comparisonGroups.map((group) =>
                group.rows.map((row, rowIndex) => (
                  <tr className="group/row" key={`${group.label.de}-${row.label.de}`}>
                    {rowIndex === 0 ? (
                      <th
                        className="border-b border-border bg-secondary/30 px-5 py-5 align-top font-bold text-foreground"
                        rowSpan={group.rows.length}
                        scope="rowgroup"
                      >
                        {localize(group.label, lang)}
                      </th>
                    ) : null}
                    <th className="border-b border-border px-5 py-5 font-semibold text-foreground transition-colors group-hover/row:bg-secondary/20" scope="row">
                      {localize(row.label, lang)}
                    </th>
                    <ComparisonCell current={currentProductSlug === "star-h"} lang={lang} value={row.starH} />
                    <ComparisonCell current={currentProductSlug === "star-q"} lang={lang} value={row.starQ} />
                  </tr>
                ))
              )}
            </tbody>
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
      <div className="flex flex-wrap items-start gap-2.5">
        {value.state ? (
          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${value.state === "yes" ? "bg-primary/[0.12] text-primary" : "bg-secondary text-muted-foreground"}`}>
            {value.state === "yes" ? <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} /> : <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />}
            {value.state === "yes" ? t.yes : t.no}
          </span>
        ) : null}
        {value.text ? <span className="min-w-0 flex-1 leading-relaxed text-muted-foreground">{localize(value.text, lang)}</span> : null}
      </div>
    </td>
  );
}

function localize(value: LocalizedText, lang: Language) {
  return value[lang];
}
