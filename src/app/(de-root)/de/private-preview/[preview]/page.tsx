import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivateProductPage } from "@/components/PrivateProductPage";
import { commercialWarranty } from "@/content/commercialWarranty";

const description = `Onovo Kunstor – ${commercialWarranty.de.sentence}`;

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private Produktvorschau | Strong Energy",
  description,
  openGraph: { title: "Onovo Kunstor | Strong Energy", description, locale: "de_DE" },
  twitter: { card: "summary_large_image", title: "Onovo Kunstor | Strong Energy", description },
  robots: { index: false, follow: false, noarchive: true, nosnippet: true }
};

export default async function Page({ params }: { params: Promise<{ preview: string }> }) {
  const { preview } = await params;
  if (!/^[a-f0-9]{40}$/.test(preview)) notFound();
  return <PrivateProductPage lang="de" preview={preview} />;
}
