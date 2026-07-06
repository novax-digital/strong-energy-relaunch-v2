import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Activity, ArrowLeft, ArrowRight, Award, Battery, Building2, Factory, Globe, GraduationCap, HandHeart, Headphones, Mail, Network, Newspaper, Settings, Shield, ShieldCheck, Users, Zap } from "lucide-react";
import { AppPhoneSlider } from "@/components/AppPhoneSlider";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { BlogListing } from "@/components/BlogListing";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactLiveForm } from "@/components/ContactLiveForm";
import { DownloadsInteractive } from "@/components/DownloadsInteractive";
import { FaqInteractive } from "@/components/FaqInteractive";
import { HomeHero, PageHero } from "@/components/Hero";
import { MediaGallery } from "@/components/MediaGallery";
import { PartnerGrid } from "@/components/PartnerGrid";
import { ProductDetailHero } from "@/components/ProductDetailHero";
import { ProductDetailTabs } from "@/components/ProductDetailTabs";
import { ProductFeatureIcon } from "@/components/ProductFeatureIcon";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductTabsGrid } from "@/components/ProductTabsGrid";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { faqGroups } from "@/content/faq";
import { legalPages } from "@/content/legal";
import { partners } from "@/content/partners";
import { pageSeo, site } from "@/content/site";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content/getBlogPosts";
import { getDownloads, getDownloadsByProduct } from "@/lib/content/getDownloads";
import { getMediaCategories, getMediaItems } from "@/lib/content/getMediaItems";
import { getProductByPath } from "@/lib/content/getProductBySlug";
import { getProductCategories, getProducts } from "@/lib/content/getProducts";
import { localizeLegalSlug, localizedPath, normalizeLegalSlug, reverseCategorySlug, translations } from "@/lib/i18n";
import { absoluteUrl, breadcrumbJsonLd, createMetadata } from "@/lib/seo";

const lang = "en" as const;
const t = translations.en;

type EnglishPageProps = {
  params: Promise<{ segments?: string[] }>;
  searchParams?: Promise<{ produkt?: string | string[] }>;
};

const seo: Record<string, Metadata> = {
  home: createMetadata({
    ...pageSeo.home,
    title: "Strong Energy - Solar & Energy Storage for Residential and Commercial Use",
    description: "High-quality solar systems, home and commercial storage, and mobile energy solutions. Official distribution partner for CNTE and CATL in Europe.",
    path: "/en"
  }),
  products: createMetadata({
    ...pageSeo.products,
    title: "Products - Solar, Storage & Mobile Charging | Strong Energy",
    description: "Discover solar systems, all-in-one commercial storage and mobile energy solutions from Strong Energy.",
    path: "/en/products"
  }),
  blog: createMetadata({
    ...pageSeo.blog,
    title: "Blog - News, Tips & Knowledge | Strong Energy",
    description: "Current energy tips, product news and knowledge from Strong Energy.",
    path: "/en/blog"
  }),
  downloads: createMetadata({
    ...pageSeo.downloads,
    title: "Downloads - Datasheets, Manuals & Certificates | Strong Energy",
    description: "Datasheets, installation manuals, brochures, certificates and warranty terms for Strong Energy products.",
    path: "/en/downloads"
  }),
  media: createMetadata({
    ...pageSeo.media,
    title: "Media Gallery - Product Images, Photos & Videos | Strong Energy",
    description: "Browse product images, installation photos and videos for solar systems and energy storage.",
    path: "/en/media"
  }),
  contact: createMetadata({
    ...pageSeo.contact,
    title: "Contact | Strong Energy",
    description: "Contact Strong Energy for advice on solar systems, energy storage and mobile energy solutions.",
    path: "/en/contact"
  }),
  faq: createMetadata({
    ...pageSeo.faq,
    title: "FAQ - Frequently Asked Questions | Strong Energy",
    description: "Answers about Strong Energy products, downloads, installation, solar batteries and solar PV systems.",
    path: "/en/faq"
  }),
  partner: createMetadata({
    ...pageSeo.partner,
    title: "Partners | Strong Energy",
    description: "Together for a sustainable energy future: discover the Strong Energy partner network.",
    path: "/en/partners"
  }),
  about: createMetadata({
    ...pageSeo.about,
    title: "About Us | Strong Energy",
    description: "Strong Energy develops innovative renewable energy solutions and is part of the European Strong Group.",
    path: "/en/about-us"
  }),
  app: createMetadata({
    ...pageSeo.app,
    title: "Strong Energy 360 App",
    description: "The Strong Energy 360 App provides real-time monitoring and management for inverters, energy storage and accessories.",
    path: "/en/360-app"
  })
};

