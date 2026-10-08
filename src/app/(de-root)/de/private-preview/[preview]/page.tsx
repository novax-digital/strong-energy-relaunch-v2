import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivateProductPage } from "@/components/PrivateProductPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private Produktvorschau | Strong Energy",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true }
};

export default async function Page({ params }: { params: Promise<{ preview: string }> }) {
  const { preview } = await params;
  if (!/^[a-f0-9]{40}$/.test(preview)) notFound();
  return <PrivateProductPage lang="de" preview={preview} />;
}
