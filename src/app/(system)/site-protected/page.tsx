import type { Metadata } from "next";
import { SitePasswordForm } from "@/components/SitePasswordForm";
import { sanitizeProtectionNextPath } from "@/lib/siteProtection";

export const metadata: Metadata = {
  title: "Website geschützt | Strong Energy",
  robots: {
    index: false,
    follow: false
  }
};

type SiteProtectedPageProps = {
  searchParams?: Promise<{ next?: string | string[] }>;
};

export default async function SiteProtectedPage({ searchParams }: SiteProtectedPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextValue = resolvedSearchParams?.next;
  const nextPath = sanitizeProtectionNextPath(Array.isArray(nextValue) ? nextValue[0] : nextValue);

  return <SitePasswordForm nextPath={nextPath} />;
}