const legalTitles: Record<string, string> = {
  impressum: "Legal Notice",
  datenschutz: "Privacy Policy",
  agb: "Terms & Conditions",
  garantiebedingungen: "Warranty",
  "rechtliche-hinweise": "Legal Information",
  gpsr: "GPSR",
  "cookie-richtlinie": "Cookie Policy"
};

export function generateStaticParams() {
  const categories = getProductCategories(lang);
  const products = getProducts(lang);
  return [
    { segments: [] },
    { segments: ["products"] },
    ...categories.map((category) => ({ segments: ["products", category.slug] })),
    ...products.map((product) => ({ segments: ["products", product.categorySlug, product.slug] })),
    { segments: ["blog"] },
    ...getBlogPosts(lang).map((post) => ({ segments: ["blog", post.slug] })),
    { segments: ["downloads"] },
    { segments: ["media"] },
    { segments: ["contact"] },
    { segments: ["faq"] },
    { segments: ["partners"] },
    { segments: ["about-us"] },
    { segments: ["360-app"] },
    ...legalPages.map((page) => ({ segments: [localizeLegalSlug(page.slug, lang)] }))
  ];
}

export async function generateMetadata({ params }: EnglishPageProps): Promise<Metadata> {
  const { segments = [] } = await params;
  const [section, second, third] = segments;

  if (!section) return seo.home;
  if (section === "products" && !second) return seo.products;
  if (section === "products" && second && !third) {
    const category = getProductCategories(lang).find((item) => item.slug === second);
    if (!category) return {};
    return createMetadata({
      title: `${category.label_en} | Strong Energy`,
      description: `Products in the ${category.label_en} category from Strong Energy.`,
      path: `/en/products/${category.slug}`,
      image: "/assets/alfred-02-C1Z1mvvG.webp"
    });
  }
  if (section === "products" && second && third) {
    const product = getProductByPath(second, third, lang);
    if (!product) return {};
    return createMetadata({
      title: `${product.name} - ${product.subtitle} | Strong Energy`,
      description: product.shortDescription,
      path: `/en/products/${product.categorySlug}/${product.slug}`,
      image: product.heroImage || product.images[0]
    });
  }
  if (section === "blog" && !second) return seo.blog;
  if (section === "blog" && second) {
    const post = getBlogPostBySlug(second, lang);
    if (!post) return {};
    return createMetadata({
      title: `${post.title} | Strong Energy Blog`,
      description: post.excerpt || post.title,
      path: `/en/blog/${post.slug}`,
      image: post.local_cover_image_url || post.cover_image_url || undefined
    });
  }
  if (section === "downloads") return seo.downloads;
  if (section === "media") return seo.media;
  if (section === "contact") return seo.contact;
  if (section === "faq") return seo.faq;
  if (section === "partners") return seo.partner;
  if (section === "about-us") return seo.about;
  if (section === "360-app") return seo.app;

  const legalSlug = normalizeLegalSlug(section);
  const legalPage = legalPages.find((page) => page.slug === legalSlug);
  if (legalPage) {
    return createMetadata({
      title: `${legalTitles[legalPage.slug] || legalPage.title} | Strong Energy`,
      description: `${legalTitles[legalPage.slug] || legalPage.title} of Strong Energy.`,
      path: `/en/${localizeLegalSlug(legalPage.slug, lang)}`,
      image: "/assets/logo-CkaIU7X8.png"
    });
  }

  return {};
}

