import type { Metadata } from "next";
import { CommercialLanding } from "@/components/CommercialLanding";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  path: "/de/gewerbespeicher",
  title: "Gewerbespeicher | All-in-One Systeme | Strong Energy",
  description:
    "Industrie- und Gewerbespeicher von Strong Energy: Onovo Kunstor, Star Q und Star H. All-in-One Systeme mit integriertem Feuerlöschsystem. 10 Jahre Garantie, individuell erweiterbar.",
  image: "/videos/gewerbespeicher_v3_poster.jpg"
});

export default function GewerbespeicherPage() {
  return <CommercialLanding />;
}
