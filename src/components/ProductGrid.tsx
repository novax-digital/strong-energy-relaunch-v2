import type { Product } from "@/types/content";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.slug} product={product} priority={index < 3} />
      ))}
    </div>
  );
}
