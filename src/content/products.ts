import productsJson from "./generated/products.json";
import categoriesJson from "./generated/product-categories.json";
import type { Product, ProductCategory } from "@/types/content";
import { onovoProducts } from "./onovo";

const productModelAssets: Partial<Record<string, NonNullable<Product["modelAssets"]>>> = {
  "alfred-10": [
    { label: "Alfred 10 3D-Modell", url: "/assets/models/alfred.glb", format: "GLB" }
  ],
  "power-bank-s19": [
    { label: "Power Bank S-19 3D-Modell", url: "/assets/models/power-bank-s19.glb", format: "GLB" }
  ]
};

export const products = [onovoProducts.de, ...(productsJson as Product[]).filter((product) => product.slug !== "onovo-kunstor")].map((product) => ({
  ...product,
  modelAssets: productModelAssets[product.slug] ?? []
}));
export const productCategories = categoriesJson as ProductCategory[];
