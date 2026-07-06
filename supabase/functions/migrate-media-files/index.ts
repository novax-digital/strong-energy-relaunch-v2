import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function getAdminClient(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { response: new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }) };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
  if (claimsError || !claimsData?.claims) {
    return { response: new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }) };
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: roles } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", claimsData.claims.sub)
    .eq("role", "admin");

  if (!roles || roles.length === 0) {
    return { response: new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }) };
  }

  return { adminClient };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adminClient, response } = await getAdminClient(req);
    if (response) return response;

    // Get all media_items with external file_url pointing to de.strong-energy.eu
    const { data: items, error: fetchError } = await adminClient
      .from("media_items")
      .select("*")
      .like("file_url", "%de.strong-energy.eu%");

    if (fetchError) throw fetchError;

    const results: { id: string; title: string; status: string; newUrl?: string; error?: string }[] = [];

    for (const item of items || []) {
      try {
        const externalUrl = item.file_url;
        if (!externalUrl) continue;

        // Download the file
        console.log(`Downloading: ${externalUrl}`);
        const response = await fetch(externalUrl);
        if (!response.ok) {
          results.push({ id: item.id, title: item.title_de, status: "failed", error: `HTTP ${response.status}` });
          continue;
        }

        const blob = await response.blob();
        const contentType = response.headers.get("content-type") || "image/jpeg";

        // Extract filename from URL
        const urlParts = externalUrl.split("/");
        const originalFilename = urlParts[urlParts.length - 1];
        const storagePath = `migrated/${Date.now()}-${originalFilename}`;

        // Upload to media bucket
        const { error: uploadError } = await adminClient.storage
          .from("media")
          .upload(storagePath, blob, {
            contentType,
            upsert: false,
          });

        if (uploadError) {
          results.push({ id: item.id, title: item.title_de, status: "failed", error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = adminClient.storage
          .from("media")
          .getPublicUrl(storagePath);

        const newUrl = urlData.publicUrl;

        // Update the record
        const { error: updateError } = await adminClient
          .from("media_items")
          .update({ file_url: newUrl })
          .eq("id", item.id);

        if (updateError) {
          results.push({ id: item.id, title: item.title_de, status: "failed", error: updateError.message });
          continue;
        }

        results.push({ id: item.id, title: item.title_de, status: "migrated", newUrl });
        console.log(`Migrated: ${item.title_de}`);
      } catch (err) {
        results.push({ id: item.id, title: item.title_de, status: "failed", error: String(err) });
      }
    }

    return new Response(JSON.stringify({ success: true, migrated: results.filter(r => r.status === "migrated").length, total: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Migration error:", error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
