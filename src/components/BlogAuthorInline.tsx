import Image from "next/image";
import { UserCircle } from "lucide-react";
import { getBlogAuthorProfile } from "@/content/blog-authors";

type BlogAuthorInlineProps = {
  author: string | null | undefined;
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

const fallbackIconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5"
};

export function BlogAuthorInline({ author, className, size = "sm" }: BlogAuthorInlineProps) {
  const authorName = author?.trim() || "Strong Energy";
  const profile = getBlogAuthorProfile(authorName);
  const avatar = profile?.avatar;

  return (
    <span className={cx("inline-flex min-w-0 items-center gap-2", className)}>
      <span className={cx("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary", avatarSizeClasses[size])}>
        {avatar ? (
          <Image src={avatar} alt={`Profilbild von ${profile.name}`} fill sizes={size === "sm" ? "28px" : "32px"} className="object-cover" />
        ) : (
          <UserCircle className={cx("text-muted-foreground", fallbackIconSizeClasses[size])} />
        )}
      </span>
      <span className="truncate">{authorName}</span>
    </span>
  );
}
