import type { Metadata } from "next";
import { CommercialLanding } from "@/components/CommercialLanding";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  path: "/de/gewerbespeicher",
  title: "Gewerbespeicher | All-in-One Systeme | Strong Energy",
  description:
    "Industrie- und Gewerbespeicher von Strong Energy: Star Q und Star H mit CATL Zellen, integriertem Feuerlöschsystem und bis zu 10 Jahren Garantie.",
  image: "/videos/gewerbespeicher_v3_poster.jpg"
});

export default function GewerbespeicherPage() {
  return <CommercialLanding />;
}
