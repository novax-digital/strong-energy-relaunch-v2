import type { Metadata } from "next";
import { PresentationEmbed } from "@/components/PresentationEmbed";

export const metadata: Metadata = {
  title: "Präsentation – Strong Energy",
  description: "Interne Präsentation",
  robots: {
    index: false,
    follow: false
  }
};

export default function PraesentationPage() {
  return <PresentationEmbed />;
}
