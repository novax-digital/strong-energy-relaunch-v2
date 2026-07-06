import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import type { Product } from "@/types/content";
import { localizedPath, translations, type Language } from "@/lib/i18n";

export function ProductDetailHero({ product, lang = "de" }: { product: Product; lang?: Language }) {
  const image = product.heroImage || product.images[0];
  const t = translations[lang].products;
  return (
    <section className="relative h-[65vh] md:h-[65vh] w-full overflow-hidden bg-black">
      {product.heroVideoWebm ? (
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline preload="metadata" poster={image}>
          <source src={product.heroVideoWebm} type="video/webm" />
          {product.heroVideo ? <source src={product.heroVideo} type="video/mp4" /> : null}
        </video>
      ) : (
        <Image src={image} alt={product.name} fill priority sizes="100vw" className="object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />
      <div className="absolute inset-0 z-10 flex items-center justify-center text-center pt-[40%] md:pt-28">
        <div className="container-wide">
          <span className="inline-block text-xs md:text-sm font-semibold text-white/90 uppercase tracking-[0.2em] md:tracking-[0.25em] mb-2 md:mb-3 drop-shadow-lg">
            {product.category}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white leading-[0.95] tracking-normal drop-shadow-2xl">
            {product.name}
          </h1>
          <p className="text-sm md:text-xl text-white/80 mt-3 md:mt-4 max-w-xl mx-auto drop-shadow-lg">{product.subtitle}</p>
          {product.tagline ? <p className="text-xs md:text-base text-white/60 mt-1 md:mt-2 max-w-xl mx-auto drop-shadow-lg">{product.tagline}</p> : null}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-3 mt-5 md:mt-8">
            <Link href={`${localizedPath("/kontakt", lang)}?produkt=${encodeURIComponent(product.slug)}`} className="btn-gradient px-6 py-3 md:px-6 md:py-3 rounded-full text-sm md:text-base font-semibold shadow-2xl">
              {t.inquireNow}
            </Link>
            <a href="#beschreibung" className="flex items-center justify-center gap-1.5 md:gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-base font-medium text-white border-2 border-white/25 hover:border-white/50 hover:bg-white/10 transition-all backdrop-blur-sm">
              {t.learnMore}
              <ArrowDown className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
