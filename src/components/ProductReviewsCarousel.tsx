"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { GoogleReview } from "@/lib/content/getGoogleReviews";
import type { Language } from "@/lib/i18n";

const copy = {
  de: {
    eyebrow: "Google-Bewertungen",
    title: "Das sagen unsere Kunden",
    description: "Erfahrungen mit Strong Energy – direkt von unseren Kunden auf Google.",
    profile: "Alle Bewertungen auf Google",
    read: "Mehr lesen",
    previous: "Vorherige Bewertungen",
    next: "Weitere Bewertungen",
    rating: "von 5 Sternen"
  },
  en: {
    eyebrow: "Google reviews",
    title: "What our customers say",
    description: "Customer experiences with Strong Energy, shared on Google in their original language.",
    profile: "All reviews on Google",
    read: "Read more",
    previous: "Previous reviews",
    next: "More reviews",
    rating: "out of 5 stars"
  }
};

export function ProductReviewsCarousel({ reviews, profileUrl, lang, variant = "product" }: { reviews: GoogleReview[]; profileUrl: string; lang: Language; variant?: "product" | "hero" }) {
  const hero = variant === "hero";
  const t = copy[lang];
  const id = useId();
  const track = useRef<HTMLUListElement>(null);
  const [controls, setControls] = useState({ previous: false, next: reviews.length > 4, page: 0 });
  const dateFormat = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

  function updateControls() {
    const element = track.current;
    if (!element) return;
    const previous = element.scrollLeft > 2;
    const next = element.scrollLeft + element.clientWidth < element.scrollWidth - 2;
    const page = Math.round(element.scrollLeft / (element.clientWidth + 16));
    setControls((current) => current.previous === previous && current.next === next && current.page === page ? current : { previous, next, page });
  }

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(updateControls);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * (element.clientWidth + 16), behavior: reducedMotion ? "instant" : "smooth" });
  }

  const reviewTrack = (
    <ul aria-label={t.eyebrow} className={`grid snap-x snap-mandatory auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto rounded-2xl pb-2 [scrollbar-width:none] sm:auto-cols-[calc((100%-1rem)/2)] ${hero ? "md:auto-cols-[calc((100%-3rem)/4)] text-left" : "lg:auto-cols-[calc((100%-3rem)/4)]"} [&::-webkit-scrollbar]:hidden`} id={`${id}-track`} onScroll={updateControls} ref={track} tabIndex={0}>
      {reviews.map((review) => (
        <li className={`flex min-w-0 snap-start flex-col border ${hero ? "h-[234px] rounded-lg border-white/70 bg-white/90 p-[18px]" : "rounded-2xl border-border/50 bg-white p-5"}`} key={review.id}>
          <div className="flex min-w-0 items-center gap-2.5">
            <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">{review.author.trim().charAt(0).toUpperCase()}</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground" title={review.author}>{review.author}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {review.publishedAt ? <><time dateTime={new Date(review.publishedAt * 1000).toISOString()}>{dateFormat.format(review.publishedAt * 1000)}</time><span aria-hidden="true"> · </span></> : null}
                <span className="font-medium text-primary">Google</span>
              </p>
            </div>
          </div>
          <div aria-label={`${review.rating} ${t.rating}`} className="mt-4 flex gap-0.5 text-amber-500" role="img">
            {Array.from({ length: 5 }, (_, index) => <Star aria-hidden="true" className={`h-4 w-4 ${index < Math.round(review.rating) ? "fill-current" : "text-slate-300"}`} key={index} />)}
          </div>
          <blockquote className={hero ? "mt-2 line-clamp-5 text-[13px] leading-[1.4] text-foreground/90" : "mt-2 line-clamp-4 text-sm leading-relaxed text-foreground/85"}>{review.text}</blockquote>
          <a className="mt-auto inline-flex w-fit items-center gap-1 pt-3 text-xs font-semibold text-primary underline-offset-4 hover:underline" href={review.href} rel="noopener noreferrer" target="_blank">
            {t.read}<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </li>
      ))}
    </ul>
  );

  if (hero) {
    return (
      <section aria-label={t.eyebrow} id="rezensionen-desktop" className="relative mx-auto mt-40 hidden w-full max-w-[1088px] px-8 md:block" data-home-reviews>
        {reviewTrack}
        <button aria-controls={`${id}-track`} aria-label={t.previous} className="absolute left-4 top-[107px] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-foreground shadow-sm transition-colors hover:bg-white disabled:opacity-40" disabled={!controls.previous} onClick={() => move(-1)} type="button">
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button aria-controls={`${id}-track`} aria-label={t.next} className="absolute right-4 top-[107px] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-foreground shadow-sm transition-colors hover:bg-white disabled:opacity-40" disabled={!controls.next} onClick={() => move(1)} type="button">
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
          {Array.from({ length: Math.ceil(reviews.length / 4) }, (_, page) => <span key={page} className={`h-1.5 w-1.5 rounded-full ${page === controls.page ? "bg-white" : "bg-white/40"}`} />)}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={`${id}-heading`} className="container-wide mb-16 md:mb-20" data-product-reviews>
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/60 px-5 py-8 sm:px-7 md:px-8 md:py-10">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{t.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-foreground md:text-3xl" id={`${id}-heading`}>{t.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
          </div>
          <div className="flex items-center justify-between gap-4 lg:shrink-0">
            <a className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline" href={profileUrl} rel="noopener noreferrer" target="_blank">
              {t.profile}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </a>
            <div className="flex shrink-0 gap-2">
              <button aria-controls={`${id}-track`} aria-label={t.previous} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/80 text-foreground shadow-sm transition-colors hover:bg-white disabled:cursor-default disabled:opacity-40" disabled={!controls.previous} onClick={() => move(-1)} type="button">
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <button aria-controls={`${id}-track`} aria-label={t.next} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/80 text-foreground shadow-sm transition-colors hover:bg-white disabled:cursor-default disabled:opacity-40" disabled={!controls.next} onClick={() => move(1)} type="button">
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        {reviewTrack}
      </div>
    </section>
  );
}
