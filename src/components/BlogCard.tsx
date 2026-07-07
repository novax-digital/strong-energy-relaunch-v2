import Image from "next/image";
import Link from "next/link";
import { BlogAuthorInline } from "@/components/BlogAuthorInline";
import type { BlogPost } from "@/types/content";

export function BlogCard({ post }: { post: BlogPost }) {
  const image = post.local_cover_image_url || post.cover_image_url || "/assets/alfred-02-C1Z1mvvG.webp";
  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <Link href={`/de/blog/${post.slug}`}>
        <div className="relative aspect-[16/10] bg-secondary overflow-hidden">
          <Image src={image} alt={post.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-6">
          {post.category ? <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{post.category}</p> : null}
          <h2 className="text-xl font-bold text-foreground mb-3 leading-tight">{post.title}</h2>
          {post.excerpt ? <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p> : null}
          <div className="mt-5 flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
            <BlogAuthorInline author={post.author} />
            <span className="shrink-0">{post.reading_time_minutes || 1} Min. Lesezeit</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
