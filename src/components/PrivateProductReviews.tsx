import "server-only";
import { ProductReviewsCarousel } from "@/components/ProductReviewsCarousel";
import { getGoogleReviews, googleReviewsProfileUrl } from "@/lib/content/getGoogleReviews";
import type { Language } from "@/lib/i18n";

export async function PrivateProductReviews({ lang }: { lang: Language }) {
  const reviews = await getGoogleReviews();
  if (!reviews.length) return null;
  return <ProductReviewsCarousel reviews={reviews} profileUrl={googleReviewsProfileUrl} lang={lang} />;
}
