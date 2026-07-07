"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogAuthorInline } from "@/components/BlogAuthorInline";
import { useLiveBlogPosts } from "@/hooks/useLiveBlogPosts";
import type { BlogPost } from "@/types/content";
import { localizedPath, translations, type Language } from "@/lib/i18n";

function formatDate(date: string | null, lang: Language) {
  if (!date) return "";
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export function BlogListing({ posts, lang = "de" }: { posts: BlogPost[]; lang?: Language }) {
  const t = translations[lang].blog;
  const livePosts = useLiveBlogPosts(posts, lang);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(t.all);
  const categories = useMemo(() => [...new Set([...t.categories, ...(livePosts.map((post) => post.category).filter(Boolean) as string[])])], [livePosts, t.categories]);
  const orderedPosts = useMemo(
    () =>
      [...livePosts].sort((a, b) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        return new Date(b.published_at || b.created_at || 0).getTime() - new Date(a.published_at || a.created_at || 0).getTime();
      }),
    [livePosts]
  );
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orderedPosts.filter((post) => {
      if (activeCategory !== t.all && post.category !== activeCategory) return false;
      if (!query) return true;
      return [post.title, post.excerpt || "", post.content || ""].some((value) => value.toLowerCase().includes(query));
    });
  }, [activeCategory, orderedPosts, search, t.all]);

  const [featured, ...rest] = filtered;

  return (
    <section className="pb-20 md:pb-28">
      <div className="container-wide">
        <div className="mx-auto mb-16 max-w-3xl">
          <div className="relative mx-auto max-w-lg">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search}
              className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary"
                }`}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {featured ? (
          <Link href={localizedPath(`/blog/${featured.slug}`, lang)} className="group mb-12 grid overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl lg:grid-cols-2">
            <div className="relative min-h-[320px] overflow-hidden bg-secondary">
              <Image
                src={featured.local_cover_image_url || featured.cover_image_url || "/assets/alfred-02-C1Z1mvvG.webp"}
                alt={featured.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">{t.featured}</span>
                {featured.category ? <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{featured.category}</span> : null}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight text-foreground">{featured.title}</h2>
              {featured.excerpt ? <p className="mt-5 text-base leading-relaxed text-muted-foreground">{featured.excerpt}</p> : null}
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <BlogAuthorInline author={featured.author} />
                {featured.published_at ? <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(featured.published_at, lang)}</span> : null}
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {featured.reading_time_minutes || 1} {t.readTime}</span>
              </div>
            </div>
          </Link>
        ) : null}

        {rest.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link href={localizedPath(`/blog/${post.slug}`, lang)} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl" key={post.id}>
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <Image
                    src={post.local_cover_image_url || post.cover_image_url || "/assets/alfred-02-C1Z1mvvG.webp"}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  {post.category ? <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">{post.category}</p> : null}
                  <h2 className="mb-3 text-xl font-bold leading-tight text-foreground">{post.title}</h2>
                  {post.excerpt ? <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p> : null}
                  <div className="mt-5 flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
                    <BlogAuthorInline author={post.author} />
                    <span className="shrink-0">{post.reading_time_minutes || 1} {t.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {!featured ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center text-muted-foreground">
            {t.noPosts}
          </div>
        ) : null}
      </div>
    </section>
  );
}
