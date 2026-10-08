import "server-only";
import { cookies } from "next/headers";
import type { Language } from "@/lib/i18n";
import type { Product } from "@/types/content";
import type { AdditionalComparisonProduct } from "@/components/ProductComparisonTable";

export const PREVIEW_COOKIE = "strong-energy-private-product";
export const PREVIEW_MAX_AGE = 60 * 60 * 8;
export const PRIVATE_RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  Vary: "Cookie"
};

export function isPrivateProductPath(path: string) {
  return /^\/(de|en)\/private-preview(?:\/|$)/.test(path);
}

export function privateProductPath(preview: string, lang: Language) {
  return `/${lang}/private-preview/${preview}`;
}

export async function requestPrivatePreview(body: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return new Response(null, { status: 503 });
  try {
    return await fetch(`${url}/functions/v1/private-product-preview`, {
      method: "POST", headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(15_000)
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}

export async function getPrivateProductPreview(preview: string, lang: Language) {
  if (!/^[a-f0-9]{40}$/.test(preview)) return null;
  const session = (await cookies()).get(PREVIEW_COOKIE)?.value;
  if (!session) return null;
  const response = await requestPrivatePreview({ action: "content", preview, session, lang });
  if (!response.ok) return null;
  const content = await response.json() as { product: Product; comparison: AdditionalComparisonProduct };
  const mediaPath = `/api/private-preview/media/${preview}/`;
  const replaceMediaPath = (path: string) => path.replace("/api/private-preview/media/", mediaPath);
  content.product.images = content.product.images.map(replaceMediaPath);
  for (const key of ["heroImage", "heroVideo", "productVideo"] as const) {
    if (content.product[key]) content.product[key] = replaceMediaPath(content.product[key]);
  }
  content.comparison.href = `${privateProductPath(preview, lang)}#${lang === "de" ? "vergleich" : "comparison"}`;
  return content;
}
