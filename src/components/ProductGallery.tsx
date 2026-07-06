import Image from "next/image";
import type { Product } from "@/types/content";

export function ProductGallery({
  compact = false,
  images,
  modelAssets = [],
  name
}: {
  compact?: boolean;
  images: string[];
  modelAssets?: Product["modelAssets"];
  name: string;
}) {
  if (!images.length && !modelAssets.length) return null;
  if (compact) {
    const firstImage = images[0];
    return (
      <>
        {firstImage ? (
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/20 border border-border relative group">
            <Image src={firstImage} alt={name} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" priority />
          </div>
        ) : null}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 border-border relative" key={`${image}-${index}`}>
              <Image src={image} alt={`${name} ${index + 1}`} fill sizes="80px" className="object-cover" />
            </div>
          ))}
          {modelAssets.map((model) => (
            <a
              className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-border hover:border-primary/40 bg-secondary/30 transition-all flex flex-col items-center justify-center gap-1"
              href={model.url}
              key={model.url}
            >
              <span className="text-[10px] font-bold text-primary">{model.format}</span>
              <span className="text-[10px] text-muted-foreground text-center px-1">3D</span>
            </a>
          ))}
        </div>
      </>
    );
  }

  return (
    <section className="py-16">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Medien</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((image, index) => (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary" key={`${image}-${index}`}>
              <Image src={image} alt={`${name} ${index + 1}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
          {modelAssets.map((model) => (
            <a className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary border border-border p-5 flex flex-col justify-end gap-2" href={model.url} key={model.url}>
              <span>{model.format}</span>
              <strong>{model.label}</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
