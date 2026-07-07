"use client";

import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ContactLiveForm } from "@/components/ContactLiveForm";
import { site } from "@/content/site";
import { translations, type Language } from "@/lib/i18n";

type ContactProduct = {
  name: string;
  slug: string;
};

export function ContactPageInteractive({ lang = "de", products }: { lang?: Language; products: ContactProduct[] }) {
  const searchParams = useSearchParams();
  const t = translations[lang].contact;
  const productQuery = searchParams.get("produkt")?.trim();
  const product = productQuery ? products.find((item) => item.slug === productQuery || item.name.toLowerCase() === productQuery.toLowerCase()) : undefined;
  const productName = product?.name ?? productQuery;
  const hours = lang === "en" ? ["Mon-Thu: 8:00-17:00", "Fri: 8:00-15:30"] : ["Mo-Do: 8:00-17:00 Uhr", "Fr: 8:00-15:30 Uhr"];

  return (
    <section className="pb-20 pt-32">
      <div className="container-wide">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            {productName ? `${productName} ${t.inquiryTitleSuffix}` : t.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{productName ? t.inquirySubtitle : t.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-3">
          <aside className="space-y-8">
            <div>
              <h2 className="mb-6 text-xl font-bold text-foreground">{t.howToReach}</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-primary/10 p-2.5">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">{site.legalName}</p>
                    <p>{site.address.street}</p>
                    <p>{site.address.postalCode} {site.address.city}, {t.country}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-primary/10 p-2.5">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <a href={site.phoneHref} className="font-semibold text-foreground transition-smooth hover:text-primary">{site.phone}</a>
                    <p className="text-xs">{t.tollFree}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-primary/10 p-2.5">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {hours.map((line) => <p key={line}>{line}</p>)}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-primary/10 p-2.5">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm">
                    <a href={`mailto:${site.email}`} className="text-foreground transition-smooth hover:text-primary">{site.email}</a>
                  </div>
                </div>
              </div>
              <div className="relative mt-8 h-48 overflow-hidden rounded-2xl">
                <Image src="/assets/kontakt-hero-BGf2Dxw2.jpg" alt="Strong Energy" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover object-top" />
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <ContactLiveForm productName={productName || undefined} productSlug={product?.slug} lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}
