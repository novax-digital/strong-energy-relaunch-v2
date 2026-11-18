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
  const orderedPosts = useMemo(() => {
    const postTimestamp = (post: BlogPost) => new Date(post.published_at || post.created_at || 0).getTime();
    const [newest, ...remaining] = [...livePosts].sort((a, b) => postTimestamp(b) - postTimestamp(a));
    if (!newest) return [];

    remaining.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return postTimestamp(b) - postTimestamp(a);
    });

    return [newest, ...remaining];
  }, [livePosts]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orderedPosts.filter((post) => {
      if (activeCategory !== t.all && post.category !== activeCategory) return false;
      if (!query) return true;
      return [post.title, post.excerpt || "", post.content || ""].some((value) => value.toLowerCase().includes(query));
    });
  }, [activeCategory, orderedPosts, search, t.all]);

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

        {filtered.length ? (
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, index) => (
              <Link href={localizedPath(`/blog/${post.slug}`, lang)} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl" key={post.id}>
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <Image
                    src={post.local_cover_image_url || post.cover_image_url || "/assets/alfred-02-C1Z1mvvG.webp"}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {index === 0 && post.is_featured ? (
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{t.featured}</span>
                      {post.category ? <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">{post.category}</span> : null}
                    </div>
                  ) : post.category ? (
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">{post.category}</p>
                  ) : null}
                  <h2 className="mb-3 text-xl font-bold leading-tight text-foreground">{post.title}</h2>
                  {post.excerpt ? <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p> : null}
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs font-medium text-muted-foreground">
                    <BlogAuthorInline author={post.author} />
                    {index === 0 && post.published_at ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.published_at, lang)}
                      </span>
                    ) : null}
                    <span className="ml-auto inline-flex shrink-0 items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.reading_time_minutes || 1} {t.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {!filtered.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center text-muted-foreground">
            {t.noPosts}
          </div>
        ) : null}
      </div>
    </section>
  );
}
