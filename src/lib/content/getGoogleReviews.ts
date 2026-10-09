import "server-only";

const placeId = "ChIJ8T8BZAglv0cRRxwpQhvyDnA";
export const googleReviewsProfileUrl = `https://www.google.com/maps/search/?api=1&query=Strong+Energy&query_place_id=${placeId}`;

export type GoogleReview = {
  id: string;
  author: string;
  text: string;
  rating: number;
  publishedAt: number | null;
  href: string;
};

function googleUrl(value: unknown) {
  if (typeof value !== "string") return googleReviewsProfileUrl;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && (url.hostname === "google.com" || url.hostname.endsWith(".google.com"))) return url.href;
  } catch {
    // An invalid review link falls back to the business profile.
  }
  return googleReviewsProfileUrl;
}

export async function getGoogleReviews(): Promise<GoogleReview[]> {
  // Fetch beyond the newest month so older, genuine reviews can also be shown.
  const params = new URLSearchParams({ "uris[]": placeId, filter_content: "text_required", page_length: "100", order: "date" });
  try {
    const response = await fetch(`https://service-reviews-ultimate.elfsight.com/data/reviews?${params}`, {
      next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) return [];
    const payload = await response.json();
    if (payload.status !== "success" || !Array.isArray(payload.result?.data)) return [];
    const reviews: GoogleReview[] = payload.result.data.flatMap((row: Record<string, unknown>) => {
      if (typeof row.id !== "string" || typeof row.reviewer_name !== "string" || typeof row.text !== "string" || !row.text.trim()
        || typeof row.rating !== "number" || !Number.isFinite(row.rating) || row.rating < 1 || row.rating > 5) return [];
      return [{
        id: row.id, author: row.reviewer_name, text: row.text, rating: row.rating,
        publishedAt: typeof row.published_at === "number" && Number.isFinite(row.published_at) && row.published_at > 0 && row.published_at < 8_640_000_000_000
          ? row.published_at : null,
        href: googleUrl(row.url)
      }];
    });
    // Round-robin through publication months, keeping the original dates and
    // the newest review first. Both homepage and previews share this selection.
    const months = new Map<string, GoogleReview[]>();
    for (const review of reviews) {
      const month = review.publishedAt ? new Date(review.publishedAt * 1000).toISOString().slice(0, 7) : "undated";
      const group = months.get(month) ?? [];
      group.push(review);
      months.set(month, group);
    }
    const mixed: GoogleReview[] = [];
    for (let index = 0; mixed.length < 16; index++) {
      const round = [...months.values()].flatMap((group) => group[index] ? [group[index]] : []);
      if (!round.length) break;
      mixed.push(...round);
    }
    return mixed.slice(0, 16);
  } catch {
    // The product preview remains available when the review provider is unavailable.
    return [];
  }
}
