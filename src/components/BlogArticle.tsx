import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ListTree, Tag, User } from "lucide-react";
import { BlogShareButton } from "@/components/BlogShareButton";
import type { BlogPost, Locale } from "@/types/content";

type TocItem = {
  level: number;
  text: string;
  id: string;
};

const categoryColors: Record<string, string> = {
  Neuigkeiten: "border-primary/20 bg-primary/10 text-primary",
  Produkte: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  Energie: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  Nachhaltigkeit: "border-green-500/20 bg-green-500/10 text-green-600",
  Tipps: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  News: "border-primary/20 bg-primary/10 text-primary",
  Products: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  Energy: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  Sustainability: "border-green-500/20 bg-green-500/10 text-green-600",
  Tips: "border-blue-500/20 bg-blue-500/10 text-blue-600"
};

const blogLabels = {
  de: {
    back: "Zurück zum Blog",
    share: "Teilen",
    copied: "Kopiert",
    toc: "Inhaltsverzeichnis",
    readTime: "Min. Lesezeit",
    morePosts: "Weitere spannende Beiträge warten auf dich.",
    allPosts: "Alle Beiträge"
  },
  en: {
    back: "Back to blog",
    share: "Share",
    copied: "Copied",
    toc: "Table of contents",
    readTime: "min read",
    morePosts: "More posts are waiting for you.",
    allPosts: "All posts"
  }
} satisfies Record<Locale, Record<string, string>>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, "-")
    .replace(/^-|-$/g, "");
}

function stripInlineMarkdown(value: string) {
  return value.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function generateToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = stripInlineMarkdown(match[2]);
    headings.push({ level: match[1].length, text, id: slugify(text) });
  }

  return headings;
}

