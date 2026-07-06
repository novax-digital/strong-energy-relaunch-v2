import type { DownloadItem } from "@/types/content";
import { Download, ExternalLink } from "lucide-react";

export function DownloadList({ downloads }: { downloads: DownloadItem[] }) {
  if (!downloads.length) return null;
  return (
    <div className="space-y-3">
      {downloads.map((item) => {
        const href = item.local_file_url_de || item.file_url_de || "#";
        return (
          <a className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group" href={href} key={item.id} target="_blank" rel="noopener noreferrer">
            <span className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
              <Download className="w-6 h-6 text-primary" />
            </span>
            <span className="flex-1 min-w-0">
              <strong className="block font-semibold text-foreground">{item.title_de}</strong>
              <small className="inline-block mt-1 px-2 py-0.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground">{item.category}</small>
              {item.description_de ? <em className="block not-italic text-sm text-muted-foreground mt-2 line-clamp-2">{item.description_de}</em> : null}
            </span>
            <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </a>
        );
      })}
    </div>
  );
}
