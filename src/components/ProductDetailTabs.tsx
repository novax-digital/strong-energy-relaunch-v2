"use client";

import { useId, useMemo, useSyncExternalStore } from "react";
import { Download } from "lucide-react";
import { ProductComparisonTable, type AdditionalComparisonProduct } from "@/components/ProductComparisonTable";
import { ProductFeatureIcon } from "@/components/ProductFeatureIcon";
import { bloombergNefTabCopy } from "@/content/bloombergNef";
import type { DownloadItem, Product, SpecGroup, SpecRow, SpecSection } from "@/types/content";
import { useLiveDownloads } from "@/hooks/useLiveDownloads";
import { translations, type Language } from "@/lib/i18n";

type ProductTab = "description" | "features" | "specs" | "comparison" | "bloombergnef" | "downloads";

const tabHashes: Record<Language, Record<ProductTab, string>> = {
  de: {
    description: "beschreibung",
    features: "features",
    specs: "technische-daten",
    comparison: "vergleich",
    bloombergnef: "bloombergnef-tier-1",
    downloads: "downloads"
  },
  en: {
    description: "description",
    features: "features",
    specs: "technical-data",
    comparison: "comparison",
    bloombergnef: "bloombergnef-tier-1",
    downloads: "downloads"
  }
};

const tabsByHash: Record<string, ProductTab> = {
  beschreibung: "description",
  description: "description",
  features: "features",
  specs: "specs",
  "technische-daten": "specs",
  "technical-data": "specs",
  vergleich: "comparison",
  comparison: "comparison",
  "bloombergnef-tier-1": "bloombergnef",
  downloads: "downloads"
};