function formatDate(value: string | null | undefined, lang: Locale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function isInternalHref(href: string) {
  return href.startsWith("/");
}

function renderLink(href: string, children: React.ReactNode, key: string) {
  const isInquiryCta = href.includes("anfrage=true");
  const className = isInquiryCta
    ? "inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#d7d42f,#28a795)] px-6 py-3 font-semibold text-white no-underline shadow-lg transition-opacity hover:opacity-90"
    : "text-primary underline transition-colors hover:text-primary/80";

  if (isInternalHref(href)) {
    return (
      <Link key={key} href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a key={key} href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function renderInline(value: string, keyPrefix = "inline"): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let index = 0;

  while (cursor < value.length) {
    const boldIndex = value.indexOf("**", cursor);
    const linkIndex = value.indexOf("[", cursor);
    const indexes = [boldIndex, linkIndex].filter((item) => item >= 0);

    if (!indexes.length) {
      nodes.push(value.slice(cursor));
      break;
    }

    const nextIndex = Math.min(...indexes);
    if (nextIndex > cursor) {
      nodes.push(value.slice(cursor, nextIndex));
    }

    if (nextIndex === boldIndex) {
      const end = value.indexOf("**", nextIndex + 2);
      if (end < 0) {
        nodes.push(value.slice(nextIndex));
        break;
      }
      nodes.push(
        <strong key={`${keyPrefix}-strong-${index}`} className="font-semibold text-foreground">
          {renderInline(value.slice(nextIndex + 2, end), `${keyPrefix}-strong-${index}`)}
        </strong>
      );
      cursor = end + 2;
      index += 1;
      continue;
    }

    const textEnd = value.indexOf("]", nextIndex + 1);
    const hrefStart = textEnd >= 0 ? value.indexOf("(", textEnd) : -1;
    const hrefEnd = hrefStart >= 0 ? value.indexOf(")", hrefStart) : -1;
    if (textEnd < 0 || hrefStart !== textEnd + 1 || hrefEnd < 0) {
      nodes.push(value[nextIndex]);
      cursor = nextIndex + 1;
      continue;
    }

    const text = value.slice(nextIndex + 1, textEnd);
    const href = value.slice(hrefStart + 1, hrefEnd);
    nodes.push(renderLink(href, renderInline(text, `${keyPrefix}-link-${index}`), `${keyPrefix}-link-${index}`));
    cursor = hrefEnd + 1;
    index += 1;
  }

  return nodes;
}

function MarkdownBlocks({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => {
        if (/^---+$/.test(block)) {
          return <hr key={index} className="my-10 border-border" />;
        }

        const heading = block.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
          const level = heading[1].length;
          const text = stripInlineMarkdown(heading[2]);
          const id = slugify(text);
          if (level === 1) {
            return (
              <h1 key={index} id={id} className="mt-10 scroll-mt-24 text-3xl font-bold text-foreground">
                {renderInline(heading[2], `h1-${index}`)}
              </h1>
            );
          }
          if (level === 2) {
            return (
              <h2 key={index} id={id} className="mt-10 scroll-mt-24 border-b border-border pb-2 text-2xl font-bold text-foreground">
                {renderInline(heading[2], `h2-${index}`)}
              </h2>
            );
          }
          return (
            <h3 key={index} id={id} className="mt-8 scroll-mt-24 text-xl font-semibold text-foreground">
              {renderInline(heading[2], `h3-${index}`)}
            </h3>
          );
        }

        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={index} className="my-6 space-y-2 pl-0">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="flex gap-2 leading-relaxed text-muted-foreground">
                  <span className="font-bold text-primary">•</span>
                  <span>{renderInline(line.replace(/^[-*]\s+/, ""), `ul-${index}-${lineIndex}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return (
            <ol key={index} className="my-6 list-decimal space-y-2 pl-6">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="leading-relaxed text-muted-foreground">
                  {renderInline(line.replace(/^\d+\.\s+/, ""), `ol-${index}-${lineIndex}`)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className="mb-5 leading-relaxed text-muted-foreground">
            {renderInline(block.replace(/\n/g, " "), `p-${index}`)}
          </p>
        );
      })}
    </div>
  );
}

export function BlogArticle({ post, lang = "de" }: { post: BlogPost; lang?: Locale }) {
  const labels = blogLabels[lang];
  const image = post.local_cover_image_url || post.cover_image_url;
  const toc = generateToc(post.content);
  const publishedDate = formatDate(post.published_at || post.created_at, lang);
  const blogPath = lang === "de" ? "/de/blog" : "/en/blog";

  return (
    <section className="bg-background pt-28 md:pt-32">
      <div className="container-wide py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href={blogPath} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {labels.back}
          </Link>
          <BlogShareButton label={labels.share} copiedLabel={labels.copied} />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 pb-16 md:px-8">
        {post.category ? (
          <span className={`mb-4 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[post.category] || "border-primary/20 bg-primary/10 text-primary"}`}>
            {post.category}
          </span>
        ) : null}

        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-normal text-foreground md:text-4xl lg:text-5xl">{post.title}</h1>

        {post.excerpt ? <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p> : null}

        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.author ? (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </span>
          ) : null}
          {publishedDate ? (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {publishedDate}
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.reading_time_minutes || 3} {labels.readTime}
          </span>
        </div>

        {image ? (
          <div className="mb-10 overflow-hidden rounded-xl">
            <Image src={image} alt={post.title} width={960} height={540} priority className="h-auto max-h-[500px] w-full object-cover" />
          </div>
        ) : null}

        {toc.length > 2 ? (
          <div className="mb-10 rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <ListTree className="h-5 w-5 text-primary" />
                {labels.toc}
              </h2>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm text-muted-foreground transition-colors hover:text-primary ${item.level === 1 ? "font-medium" : item.level === 2 ? "pl-4" : "pl-8"}`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        ) : null}

        <MarkdownBlocks content={post.content} />

        {post.tags && post.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="mb-4 text-muted-foreground">{labels.morePosts}</p>
          <Link href={blogPath} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
            <ArrowLeft className="h-4 w-4" />
            {labels.allPosts}
          </Link>
        </div>
      </article>
    </section>
  );
}
