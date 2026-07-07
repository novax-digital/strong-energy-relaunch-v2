"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

export function BlogShareButton({ label, copiedLabel }: { label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <Share2 className="h-4 w-4" />
      {copied ? copiedLabel : label}
    </button>
  );
}
