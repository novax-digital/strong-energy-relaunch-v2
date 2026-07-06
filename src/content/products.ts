import productsJson from "./generated/products.json";
import categoriesJson from "./generated/product-categories.json";
import type { Product, ProductCategory } from "@/types/content";

const productModelAssets: Partial<Record<string, NonNullable<Product["modelAssets"]>>> = {
  "alfred-10": [
    { label: "Alfred 10 3D-Modell", url: "/assets/models/alfred.glb", format: "GLB" }
  ],
  "power-bank-s19": [
    { label: "Power Bank S-19 3D-Modell", url: "/assets/models/power-bank-s19.glb", format: "GLB" }
  ]
};

export const products = (productsJson as Product[]).map((product) => ({
  ...product,
  modelAssets: productModelAssets[product.slug] ?? []
}));
export const productCategories = categoriesJson as ProductCategory[];
