import type { Product } from "@/types/content";

export function TechnicalData({ product }: { product: Product }) {
  const hasSpecs = product.specs?.length || product.specsSections?.length || product.specsTable;
  if (!hasSpecs) return null;

  return (
    <section className="py-16 bg-secondary/30" id="technische-daten">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Technische Daten</h2>
        {product.specs?.length ? (
          <div className="grid gap-3">
            {product.specs.map((row) => (
              <div key={row.label} className="grid md:grid-cols-[260px_1fr] gap-3 rounded-xl bg-card border border-border px-4 py-3">
                <strong className="text-foreground">{row.label}</strong>
                <span className="text-muted-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        ) : null}
        {product.specsSections?.map((section) => (
          <div className="mt-10" key={section.title}>
            <h3 className="text-xl font-bold text-foreground mb-5">{section.title}</h3>
            {section.rows ? <SpecRows rows={section.rows} /> : null}
            {section.groups?.map((group) => (
              <div className="mt-7" key={group.label}>
                <h4 className="text-lg font-semibold text-foreground mb-4">{group.label}</h4>
                <SpecRows rows={group.rows} />
              </div>
            ))}
          </div>
        ))}
        {product.specsTable ? (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card mt-8">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-secondary/60">
                  <th className="text-left p-4 font-bold text-foreground">Merkmal</th>
                  {product.specsTable.models.map((model) => <th className="text-left p-4 font-bold text-foreground" key={model}>{model}</th>)}
                </tr>
              </thead>
              <tbody>
                {product.specsTable.rows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <th className="text-left p-4 font-semibold text-foreground align-top">{row.label}</th>
                    {(row.values || []).map((value, index) => <td className="p-4 text-muted-foreground align-top" key={`${row.label}-${index}`}>{value}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SpecRows({ rows }: { rows: Array<{ label: string; value?: string; values?: string[] }> }) {
  return (
    <div className="grid gap-3">
      {rows.map((row) => (
        <div key={row.label} className="grid md:grid-cols-[260px_1fr] gap-3 rounded-xl bg-card border border-border px-4 py-3">
          <strong className="text-foreground">{row.label}</strong>
          <span className="text-muted-foreground">{row.value || row.values?.join(" | ")}</span>
        </div>
      ))}
    </div>
  );
}
