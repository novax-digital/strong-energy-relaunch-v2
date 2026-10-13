import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnovoModelViewer } from "@/components/OnovoModelViewer";
import { isValidModelShare } from "@/lib/privateModelShare";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "3D-Modell | Strong Energy",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
  referrer: "no-referrer"
};

export default async function ModelSharePage({ params }: { params: Promise<{ share: string }> }) {
  const { share } = await params;
  if (!isValidModelShare(share)) notFound();

  return (
    <main className="flex min-h-dvh items-center bg-secondary/30 py-4 sm:py-6">
      <OnovoModelViewer lang="de" src={`/api/model-share/${share}`} standalone />
    </main>
  );
}
