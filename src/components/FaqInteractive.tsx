"use client";

import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { FaqGroup } from "@/types/content";
import { translations, type Language } from "@/lib/i18n";

export function FaqInteractive({ groups, lang = "de" }: { groups: FaqGroup[]; lang?: Language }) {
  const t = translations[lang].faq;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return groups
      .filter((group) => !activeCategory || group.category === activeCategory)
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!normalizedSearch) return true;
          return item.question.toLowerCase().includes(normalizedSearch) || item.answer.toLowerCase().includes(normalizedSearch);
        })
      }))
      .filter((group) => group.items.length > 0);
  }, [activeCategory, groups, search]);

  const totalResults = filteredGroups.reduce((sum, group) => sum + group.items.length, 0);

  function toggleItem(key: string) {
    setOpenItems((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <>
      <section className="pb-8">
        <div className="container-wide">
          <div className="mx-auto mb-12 max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.search}
                className="w-full rounded-full border border-border bg-card py-3.5 pl-12 pr-4 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex justify-center px-0">
            <div className="no-scrollbar inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-border bg-secondary/40 p-1.5 backdrop-blur-sm">
              <button
                onClick={() => setActiveCategory(null)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                  !activeCategory ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                }`}
                type="button"
              >
                {t.all}
              </button>
              {groups.map((group) => (
                <button
                  key={group.category}
                  onClick={() => setActiveCategory(activeCategory === group.category ? null : group.category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                    activeCategory === group.category ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                  }`}
                  type="button"
                >
                  {group.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-wide max-w-7xl">
          {search ? (
            <p className="mb-6 text-sm text-muted-foreground">
              {totalResults} {totalResults === 1 ? t.result : t.results} {t.for} <span>&bdquo;{search}&ldquo;</span>
            </p>
          ) : null}

          {filteredGroups.length ? (
            <div className="space-y-10">
              {filteredGroups.map((group) => (
                <section key={group.category}>
                  <h2 className="mb-1 flex items-center gap-3 text-xl font-bold text-foreground">
                    <span className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-accent" />
                    {group.category}
                  </h2>
                  <p className="mb-4 ml-4 text-sm text-muted-foreground">
                    {group.items.length} {group.items.length === 1 ? t.question : t.questions}
                  </p>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    {group.items.map((item, index) => {
                      const key = `${group.category}-${index}`;
                      const isOpen = openItems.has(key);
                      return (
                        <div className="border-b border-border last:border-b-0" key={key}>
                          <button onClick={() => toggleItem(key)} className="group flex w-full items-center justify-between px-1 py-5 text-left" type="button">
                            <span className="pr-4 text-base font-medium text-foreground transition-colors group-hover:text-primary">{item.question}</span>
                            <ChevronDown className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[2000px] pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                            <div className="whitespace-pre-line px-1 text-[15px] leading-relaxed text-muted-foreground">{item.answer}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">{t.noResults}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
