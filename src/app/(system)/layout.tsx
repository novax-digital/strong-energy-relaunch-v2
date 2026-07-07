import type { ReactNode } from "react";
import { RootDocument, rootMetadata } from "@/components/RootDocument";
import "../globals.css";

export const metadata = rootMetadata;

export default function SystemRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="de">{children}</RootDocument>;
}