export default async function EnglishPage({ params, searchParams }: EnglishPageProps) {
  const { segments = [] } = await params;
  const [section, second, third] = segments;

  if (!section) return <HomePageContent />;
  if (section === "products" && !second) return <ProductsPageContent />;
  if (section === "products" && second && !third) return <ProductCategoryPageContent categorySlug={second} />;
  if (section === "products" && second && third) return <ProductDetailPageContent categorySlug={second} productSlug={third} />;
  if (section === "blog" && !second) return <BlogPageContent />;
  if (section === "blog" && second) return <BlogDetailPageContent slug={second} />;
  if (section === "downloads") return <DownloadsPageContent />;
  if (section === "media") return <MediaPageContent />;
  if (section === "contact") {
    const resolvedSearchParams = await searchParams;
    return <ContactPageContent productQueryValue={resolvedSearchParams?.produkt} />;
  }
  if (section === "faq") return <FaqPageContent />;
  if (section === "partners") return <PartnerPageContent />;
  if (section === "about-us") return <AboutPageContent />;
  if (section === "360-app") return <AppPageContent />;

  const legalSlug = normalizeLegalSlug(section);
  const legalPage = legalPages.find((page) => page.slug === legalSlug);
  if (legalPage) return <LegalPageContent slug={legalSlug} />;

  notFound();
}

