import type { Metadata } from "next";
import { CommercialLanding } from "@/components/CommercialLanding";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createMetadata({
    path: "/de/gewerbespeicher-hubspot",
    title: "Gewerbespeicher Beratung | Strong Energy",
    description: "Buchen Sie einen Beratungstermin für Strong Energy Gewerbespeicher.",
    image: "/videos/gewerbespeicher_v3_poster.jpg"
  }),
  robots: {
    index: false,
    follow: false
  }
};

export default function GewerbespeicherHubspotPage() {
  return <CommercialLanding variant="hubspot" />;
}
