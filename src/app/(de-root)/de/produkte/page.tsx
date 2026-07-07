import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import { ProductTabsGrid } from "@/components/ProductTabsGrid";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { pageSeo } from "@/content/site";
import { getProductCategories, getProducts } from "@/lib/content/getProducts";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.products);

export default function ProductsPage() {
  const products = getProducts();
  const categories = getProductCategories().filter((category) => category.is_visible);
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Produkte", url: "https://strong-energy.eu/de/produkte" }} />
      <PageHero title={<>Unsere <span>Produkte</span></>}>
        <p>Entdecken Sie unsere innovativen Energiespeicherlösungen für Wohn-, Gewerbe- und Industrieanwendungen.</p>
      </PageHero>
      <section className="pb-12">
        <div className="container-wide">
          <ProductTabsGrid products={products} categories={categories} />
        </div>
      </section>
    </>
  );
}