export function ProductDetailTabs({ downloads, product, lang = "de", additionalComparisonProduct }: { downloads: DownloadItem[]; product: Product; lang?: Language; additionalComparisonProduct?: AdditionalComparisonProduct }) {
  const liveDownloads = useLiveDownloads(downloads, product.slug);
  const downloadsWithFile = useMemo(() => liveDownloads.filter((download) => hasDownloadFile(download, lang)), [lang, liveDownloads]);
  const baseId = useId();
  const t = translations[lang].products;
  const tabs = useMemo(() => {
    const tabLabels: Array<{ id: ProductTab; label: string }> = [
      { id: "description", label: t.tabs.description },
      { id: "features", label: t.tabs.features },
      { id: "specs", label: t.tabs.specs },
      { id: "comparison", label: t.tabs.comparison },
      { id: "bloombergnef", label: "BloombergNEF Tier-1" },
      { id: "downloads", label: t.tabs.downloads }
    ];
    const hasSpecs = Boolean(product.specs?.length || product.specsSections?.length || product.specsTable);
    const hasComparison = ["star-h", "star-q", "onovo-kunstor"].includes(product.slug) || Boolean(additionalComparisonProduct);
    const hasBloombergNef = product.slug === "star-h" || product.slug === "star-q";
    return tabLabels.filter((tab) => (tab.id !== "specs" || hasSpecs) && (tab.id !== "comparison" || hasComparison) && (tab.id !== "bloombergnef" || hasBloombergNef));
  }, [additionalComparisonProduct, product.slug, product.specs?.length, product.specsSections?.length, product.specsTable, t.tabs.comparison, t.tabs.description, t.tabs.downloads, t.tabs.features, t.tabs.specs]);
  const urlHash = useSyncExternalStore(subscribeToUrlHash, getUrlHash, getServerUrlHash);
  const requestedTab = tabsByHash[urlHash];
  const activeTab = requestedTab && tabs.some((tab) => tab.id === requestedTab) ? requestedTab : "description";

  function selectTab(tab: ProductTab) {
    const nextHash = tabHashes[lang][tab];
    if (getUrlHash() === nextHash) return;

    const url = new URL(window.location.href);
    url.hash = nextHash;
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event("hashchange"));
  }

  return (
    <section className="container-wide relative mt-12 scroll-mt-28 md:mt-16 md:scroll-mt-32">
      {tabs.filter((tab) => tab.id !== "description").map((tab) => (
        <span aria-hidden="true" className="absolute top-0 scroll-mt-28 md:scroll-mt-32" id={tabHashes[lang][tab.id]} key={`${tab.id}-anchor`} />
      ))}
      <div className="rounded-2xl bg-secondary/45 p-1">
        <div aria-label={lang === "en" ? "Product details" : "Produktdetails"} className={`grid grid-cols-2 gap-1 ${tabs.length > 5 ? "md:grid-cols-3 lg:flex" : "md:flex"}`} role="tablist">
          {tabs.map((tab, index) => {
            const selected = activeTab === tab.id;
            return (
              <button
                aria-controls={`${baseId}-${tab.id}`}
                aria-selected={selected}
                className={`min-h-12 min-w-0 rounded-xl px-3 py-2 text-sm font-bold leading-tight transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:min-h-11 md:flex-1 ${tabs.length > 5 ? "md:px-3 xl:px-8" : "md:px-8"} ${tabs.length % 2 !== 0 && index === tabs.length - 1 ? "col-span-2 md:col-span-1" : ""} ${
                  selected ? "border-2 border-primary bg-white text-foreground shadow-sm" : "border-2 border-transparent text-muted-foreground hover:text-foreground"
                }`}
                id={`${baseId}-${tab.id}-tab`}
                key={tab.id}
                onClick={() => selectTab(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        aria-labelledby={`${baseId}-${activeTab}-tab`}
        className="pt-10 md:pt-12"
        id={`${baseId}-${activeTab}`}
        role="tabpanel"
        tabIndex={0}
      >
        {activeTab === "description" ? <DescriptionPanel product={product} /> : null}
        {activeTab === "features" ? <FeaturesPanel product={product} /> : null}
        {activeTab === "specs" ? <TechnicalPanel product={product} lang={lang} /> : null}
        {activeTab === "comparison" ? <ProductComparisonTable categorySlug={product.categorySlug} currentProductSlug={product.slug} lang={lang} additionalProduct={additionalComparisonProduct} /> : null}
        {activeTab === "bloombergnef" ? <BloombergNefPanel lang={lang} /> : null}
        {activeTab === "downloads" ? <DownloadsPanel downloads={downloadsWithFile} lang={lang} /> : null}
      </div>
    </section>
  );
}

function subscribeToUrlHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

function getUrlHash() {
  return decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
}

function getServerUrlHash() {
  return "";
}

function DescriptionPanel({ product }: { product: Product }) {
  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
        {product.name} – {product.subtitle}
      </h2>
      <p className="mt-6 whitespace-pre-line text-base leading-[1.7] text-muted-foreground md:text-lg">
        {product.description}
      </p>
    </div>
  );
}

function FeaturesPanel({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {product.highlights.map((item) => (
        <article className="min-h-[13rem] rounded-2xl border border-border bg-white p-6 shadow-sm" key={item.title}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ProductFeatureIcon className="h-7 w-7" icon={item.icon} strokeWidth={1.8} />
          </div>
          <h3 className="mt-6 text-lg font-bold leading-snug text-foreground">{item.title}</h3>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function BloombergNefPanel({ lang }: { lang: Language }) {
  const content = bloombergNefTabCopy[lang];

  return (
    <div className="max-w-5xl text-base leading-[1.7] text-muted-foreground md:text-lg">
      <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">BloombergNEF Tier-1</h2>
      <p className="mt-6">{content.introduction}</p>
      <h3 className="mt-8 text-lg font-bold text-foreground md:text-xl">{content.benefitsTitle}</h3>
      <ul className="mt-4 list-disc space-y-4 pl-6 marker:text-primary">
        {content.benefits.map((benefit) => (
          <li key={benefit.title}>
            <strong className="font-bold text-foreground">{benefit.title}:</strong> {benefit.text}
          </li>
        ))}
      </ul>
      <p className="mt-8"><strong className="font-bold text-foreground">{content.closing}</strong></p>
    </div>
  );
}

function TechnicalPanel({ product, lang }: { product: Product; lang: Language }) {
  const t = translations[lang].products;
  const hasSpecs = product.specs?.length || product.specsSections?.length || product.specsTable;
  if (!hasSpecs) return <p className="text-lg text-muted-foreground">{t.noSpecs}</p>;

  return (
    <div className="space-y-8">
      {product.specs?.length ? <SpecSectionCard section={{ title: t.specsTitle, rows: product.specs }} /> : null}
      {product.specsSections?.map((section) => <SpecSectionCard key={section.title} section={section} />)}
      {product.specsTable ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="bg-primary/10 px-5 py-4 md:px-6">
            <h3 className="text-xl font-bold text-primary">{t.specsTitle}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[720px] text-base">
              <thead>
                <tr className="bg-white">
                  <th className="font-bold text-foreground">{t.specsFeature}</th>
                  {product.specsTable.models.map((model) => (
                    <th className="font-bold text-foreground" key={model}>{model}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.specsTable.rows.map((row, rowIndex) => (
                  <tr className={rowIndex % 2 === 0 ? "bg-secondary/35" : "bg-white"} key={row.label}>
                    <th className="font-bold text-foreground">{row.label}</th>
                    {(row.values || []).map((value, valueIndex) => (
                      <td className="text-muted-foreground" key={`${row.label}-${valueIndex}`}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DownloadsPanel({ downloads, lang }: { downloads: DownloadItem[]; lang: Language }) {
  const t = translations[lang].products;
  if (!downloads.length) return <p className="text-lg text-muted-foreground">{t.noDownloads}</p>;

  return (
    <div className="max-w-4xl space-y-3">
      {downloads.map((item) => {
        const href = lang === "en" ? item.local_file_url_en || item.file_url_en || item.local_file_url_de || item.file_url_de || "#" : item.local_file_url_de || item.file_url_de || "#";
        const title = lang === "en" ? item.title_en || item.title_de : item.title_de;
        const description = lang === "en" ? item.description_en || item.description_de : item.description_de;
        return (
          <a
            className="flex items-center gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md md:p-6"
            href={href}
            key={item.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Download className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <span className="min-w-0">
              <strong className="block text-lg font-bold text-foreground md:text-xl">{title}</strong>
              {description ? <span className="mt-2 block text-base text-muted-foreground">{description}</span> : null}
            </span>
          </a>
        );
      })}
    </div>
  );
}

function hasDownloadFile(item: DownloadItem, lang: Language) {
  return Boolean(lang === "en" ? item.local_file_url_en || item.file_url_en || item.local_file_url_de || item.file_url_de : item.local_file_url_de || item.file_url_de);
}

function SpecSectionCard({ section }: { section: SpecSection }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="bg-primary/10 px-5 py-4 md:px-6">
        <h3 className="text-xl font-bold text-primary">{section.title}</h3>
      </div>
      {section.rows?.length ? <SpecRows rows={section.rows} /> : null}
      {section.groups?.length ? <SpecGroups groups={section.groups} /> : null}
    </div>
  );
}

function SpecRows({ rows }: { rows: SpecRow[] }) {
  return (
    <div className="divide-y divide-border">
      {rows.map((row, index) => (
        <div className={`grid gap-3 px-5 py-4 md:grid-cols-[minmax(220px,0.85fr)_minmax(0,1.7fr)] md:px-6 ${index % 2 === 0 ? "bg-secondary/35" : "bg-white"}`} key={row.label}>
          <strong className="text-base text-foreground">{row.label}</strong>
          <span className="text-base text-muted-foreground">{formatSpecValue(row)}</span>
        </div>
      ))}
    </div>
  );
}

function SpecGroups({ groups }: { groups: SpecGroup[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[720px] text-base">
        <tbody>
          {groups.flatMap((group) =>
            group.rows.map((row, rowIndex) => (
              <tr className={rowIndex % 2 === 0 ? "bg-secondary/35" : "bg-white"} key={`${group.label}-${row.label}`}>
                {rowIndex === 0 ? (
                  <th className="w-[24%] border-r border-border align-top text-base font-bold text-foreground" rowSpan={group.rows.length}>
                    {group.label}
                  </th>
                ) : null}
                <td className="w-[34%] text-base font-semibold text-foreground">{row.label}</td>
                <td className="text-base text-muted-foreground">{formatSpecValue(row)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatSpecValue(row: SpecRow) {
  return row.value || row.values?.join(" | ") || "";
}
