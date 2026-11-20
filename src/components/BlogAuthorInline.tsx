import Image from "next/image";
import { getBlogAuthorProfile } from "@/content/blog-authors";
import { site } from "@/content/site";

type BlogAuthorInlineProps = {
  author: string | null | undefined;
  avatar?: string | null;
  className?: string;
  size?: "sm" | "md";
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const avatarSizeClasses = {
  sm: "h-7 w-7",
  md: "h-8 w-8"
};

export function BlogAuthorInline({ author, avatar, className, size = "sm" }: BlogAuthorInlineProps) {
  const authorName = author?.trim() || "Strong Energy";
  const profile = getBlogAuthorProfile(authorName);
  const profileImage = avatar?.trim() || profile?.avatar || null;
  const image = profileImage || site.logo;

  return (
    <span className={cx("inline-flex min-w-0 items-center gap-2", className)}>
      <span className={cx("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white", avatarSizeClasses[size])}>
        <Image
          src={image}
          alt={profileImage ? `Profilbild von ${authorName}` : "Strong Energy Logo"}
          fill
          sizes={size === "sm" ? "28px" : "32px"}
          className={profileImage ? "object-cover" : "object-contain p-1"}
        />
      </span>
      <span className="truncate">{authorName}</span>
    </span>
  );
}
