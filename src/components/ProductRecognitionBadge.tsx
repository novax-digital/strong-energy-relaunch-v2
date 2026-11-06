import Image from "next/image";
import type { Product } from "@/types/content";

export function ProductRecognitionBadge({ recognition }: { recognition: Product["recognition"] }) {
  if (!recognition) return null;

  return (
    <Image
      src={recognition.image}
      alt={recognition.alt}
      width={1267}
      height={1241}
      sizes="(min-width: 768px) 128px, 112px"
      className="w-28 shrink-0 object-contain md:w-32"
    />
  );
}
