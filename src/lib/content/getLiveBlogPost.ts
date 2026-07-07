import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { normalizeBlogPost, type BlogPostRow } from "@/lib/content/normalizeBlogPost";
import type { Language } from "@/lib/i18n";

type GenericRow = Record<string, unknown>;

type GenericTable = {
  Row: GenericRow;
  Insert: GenericRow;
  Update: GenericRow;
  Relationships: [];
};

type PublicDatabase = {
  public: {
    Tables: Record<string, GenericTable>;
    Views: Record<string, GenericTable>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let serverClient: SupabaseClient<PublicDatabase> | null = null;

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  serverClient ??= createClient<PublicDatabase>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return serverClient;
}

export async function getLiveBlogPostBySlug(slug: string, lang: Language = "de") {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id,title,slug,excerpt,content,category,author,tags,cover_image_url,is_published,is_featured,published_at,created_at,reading_time_minutes,language")
      .eq("is_published", true)
      .eq("language", lang)
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;

    return normalizeBlogPost(data as BlogPostRow);
  } catch {
    return null;
  }
}
