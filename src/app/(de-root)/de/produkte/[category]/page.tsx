import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/Hero";
import { ProductTabsGrid } from "@/components/ProductTabsGrid";
import { getProductCategories, getProducts } from "@/lib/content/getProducts";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getProductCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getProductCategories().find((item) => item.slug === categorySlug);
  if (!category) return {};
  return createMetadata({
    title: `${category.label_de} | Strong Energy`,
    description: `Produkte aus der Kategorie ${category.label_de} von Strong Energy.`,
    path: `/de/produkte/${category.slug}`,
    image: "/assets/alfred-02-C1Z1mvvG.webp"
  });
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = getProductCategories().find((item) => item.slug === categorySlug);
  if (!category) notFound();
  const products = getProducts();
  const categories = getProductCategories().filter((item) => item.is_visible || item.slug === categorySlug);

  return (
    <>
      <PageHero title={category.label_de}>
        <p>Entdecken Sie passende Strong Energy Lösungen und technische Details für diese Produktwelt.</p>
      </PageHero>
      <section className="py-12">
        <div className="container-wide">
          <ProductTabsGrid products={products} categories={categories} initialCategory={categorySlug} />
        </div>
      </section>
    </>
  );
}
