import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-path, x-content-type",
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
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { adminClient, response } = await getAdminClient(req);
    if (response) return response;

    const path = req.headers.get("x-path")!;
    const contentType = req.headers.get("x-content-type") || "application/octet-stream";
    const bytes = new Uint8Array(await req.arrayBuffer());
    const { error } = await adminClient.storage.from("media").upload(path, bytes, {
      contentType,
      upsert: true,
    });
    if (error) throw error;
    const { data } = adminClient.storage.from("media").getPublicUrl(path);
    return new Response(JSON.stringify({ url: data.publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
