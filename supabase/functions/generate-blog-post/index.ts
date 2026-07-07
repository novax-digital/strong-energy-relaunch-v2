import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type BlogPayload = {
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  reading_time_minutes?: number;
};

const categoryMap: Record<string, string> = {
  Neuigkeiten: "News",
  Produkte: "Products",
  Energie: "Energy",
  Nachhaltigkeit: "Sustainability",
  Tipps: "Tips",
  Technologie: "Technology",
  Unternehmen: "Company",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseAIResponse(raw: string): BlogPayload {
  const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : raw;
  return JSON.parse(jsonString);
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function normalizeBlogPayload(payload: BlogPayload, fallbackTitle: string) {
  const title = String(payload.title || fallbackTitle).trim();
  const content = String(payload.content || "").trim();
  return {
    title,
    excerpt: payload.excerpt ? String(payload.excerpt).trim() : null,
    content,
    tags: Array.isArray(payload.tags) ? payload.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 6) : null,
    reading_time_minutes: Number(payload.reading_time_minutes) || estimateReadingTime(content),
  };
}

async function callLLM({
  apiKey,
  baseUrl,
  model,
  messages,
}: {
  apiKey: string;
  baseUrl: string;
  model: string;
  messages: Array<{ role: "system" | "user"; content: string }>;
}) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`LLM request failed (${response.status}): ${details}`);
  }

  const data = await response.json();
  return String(data.choices?.[0]?.message?.content || "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return jsonResponse({ error: "Supabase environment is incomplete." }, 500);
    }

    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roles } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", claimsData.claims.sub)
      .eq("role", "admin");

    if (!roles?.length) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    const { topic, category, topicId, authorId } = await req.json();
    const cleanTopic = String(topic || "").trim();
    if (!cleanTopic) {
      return jsonResponse({ error: "Bitte gib ein Thema an." }, 400);
    }

    const apiKey = Deno.env.get("LLM_API_KEY") || Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "LLM_API_KEY ist nicht gesetzt. Bitte als Supabase Secret hinterlegen." }, 500);
    }

    const baseUrl = Deno.env.get("LLM_BASE_URL") || "https://api.openai.com/v1";
    const model = Deno.env.get("LLM_MODEL") || "gpt-4o-mini";
    const categoryDe = String(category || "Neuigkeiten");
    const categoryEn = categoryMap[categoryDe] || categoryDe;
    const translationGroupId = crypto.randomUUID();
    const systemPrompt = [
      "Du bist ein professioneller Blog-Autor fuer Strong Energy.",
      "Strong Energy verkauft Solaranlagen, Heim- und Gewerbespeicher, mobile Powerstations und Gewerbespeicherloesungen.",
      "Schreibe konkret, fachlich korrekt, SEO-tauglich und ohne leere Marketingfloskeln.",
      "Nutze Markdown mit ## fuer Hauptabschnitte, kurzen Absätzen, praktischen Hinweisen und einem Fazit.",
      "Antworte ausschliesslich als gueltiges JSON ohne Markdown-Codeblock.",
    ].join(" ");

    const promptDe = `Schreibe einen vollstaendigen Blog-Beitrag auf Deutsch zum Thema "${cleanTopic}".
Kategorie: ${categoryDe}

JSON-Schema:
{
  "title": "Einpraegsame Ueberschrift ohne Markdown",
  "excerpt": "Kurze Vorschau in 2 bis 3 Saetzen",
  "content": "Einleitung als Absatz\\n\\n## Abschnitt\\n\\nInhalt...",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "reading_time_minutes": 5
}`;

    const promptEn = `Write a complete English blog post about "${cleanTopic}".
Category: ${categoryEn}

JSON schema:
{
  "title": "Catchy headline without Markdown",
  "excerpt": "Short preview in 2 to 3 sentences",
  "content": "Intro paragraph\\n\\n## Section\\n\\nContent...",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "reading_time_minutes": 5
}`;

    const [rawDe, rawEn] = await Promise.all([
      callLLM({
        apiKey,
        baseUrl,
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: promptDe },
        ],
      }),
      callLLM({
        apiKey,
        baseUrl,
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: promptEn },
        ],
      }),
    ]);

    const blogDe = normalizeBlogPayload(parseAIResponse(rawDe), cleanTopic);
    const blogEn = normalizeBlogPayload(parseAIResponse(rawEn), cleanTopic);

    async function uniqueSlug(baseSlug: string) {
      let candidate = baseSlug || slugify(cleanTopic);
      for (let index = 2; index < 20; index += 1) {
        const { data } = await adminClient.from("blog_posts").select("id").eq("slug", candidate).maybeSingle();
        if (!data) return candidate;
        candidate = `${baseSlug}-${index}`;
      }
      return `${baseSlug}-${Date.now()}`;
    }

    const baseSlugDe = slugify(blogDe.title);
    const baseSlugEnRaw = slugify(blogEn.title);
    const baseSlugEn = baseSlugEnRaw === baseSlugDe ? `${baseSlugEnRaw}-en` : baseSlugEnRaw;
    const [slugDe, slugEn] = await Promise.all([
      uniqueSlug(baseSlugDe),
      uniqueSlug(baseSlugEn),
    ]);

    return jsonResponse({
      postDe: {
        ...blogDe,
        slug: slugDe,
        category: categoryDe,
        author_id: authorId || null,
        cover_image_url: null,
        is_published: false,
        is_featured: false,
        published_at: null,
        scheduled_at: null,
        language: "de",
        translation_group_id: translationGroupId,
      },
      postEn: {
        ...blogEn,
        slug: slugEn,
        category: categoryEn,
        author_id: authorId || null,
        cover_image_url: null,
        is_published: false,
        is_featured: false,
        published_at: null,
        scheduled_at: null,
        language: "en",
        translation_group_id: translationGroupId,
      },
      topicId: topicId || null,
    });
  } catch (error) {
    console.error("generate-blog-post error", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unbekannter Fehler" }, 500);
  }
});