function HomePageContent() {
  const icons = [ShieldCheck, GraduationCap, Battery, HandHeart];
  const productWorlds = [
    { title: "Solar Systems", href: localizedPath("/produkte/solaranlagen", lang), image: "/assets/solaranlagen-2BF5y_wA.webp" },
    { title: "All-in-One Commercial Storage", href: localizedPath("/produkte/gewerbespeicher-aio", lang), image: "/assets/gewerbespeicher-aio-kachel-YpXwZeiG.jpg" },
    { title: "Mobile Charging", href: localizedPath("/produkte/mobile-charging", lang), image: "/assets/powerbank-s19-ZCOk-RgR.webp" }
  ];

  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: "Strong Energy", url: `${site.baseUrl}/en` }} />
      <HomeHero lang={lang} />
      <section id="product-range" className="bg-secondary/30 py-14 md:py-20">
        <div className="container-wide">
          <div className="mb-12 flex items-center gap-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <h2 className="whitespace-nowrap text-2xl font-bold text-foreground md:text-3xl lg:text-[2.1rem]">
              {t.home.productWorlds} <span className="text-gradient">{t.home.productWorldsHighlight}</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {productWorlds.map((world) => (
              <Link className="group relative block aspect-video overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:shadow-xl" href={world.href} key={world.href}>
                <Image src={world.image} alt={world.title} fill sizes="(min-width: 900px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <h3 className="mb-2 text-lg font-bold text-white md:text-xl">{world.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span>{t.home.discover}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-secondary/30 pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="container-wide">
          <h2 className="mb-10 text-center text-xl font-bold uppercase tracking-wide md:text-2xl lg:text-3xl">
            <span className="text-gradient">{t.home.why}</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {t.home.reasons.map((reason, index) => {
              const Icon = icons[index] || ShieldCheck;
              return (
                <article className="rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-7" key={reason.title}>
                  <Icon size={36} className="mb-3 text-primary" strokeWidth={1.5} />
                  <h3 className="mb-2 text-lg font-bold uppercase tracking-wide text-gradient md:text-xl">{reason.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{reason.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductsPageContent() {
  const products = getProducts(lang).filter((product) => reverseCategorySlug(product.categorySlug) !== "gewerbespeicher-container");
  const categories = getProductCategories(lang).filter((category) => category.is_visible);
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Products", url: `${site.baseUrl}/en/products` }} />
      <PageHero title={<>{t.products.title} <span>{t.products.titleHighlight}</span></>}>
        <p>{t.products.subtitle}</p>
      </PageHero>
      <section className="pb-12">
        <div className="container-wide">
          <ProductTabsGrid products={products} categories={categories} lang={lang} />
        </div>
      </section>
    </>
  );
}

function ProductCategoryPageContent({ categorySlug }: { categorySlug: string }) {
  const category = getProductCategories(lang).find((item) => item.slug === categorySlug);
  if (!category) notFound();
  const products = getProducts(lang).filter((product) => reverseCategorySlug(product.categorySlug) !== "gewerbespeicher-container" || product.categorySlug === categorySlug);
  const categories = getProductCategories(lang).filter((item) => item.is_visible || item.slug === categorySlug);
  return (
    <>
      <PageHero title={category.label_en}>
        <p>{t.products.categorySubtitle}</p>
      </PageHero>
      <section className="py-12">
        <div className="container-wide">
          <ProductTabsGrid products={products} categories={categories} initialCategory={categorySlug} lang={lang} />
        </div>
      </section>
    </>
  );
}

function ProductDetailPageContent({ categorySlug, productSlug }: { categorySlug: string; productSlug: string }) {
  const product = getProductByPath(categorySlug, productSlug, lang);
  if (!product) notFound();
  const downloads = getDownloadsByProduct(product.slug, lang);
  const image = product.heroImage || product.images[0];
  const productUrl = localizedPath(`/produkte/${product.categorySlug}/${product.slug}`, lang);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: "Strong Energy" },
    category: product.category,
    description: product.shortDescription,
    image: absoluteUrl(image),
    url: absoluteUrl(productUrl)
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: localizedPath("/", lang) },
    { name: "Products", path: localizedPath("/produkte", lang) },
    { name: product.category, path: localizedPath(`/produkte/${product.categorySlug}`, lang) },
    { name: product.name, path: productUrl }
  ]);

  return (
    <>
      <SEOJsonLd data={[productJsonLd, breadcrumbs]} />
      <ProductDetailHero product={product} lang={lang} />
      <div className="relative scroll-mt-28 overflow-hidden pb-20 pt-12 md:scroll-mt-32" id="beschreibung">
        <div className="container-wide mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href={localizedPath("/produkte", lang)} className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t.products.back}
          </Link>
          <span className="text-border" aria-hidden="true">|</span>
          <Breadcrumbs
            items={[
              { label: t.products.home, href: localizedPath("/", lang) },
              { label: product.category, href: localizedPath(`/produkte/${product.categorySlug}`, lang) },
              { label: product.name }
            ]}
          />
        </div>
        <section className="container-wide">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <ProductImageGallery images={product.images} modelAssets={product.modelAssets} name={product.name} />
            <div className="flex flex-col justify-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">{product.category}</span>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-[2.5rem]">{product.name}</h2>
                  <p className="mt-2 text-lg font-medium text-muted-foreground">{product.subtitle}</p>
                </div>
                {product.slug === "alfred-10" ? (
                  <Image src="/assets/reddot-winner-2024-DnnYkg0s.png" alt="Red Dot Design Award Winner 2024" width={653} height={382} sizes="(min-width: 768px) 96px, 80px" className="w-20 flex-shrink-0 object-contain opacity-80 md:w-24" />
                ) : null}
              </div>
              <p className="mt-6 whitespace-pre-line text-base leading-[1.625] text-muted-foreground">{product.shortDescription}</p>
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {product.highlights.slice(0, 4).map((item) => (
                  <div key={item.title} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 overflow-hidden rounded-xl bg-secondary/60 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ProductFeatureIcon className="h-5 w-5" icon={item.icon} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <div className="break-words text-sm font-bold leading-snug text-foreground">{item.title}</div>
                      <div className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7">
                <Link className="btn-gradient rounded-full px-6 py-3 text-center text-base font-semibold shadow-lg" href={`${localizedPath("/kontakt", lang)}?produkt=${encodeURIComponent(product.slug)}`}>
                  {t.products.inquireNow}
                </Link>
              </div>
            </div>
          </div>
        </section>
        <ProductDetailTabs downloads={downloads} product={product} lang={lang} />
      </div>
    </>
  );
}

function BlogPageContent() {
  const posts = getBlogPosts(lang);
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "Blog", name: "Strong Energy Blog", url: `${site.baseUrl}/en/blog` }} />
      <section className="bg-gradient-to-b from-secondary/50 to-background pb-14 pt-32 md:pt-40">
        <div className="container-wide text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
            <Newspaper className="h-3.5 w-3.5" />
            {t.blog.badge}
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground md:text-5xl">{t.blog.title}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t.blog.subtitle}</p>
        </div>
      </section>
      <BlogListing posts={posts} lang={lang} />
    </>
  );
}

function BlogDetailPageContent({ slug }: { slug: string }) {
  const post = getBlogPostBySlug(slug, lang);
  if (!post) notFound();
  const image = post.local_cover_image_url || post.cover_image_url;
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: image ? absoluteUrl(image) : undefined,
    datePublished: post.published_at || undefined,
    author: { "@type": "Person", name: post.author || "Strong Energy" },
    url: absoluteUrl(`/en/blog/${post.slug}`)
  };
  return (
    <>
      <SEOJsonLd data={article} />
      <article className="article-page">
        <div className="container article-page__inner">
          <p className="eyebrow">{post.category || "Strong Energy Blog"}</p>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}
          {image ? <Image src={image} alt={post.title} width={960} height={540} priority /> : null}
          <MarkdownContent content={post.content} />
        </div>
      </article>
    </>
  );
}

function DownloadsPageContent() {
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Downloads", url: `${site.baseUrl}/en/downloads` }} />
      <PageHero title={t.downloads.title}>
        <p>{t.downloads.subtitle}</p>
      </PageHero>
      <DownloadsInteractive downloads={getDownloads(lang)} products={getProducts(lang)} lang={lang} />
    </>
  );
}

function MediaPageContent() {
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "ImageGallery", name: "Media Gallery", url: `${site.baseUrl}/en/media` }} />
      <PageHero title={t.media.title}>
        <p>{t.media.subtitle}</p>
      </PageHero>
      <section className="py-12">
        <div className="container-wide">
          <MediaGallery items={getMediaItems()} categories={getMediaCategories()} lang={lang} />
        </div>
      </section>
    </>
  );
}

