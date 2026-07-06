import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="flex items-center gap-2 sm:gap-4 text-sm text-muted-foreground overflow-x-auto no-scrollbar" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 sm:gap-4">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2 sm:gap-4 whitespace-nowrap">
            {item.href ? <Link className="hover:text-foreground transition-colors" href={item.href}>{item.label}</Link> : <span className="text-foreground font-medium" aria-current="page">{item.label}</span>}
            {index < items.length - 1 ? <ChevronRight className="h-3 w-3 flex-shrink-0" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
