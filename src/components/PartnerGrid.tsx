import Image from "next/image";
import { Award } from "lucide-react";
import type { Partner } from "@/types/content";

export function PartnerGrid({ partners }: { partners: Partner[] }) {
  const sortedPartners = [...partners].sort((a, b) => {
    if (a.premium && !b.premium) return -1;
    if (!a.premium && b.premium) return 1;
    return a.name.localeCompare(b.name, "de");
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {sortedPartners.map((partner) => {
        const className = `group relative flex min-h-[140px] items-center justify-center rounded-xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
          partner.premium ? "border-primary/40 hover:border-primary/60" : "border-border hover:border-primary/30"
        }`;
        const content = (
          <>
            {partner.premium ? (
              <>
                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <Award className="h-3 w-3" />
                  Premium
                </span>
                <span className="absolute bottom-2 left-2 right-2 text-center text-xs font-semibold text-primary/80">*Besondere Vertragskonditionen</span>
              </>
            ) : null}
            <Image
              src={partner.logo}
              alt={partner.name}
              width={220}
              height={120}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto max-h-16 w-auto max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </>
        );

        return partner.url ? (
          <a className={className} href={partner.url} key={partner.name} rel="noopener noreferrer" target="_blank">
            {content}
          </a>
        ) : (
          <article className={className} key={partner.name}>
            {content}
          </article>
        );
      })}
    </div>
  );
}
