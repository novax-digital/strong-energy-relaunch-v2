import Image from "next/image";
import badges from "@/content/generated/app-badges.json";
import { site } from "@/content/site";

type AppStoreButtonsProps = {
  compact?: boolean;
  direction?: "column" | "row";
  order?: "google-first" | "apple-first";
};

export function AppStoreButtons({ compact = false, direction = "column", order = "google-first" }: AppStoreButtonsProps) {
  const badgeClassName = compact ? "h-10 w-auto" : "h-12 w-auto";
  const links = [
    {
      key: "google",
      href: site.appLinks.google,
      label: "Get it on Google Play",
      src: badges.google,
      width: compact ? 132 : 160,
      height: compact ? 39 : 48
    },
    {
      key: "apple",
      href: site.appLinks.apple,
      label: "Download on the App Store",
      src: badges.apple,
      width: compact ? 120 : 150,
      height: compact ? 40 : 50
    }
  ];
  const orderedLinks = order === "apple-first" ? [...links].reverse() : links;

  return (
    <div className={`flex gap-3 ${direction === "row" ? "flex-row flex-wrap items-center" : "flex-col items-start"}`}>
      {orderedLinks.map((link) => (
        <a key={link.key} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="inline-block transition-smooth hover:opacity-80">
          <Image src={link.src} alt={link.label} width={link.width} height={link.height} className={badgeClassName} style={{ width: "auto" }} />
        </a>
      ))}
    </div>
  );
}