function ContactPageContent({ productQueryValue }: { productQueryValue?: string | string[] }) {
  const productQuery = (Array.isArray(productQueryValue) ? productQueryValue[0] : productQueryValue)?.trim();
  const product = productQuery ? getProducts(lang).find((item) => item.slug === productQuery || item.name.toLowerCase() === productQuery.toLowerCase()) : undefined;
  const productName = product?.name ?? productQuery;
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact", url: `${site.baseUrl}/en/contact` }} />
      <section className="pb-20 pt-32">
        <div className="container-wide">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">{productName ? `${productName} ${t.contact.inquiryTitleSuffix}` : t.contact.title}</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{productName ? t.contact.inquirySubtitle : t.contact.subtitle}</p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-3">
            <aside className="space-y-8">
              <h2 className="mb-6 text-xl font-bold text-foreground">{t.contact.howToReach}</h2>
              <div className="space-y-5 text-sm text-muted-foreground">
                <p><strong className="text-foreground">{site.legalName}</strong><br />{site.address.street}<br />{site.address.postalCode} {site.address.city}, {t.contact.country}</p>
                <p><strong className="text-foreground">{site.phone}</strong><br />{t.contact.tollFree}</p>
                <p>Mon-Thu: 8:00-17:00<br />Fri: 8:00-15:30</p>
                <p><a href={`mailto:${site.email}`} className="text-foreground transition-smooth hover:text-primary">{site.email}</a></p>
              </div>
              <div className="relative mt-8 h-48 overflow-hidden rounded-2xl">
                <Image src="/assets/kontakt-hero-BGf2Dxw2.jpg" alt="Strong Energy" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover object-top" />
              </div>
            </aside>
            <div className="lg:col-span-2">
              <ContactLiveForm productName={productName} productSlug={product?.slug} lang={lang} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FaqPageContent() {
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage" }} />
      <PageHero title={<>{t.faq.title} <span>{t.faq.titleHighlight}</span></>}>
        <p>{t.faq.subtitle}</p>
      </PageHero>
      <FaqInteractive groups={faqGroups} lang={lang} />
    </>
  );
}

