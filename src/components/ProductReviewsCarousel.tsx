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

export function ProductReviewsCarousel({ reviews, profileUrl, lang }: { reviews: GoogleReview[]; profileUrl: string; lang: Language }) {
  const t = copy[lang];
  const id = useId();
  const track = useRef<HTMLUListElement>(null);
  const [controls, setControls] = useState({ previous: false, next: reviews.length > 4 });
  const dateFormat = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

  function updateControls() {
    const element = track.current;
    if (!element) return;
    const previous = element.scrollLeft > 2;
    const next = element.scrollLeft + element.clientWidth < element.scrollWidth - 2;
    setControls((current) => current.previous === previous && current.next === next ? current : { previous, next });
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

  return (
    <section aria-labelledby={`${id}-heading`} className="container-wide mb-16 md:mb-20" data-product-reviews>
      <div className="relative isolate overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-secondary/60 to-primary/20 px-5 py-8 sm:px-7 md:px-8 md:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
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
        <ul aria-label={t.eyebrow} className="grid snap-x snap-mandatory auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto rounded-2xl pb-2 [scrollbar-width:none] sm:auto-cols-[calc((100%-1rem)/2)] lg:auto-cols-[calc((100%-3rem)/4)] [&::-webkit-scrollbar]:hidden" id={`${id}-track`} onScroll={updateControls} ref={track} tabIndex={0}>
          {reviews.map((review) => (
            <li className="flex min-w-0 snap-start flex-col rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm" key={review.id}>
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
              <blockquote className="mt-2 line-clamp-4 text-sm leading-relaxed text-foreground/85">{review.text}</blockquote>
              <a className="mt-auto inline-flex w-fit items-center gap-1 pt-3 text-xs font-semibold text-primary underline-offset-4 hover:underline" href={review.href} rel="noopener noreferrer" target="_blank">
                {t.read}<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
