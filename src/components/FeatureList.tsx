import type { ProductHighlight } from "@/types/content";
import { Battery, Check, Clock, Headphones, Link as LinkIcon, Shield, Zap } from "lucide-react";

const iconMap = {
  Battery,
  Check,
  Clock,
  HeadphonesIcon: Headphones,
  Link: LinkIcon,
  Shield,
  Zap
};

export function FeatureList({ items }: { items: ProductHighlight[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <article className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors" key={item.title}>
          <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
            {(() => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || Zap;
              return <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />;
            })()}
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
        </article>
      ))}
    </div>
  );
}