function PartnerPageContent() {
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Partners", url: `${site.baseUrl}/en/partners` }} />
      <PageHero title={t.partner.title}>
        <p>{t.partner.subtitle}</p>
      </PageHero>
      <section className="pb-20 md:pb-28">
        <div className="container-wide">
          <div className="mb-10 text-center">
            <div className="mb-2 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-border" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t.partner.all}</h2>
              <div className="h-px w-12 bg-border" />
            </div>
          </div>
          <PartnerGrid partners={partners} />
          <section className="mt-20 text-center">
            <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 md:p-14">
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">{t.partner.becomeTitle}</h2>
              <p className="mx-auto mb-8 max-w-lg text-muted-foreground">{t.partner.becomeText}</p>
              <Link href={localizedPath("/kontakt", lang)} className="btn-gradient group inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold shadow-lg">
                {t.partner.cta}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

function AboutPageContent() {
  const pillars = [
    { icon: Globe, title: "HISTORY", text: "As part of the Strong Group, Strong Energy has been deeply rooted in the European market since 1986, serving more than 20 million European families." },
    { icon: Headphones, title: "SUPPORT", text: "We offer German support and a free hotline with test centers in Cologne and near Berlin - personal, fast and competent." },
    { icon: Zap, title: "EXPERIENCE", text: "Skyworth has more than 5 GW of power plant construction experience. More than 200,000 solar/PV systems have been installed worldwide." },
    { icon: Shield, title: "SAFETY", text: "Strong Energy products are tested in Germany. Our team works closely with partners and installers and offers regular training." },
    { icon: Building2, title: "SKYWORTH", text: "Our parent company Skyworth is globally known for smart TVs, digital set-top boxes and further technology services." },
    { icon: Factory, title: "STRONG CAPACITY", text: "Strong Energy has access to Skyworth's powerful manufacturing and supply chain management capabilities." },
    { icon: Network, title: "NETWORK", text: "Skyworth employs more than 40,000 people worldwide and has built a global high-tech network since 1988." },
    { icon: Award, title: "REFERENCES", text: "The Strong Group and Skyworth supply leading wholesalers and companies such as Deutsche Telekom, Saturn, Euronics and Walmart." }
  ];
  const team = [
    ["David Norris", "Deputy GM of Strong Energy D/A/CH", "dnorris@strong-energy.eu", "/assets/david-norris-B7MVbvOm.jpg"],
    ["Nils Beck", "Head of Technical Solutions", "n.beck@strong-energy.eu", "/assets/nils-beck-BQ8OoITI.jpg"],
    ["Niklas Balakowski", "Key Account Manager", "nbalakowski@strong-energy.eu", "/assets/niklas-balakowski-DyTINIJV.jpg"],
    ["Michael Müller", "Head of Marketing", "m.muller@strong-energy.eu", "/assets/michael-mueller-BnLIIN3Z.jpg"],
    ["Jason Gao", "Product Engineer PV & Battery", "jgao@strong-energy.eu", "/assets/jason-gao-DwOvahh8.jpg"],
    ["Farideh M. Nezamabadi", "Order Operation Management", "fnezamabadi@strong-eu.com", "/assets/farideh-nezamabadi-DrisO523.jpg"]
  ];

  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: "About Us", url: `${site.baseUrl}/en/about-us` }} />
      <PageHero title={<>{t.about.title} <span>{t.about.titleHighlight}</span></>}>
        <p>{t.about.subtitle}</p>
      </PageHero>
      <section className="py-16">
        <div className="container-wide">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">{t.about.why} <span className="text-gradient">Strong Energy</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title} className="group flex gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="h-fit shrink-0 rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-base font-bold uppercase tracking-wide text-foreground">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t.about.parent}</span>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">Powered by <span className="text-gradient">Skyworth</span></h2>
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                <p>Strong Energy is part of the <a href="https://www.strong-eu.com/de" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Strong Group</a> and has been deeply rooted in the European market since 1986.</p>
                <p>Building on Skyworth&apos;s experience in new energies, Strong Energy started introducing inverters, energy storage batteries and system solutions in Europe in 2023.</p>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-border shadow-xl">
                <Image src="/assets/skyworth-D-_I0vKY.jpg" alt="Skyworth" width={720} height={420} className="w-full bg-white object-cover p-8" />
              </div>
              <div className="mt-6 overflow-hidden rounded-3xl border border-border shadow-xl">
                <Image src="/assets/strong-energy-haeuser-DVL7HDbk.jpg" alt="Strong Energy" width={720} height={405} className="aspect-video w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-secondary/30 py-20">
        <div className="container-wide relative z-10">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t.about.teamEyebrow}</span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">{t.about.teamTitle} <span className="text-gradient">{t.about.teamHighlight}</span></h2>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {team.map(([name, role, email, image]) => (
              <article key={name} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-secondary/30">
                  <Image src={image} alt={name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold leading-tight text-foreground">{name}</h3>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{role}</p>
                  <a href={`mailto:${email}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80">
                    <Mail className="h-3 w-3" />
                    {t.about.contact}
                  </a>
                </div>
              </article>
            ))}
            <article className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center">
              <Users className="h-6 w-6 text-primary" />
              <p className="text-sm font-semibold text-foreground">{t.about.join}</p>
              <p className="text-xs text-muted-foreground">{t.about.applyHint}</p>
              <a href="mailto:info@strong-energy.eu" className="btn-gradient mt-1 rounded-full px-4 py-2 text-xs font-semibold">{t.about.apply}</a>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

function AppPageContent() {
  const features = [
    { icon: Activity, title: "Real-time Monitoring & Optimization", text: "Keep track of device status and power generation efficiency anytime and anywhere." },
    { icon: Settings, title: "Easy Installation & Maintenance", text: "Simplify installation and maintenance through convenient remote control and clear instructions." },
    { icon: ShieldCheck, title: "Smart Energy Management & Backup", text: "Manage battery capacity efficiently and activate backup power in case of a grid outage." }
  ];
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Strong Energy 360 App", applicationCategory: "UtilitiesApplication", operatingSystem: "iOS, Android" }} />
      <section className="relative overflow-hidden pb-20 pt-32 md:pt-40">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.12),transparent_45%,hsl(var(--accent)/0.1))]" />
        <div className="container-wide relative z-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">{t.app.title} <span className="text-gradient">{t.app.titleHighlight}</span></h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground">{t.app.subtitle}</p>
              <AppStoreButtons direction="row" order="apple-first" />
            </div>
            <div className="flex justify-center">
              <AppPhoneSlider />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-secondary/30 py-20">
        <div className="container-wide">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{t.app.allInOne}</h2>
            <p className="text-muted-foreground">{t.app.allInOneText}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-xl border border-border bg-card px-6 pb-6 pt-8 text-center shadow-md transition-shadow hover:shadow-lg">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container-wide text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{t.app.ctaTitle}</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">{t.app.ctaText}</p>
          <Link href={localizedPath("/kontakt", lang)} className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-semibold shadow-lg">
            {t.app.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function LegalPageContent({ slug }: { slug: string }) {
  const page = legalPages.find((item) => item.slug === slug);
  if (!page) notFound();
  const title = legalTitles[slug] || page.title;
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: title, url: `${site.baseUrl}/en/${localizeLegalSlug(page.slug, lang)}` }} />
      <article className="legal-page">
        <div className="container legal-page__inner">
          <h1>{title}</h1>
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </article>
    </>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="rich-text">
      {content.split(/\n{2,}/).map((block, index) => {
        if (block.startsWith("## ")) return <h2 key={index}>{block.replace(/^## /, "")}</h2>;
        if (block.startsWith("# ")) return <h2 key={index}>{block.replace(/^# /, "")}</h2>;
        return <p key={index}>{block.replace(/\*\*/g, "")}</p>;
      })}
    </div>
  );
}
