"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Battery, CheckCircle2, ChevronDown, Clock, HeadphonesIcon, Link as LinkIcon, Shield, X, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ContactForm } from "@/components/ContactForm";
import { HubSpotCtaModal } from "@/components/HubSpotCtaModal";
import { products } from "@/content/products";
import type { ProductHighlight } from "@/types/content";

const ICON_MAP = {
  Shield,
  Zap,
  Battery,
  Clock,
  Link: LinkIcon,
  HeadphonesIcon
} as const;

type ProductFeatureSection = {
  slug: string;
  categorySlug: string;
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  images: string[];
  stats: { label: string; value: string }[];
  highlights: ProductHighlight[];
  align?: "left" | "right";
};

type CommercialLandingProps = {
  variant?: "form" | "hubspot";
};

function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up"
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const hidden =
    direction === "left"
      ? "opacity-0 -translate-x-10"
      : direction === "right"
        ? "opacity-0 translate-x-10"
        : direction === "scale"
          ? "opacity-0 scale-95"
          : "opacity-0 translate-y-10";
  const shown = direction === "scale" ? "opacity-100 scale-100" : "opacity-100 translate-x-0 translate-y-0";

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-1000 ease-out will-change-transform ${visible ? shown : hidden} ${className}`}>
      {children}
    </div>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const page = document.documentElement;
      const max = page.scrollHeight - page.clientHeight;
      setProgress(max > 0 ? (page.scrollTop / max) * 100 : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[61] h-[3px] bg-transparent">
      <div className="h-full bg-gradient-to-r from-[#d7d42f] to-[#28a795] transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}

function BrandLines({ className = "" }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 h-full w-full pointer-events-none ${className}`} viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="commercial-brand-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d7d42f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#28a795" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="commercial-brand-line-soft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#28a795" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d7d42f" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path d="M-100 480 Q 360 80 760 220 T 1600 60" stroke="url(#commercial-brand-line)" strokeWidth="1.2" fill="none" />
      <path d="M-100 520 Q 320 140 720 260 T 1600 100" stroke="url(#commercial-brand-line-soft)" strokeWidth="1" fill="none" />
      <path d="M-100 560 Q 280 200 680 300 T 1600 160" stroke="url(#commercial-brand-line)" strokeWidth="0.8" fill="none" />
      <path d="M-100 420 Q 420 40 820 200 T 1600 20" stroke="url(#commercial-brand-line-soft)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function AnimatedHeadline({
  className = "",
  gradientWords,
  leadWords,
  tailWords
}: {
  className?: string;
  gradientWords: string[];
  leadWords: string[];
  tailWords?: string[];
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const words = [...leadWords, ...gradientWords];

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, index) => {
        const isGradient = index >= leadWords.length;
        return (
          <span key={`${word}-${index}`} className="inline-block align-baseline mr-[0.25em] pb-[0.15em]">
            <span
              style={{
                animation: visible ? `word-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${index * 90}ms both` : "none",
                opacity: visible ? undefined : 0,
                display: "inline-block",
                paddingBottom: "0.15em"
              }}
              className={isGradient ? "animate-gradient-sweep bg-gradient-to-r from-[#d7d42f] via-[#7bbf6e] to-[#28a795] bg-clip-text text-transparent" : ""}
            >
              {word}
            </span>
          </span>
        );
      })}
      {tailWords?.length ? (
        <span className="mt-[-0.25em] block">
          {tailWords.map((word, index) => {
            const delay = (words.length + index) * 90;
            return (
              <span key={`tail-${word}-${index}`} className="inline-block align-baseline mr-[0.25em] pb-[0.15em] text-foreground/45">
                <span
                  style={{
                    animation: visible ? `word-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both` : "none",
                    opacity: visible ? undefined : 0,
                    display: "inline-block",
                    paddingBottom: "0.15em"
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </span>
      ) : null}
    </h2>
  );
}

function CommercialProductGallery({ alt, eyebrow, images }: { alt: string; eyebrow: string; images: string[] }) {
  const [selected, setSelected] = useState(0);
  const safeImages = images.length ? images : ["/assets/gewerbespeicher-aio-kachel-YpXwZeiG.jpg"];

  return (
    <div className="space-y-4">
      <div className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-foreground/5 bg-gradient-to-br from-foreground/5 to-foreground/[0.02] shadow-2xl shadow-foreground/5 sm:aspect-[4/5] lg:aspect-square">
        <Image
          src={safeImages[selected]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/85 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#d7d42f] to-[#28a795]" />
          {eyebrow}
        </div>
      </div>
      {safeImages.length > 1 ? (
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setSelected(index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                selected === index ? "border-primary shadow-md" : "border-border hover:border-primary/40"
              }`}
              type="button"
            >
              <Image src={image} alt={`${alt} ${index + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function InquiryModal({
  onClose,
  productName,
  productSlug
}: {
  onClose: () => void;
  productName?: string;
  productSlug?: string;
}) {
  const defaultMessage = `Hallo Strong Energy Team,\n\nich interessiere mich für ${productName ?? "eine Gewerbespeicher Beratung"} und möchte ein konkretes Angebot besprechen.`;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative my-8 w-full max-w-3xl rounded-3xl bg-background shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white" onClick={onClose} aria-label="Schließen" type="button">
          <X className="h-5 w-5" />
        </button>
        <div className="h-1.5 rounded-t-3xl bg-gradient-to-r from-[#d7d42f] to-[#28a795]" />
        <div className="p-4 pt-10 sm:p-6 sm:pt-12">
          <ContactForm
            customerType="gewerbe"
            defaultMessage={defaultMessage}
            defaultTopic="Gewerbespeicher Beratung"
            intent="inquiry"
            productName={productName}
            productSlug={productSlug}
            submitLabel="Anfrage senden"
          />
        </div>
      </div>
    </div>
  );
}

export function CommercialLanding({ variant = "form" }: CommercialLandingProps) {
  const [formProduct, setFormProduct] = useState<{ name?: string; slug?: string }>({});
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showHubspot, setShowHubspot] = useState(false);

  const sections = useMemo<ProductFeatureSection[]>(() => {
    const starQ = products.find((product) => product.slug === "star-q");
    const starH = products.find((product) => product.slug === "star-h");

    return [
      starQ
        ? {
            slug: "star-q",
            categorySlug: starQ.categorySlug,
            eyebrow: "All-in-One · 50 kW",
            name: starQ.name,
            tagline: "Kompakt. Skalierbar. Outdoor-ready.",
            description:
              "Das Komplettsystem mit integriertem Hybrid-Wechselrichter, CATL LFP-Zellen und integriertem Feuerlöschsystem. Skalierbar bis 6 Systeme. Schwarzstartfähig.",
            images: starQ.images,
            stats: [
              { label: "Leistung", value: "50 kW" },
              { label: "Kapazität", value: "109,7 kWh" },
              { label: "Skalierbar", value: "x 6" },
              { label: "Garantie", value: "bis 10 J." }
            ],
            highlights: starQ.highlights.slice(0, 4),
            align: "left"
          }
        : null,
      starH
        ? {
            slug: "star-h",
            categorySlug: starH.categorySlug,
            eyebrow: "All-in-One · 115 kW",
            name: starH.name,
            tagline: "Mehr Power. Mehr Speicher. Industriellevel.",
            description:
              "Hochleistungs-Komplettsystem mit YUNT MARS Wechselrichter. CATL 280 Ah Module, integriertes Feuerlöschsystem, Outdoor-fähig. Skalierbar bis 12 Systeme.",
            images: starH.images,
            stats: [
              { label: "Leistung", value: "115 kW" },
              { label: "Kapazität", value: "232,5 kWh" },
              { label: "Skalierbar", value: "x 12" },
              { label: "Temp.", value: "-40 / +60°C" }
            ],
            highlights: starH.highlights.slice(0, 4),
            align: "right"
          }
        : null
    ].filter(Boolean) as ProductFeatureSection[];
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroFade = Math.max(0, 1 - scrollY / 500);
  const openForm = (name?: string, slug?: string) => {
    setFormProduct({
      name: name ?? "Gewerbespeicher Beratung",
      slug: slug ?? "gewerbespeicher-beratung"
    });
    if (variant === "hubspot") {
      setShowHubspot(true);
    } else {
      setShowForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />

      <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden bg-background pb-16 pt-28 sm:min-h-[80svh] sm:pt-24">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/gewerbespeicher_v3_poster.jpg"
          onCanPlay={() => setHeroVideoReady(true)}
          onPlaying={() => setHeroVideoReady(true)}
          className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700 will-change-transform ${heroVideoReady ? "opacity-100" : "opacity-0"}`}
          style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(${1 + scrollY * 0.0003})` }}
        >
          <source src="/videos/gewerbespeicher_v3.webm" type="video/webm" />
          <source src="/videos/gewerbespeicher_v3.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-0 h-full w-full bg-cover bg-center transition-opacity duration-700 ${heroVideoReady ? "opacity-0" : "opacity-100"}`}
          style={{
            backgroundImage: "url('/videos/gewerbespeicher_v3_poster.jpg')",
            transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(${1 + scrollY * 0.0003})`
          }}
        />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/35 to-black/55" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-black/55 via-black/25 to-transparent" />
        <BrandLines className="z-[2] opacity-70" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center will-change-transform sm:px-8" style={{ opacity: heroFade, transform: `translate3d(0, ${scrollY * -0.15}px, 0)` }}>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/85 backdrop-blur sm:text-xs">
              <span className="h-1 w-1 rounded-full bg-gradient-to-r from-[#d7d42f] to-[#28a795]" />
              All-In-One Gewerbespeicher
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-5 break-words text-[1.75rem] font-bold leading-[1.15] tracking-tight text-white drop-shadow-lg sm:text-4xl sm:leading-[1] md:text-5xl lg:text-[3.75rem]">
              Ganzheitliche Systemlösungen
              <br className="hidden sm:block" />{" "}
              <span className="bg-gradient-to-r from-[#d7d42f] to-[#28a795] bg-clip-text text-transparent">mit deutschem Experten-Support</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mx-auto mt-5 max-w-xl px-2 text-sm leading-relaxed text-white drop-shadow sm:px-0 sm:text-base">
              Von 50 kW bis 232 kWh. Kompakte All-in-One Systeme mit CATL Zellen.
              <br className="hidden sm:block" /> Integriertes Feuerlöschsystem, bis zu 10 Jahren Garantie. Direkt verfügbar.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-7 flex flex-col items-center justify-center gap-3">
              <button
                onClick={() => openForm()}
                className="btn-gradient inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide shadow-lg shadow-[#28a795]/20 transition-all hover:scale-[1.02] hover:shadow-xl sm:px-10 sm:py-4 sm:text-lg"
                type="button"
              >
                Beratungstermin buchen <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => document.getElementById("product-star-q")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
                type="button"
              >
                Produkte entdecken <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
          <Reveal delay={500}>
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/15 bg-white/5 backdrop-blur sm:grid-cols-4">
              {[
                { value: "50 - 115 kW", label: "Leistungsklasse" },
                { value: "CATL LFP", label: "Premium-Zellen" },
                { value: "10 Jahre", label: "Garantie möglich" },
                { value: "Outdoor", label: "IP54 - IP67" }
              ].map((stat) => (
                <div key={stat.label} className="min-w-0 bg-black/35 px-3 py-2.5 backdrop-blur sm:py-3.5">
                  <div className="break-words text-xs font-bold text-white sm:text-base">{stat.value}</div>
                  <div className="mt-0.5 break-words text-[9px] uppercase tracking-wider text-white/60 sm:text-[10px]">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-14 sm:px-8 sm:py-20">
        <BrandLines className="opacity-60" />
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">Zwei Systeme</p>
          </Reveal>
          <AnimatedHeadline
            className="mt-4 pb-2 text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl"
            leadWords={["Zuverlässig", "autark"]}
            gradientWords={["Strom", "erzeugen."]}
            tailWords={["Auch", "in", "Krisenzeiten."]}
          />
          <Reveal delay={120}>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                "Lieferzeit 3-7 Tage",
                "Ohne komplizierte Anmeldeverfahren",
                "Exklusive Garantiebedingungen",
                "Zuverlässige Projektbegleitung",
                "Offizieller Vertriebspartner von CNTE & CATL",
                "Unschlagbares Preispaket"
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-background px-5 py-4">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d7d42f] to-[#28a795]">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-base font-medium leading-snug text-foreground sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {sections.map((section, index) => (
        <section
          key={section.slug}
          id={`product-${section.slug}`}
          className={`relative overflow-hidden px-6 py-24 sm:px-8 sm:py-32 ${index % 2 === 0 ? "bg-background" : "bg-gradient-to-b from-background via-secondary/40 to-background"}`}
        >
          <div className="mx-auto max-w-7xl">
            <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${section.align === "right" ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <Reveal direction={section.align === "right" ? "right" : "left"}>
                <CommercialProductGallery images={section.images} alt={section.name} eyebrow={section.eyebrow} />
              </Reveal>

              <div>
                <Reveal delay={100} direction={section.align === "right" ? "left" : "right"}>
                  <h2 className="text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl">{section.name}</h2>
                </Reveal>
                <Reveal delay={180}>
                  <p className="mt-4 bg-gradient-to-r from-[#d7d42f] to-[#28a795] bg-clip-text text-xl font-medium text-transparent sm:text-2xl">{section.tagline}</p>
                </Reveal>
                <Reveal delay={260}>
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">{section.description}</p>
                </Reveal>

                <Reveal delay={340}>
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {section.stats.map((stat) => (
                      <div key={stat.label} className="rounded-2xl border border-foreground/10 bg-background px-4 py-4">
                        <div className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{stat.value}</div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={420}>
                  <ul className="mt-8 space-y-3">
                    {section.highlights.map((highlight) => {
                      const Icon = ICON_MAP[highlight.icon as keyof typeof ICON_MAP] || CheckCircle2;
                      return (
                        <li key={highlight.title} className="flex items-start gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d7d42f]/20 to-[#28a795]/20">
                            <Icon className="h-4 w-4 text-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground sm:text-base">{highlight.title}</p>
                            <p className="break-words text-xs leading-relaxed text-muted-foreground sm:text-sm">{highlight.text}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>

                <Reveal delay={500}>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <button
                      onClick={() => openForm(section.name, section.slug)}
                      className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl sm:text-base"
                      type="button"
                    >
                      {section.name} anfragen <ArrowRight className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/de/produkte/${section.categorySlug}/${section.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 sm:text-base"
                    >
                      Details
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="relative overflow-hidden bg-background px-6 py-24 sm:px-8 sm:py-32">
        <BrandLines className="opacity-50" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">Vergleich</p>
            <h2 className="mt-4 text-center text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">Welches System passt zu Ihrem Projekt?</h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="no-scrollbar mt-12 overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="py-4 pr-4 text-left font-medium text-muted-foreground" />
                    {["Star Q", "Star H"].map((name) => (
                      <th key={name} className="px-3 py-4 text-left font-bold text-foreground">
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  {[
                    ["Leistung", "50 kW", "115 kW"],
                    ["Kapazität", "109,7 kWh", "232,5 kWh"],
                    ["Bauform", "All-in-One", "All-in-One"],
                    ["Zellen", "CATL 306 Ah", "CATL 280 Ah"],
                    ["Skalierung", "bis 6 Systeme", "bis 12 Systeme"],
                    ["Schutz", "IP66 / IP67", "IP54 / IP65"]
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-foreground/5">
                      <td className="py-4 pr-4 font-medium text-muted-foreground">{row[0]}</td>
                      {row.slice(1).map((value, valueIndex) => (
                        <td key={`${row[0]}-${valueIndex}`} className="px-3 py-4">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-to-b from-background via-secondary/40 to-background px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "CNTE & CATL Vertriebspartner",
              text: "Offizieller Partner in Europa mit direktem Zugang zu Premium-Speichertechnologie."
            },
            {
              title: "Integriertes Sicherheitskonzept",
              text: "Rauchdetektor, Gasdetektor, Aerosol-Löschsystem bei jedem System ab Werk."
            },
            {
              title: "Bis 10 Jahre Garantie",
              text: "3 Jahre Standardgarantie, erweiterbar auf bis zu 10 Jahre. Deutschsprachiger Support."
            },
            {
              title: "Made for Outdoor",
              text: "IP54 bis IP67. Betrieb von -40 °C bis +60 °C und bereit für jeden Standort."
            }
          ].map((card, index) => (
            <Reveal key={card.title} delay={index * 100}>
              <div className="h-full rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#d7d42f] to-[#28a795]">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg">{card.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="anfrage" className="relative overflow-hidden bg-background px-6 py-28 sm:px-8 sm:py-40">
        <BrandLines className="opacity-70" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">Bereit für Ihr Projekt?</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 whitespace-nowrap text-3xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Lassen Sie uns{" "}
              <span className="bg-gradient-to-r from-[#d7d42f] to-[#28a795] bg-clip-text text-transparent">rechnen.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-7 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Sagen Sie uns kurz, was Sie vorhaben: Leistung, Speicher, Zeitrahmen. Wir erstellen Ihnen ein konkretes Angebot.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => openForm()}
                className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-10 py-5 text-lg font-semibold uppercase tracking-wide shadow-2xl shadow-[#28a795]/30 transition-all hover:scale-[1.02]"
                type="button"
              >
                Beratungstermin buchen <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground sm:text-sm">Schnelle Antwort · Direkt vom Hersteller · Deutschsprachiger Support</p>
          </Reveal>
        </div>
      </section>

      <div className="pointer-events-none fixed bottom-3 left-1/2 z-40 -translate-x-1/2 sm:hidden">
        <button
          onClick={() => openForm()}
          className="btn-gradient pointer-events-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide shadow-2xl shadow-[#28a795]/40"
          type="button"
        >
          Beratungstermin buchen <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {showForm ? <InquiryModal productName={formProduct.name} productSlug={formProduct.slug} onClose={() => setShowForm(false)} /> : null}
      {showHubspot ? <HubSpotCtaModal productName={formProduct.name} onClose={() => setShowHubspot(false)} /> : null}
    </div>
  );
}
