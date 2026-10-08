import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";

const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Content-Type": "application/json" };
const maxAge = 8 * 60 * 60;
const encoder = new TextEncoder();
const attempts = new Map<string, { count: number; expires: number }>();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}

function hex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function equal(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return difference === 0;
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ success: false }, 405);
  try {
    const previewId = Deno.env.get("PRIVATE_PRODUCT_PREVIEW_ID");
    const salt = Deno.env.get("PRIVATE_PRODUCT_PREVIEW_SALT");
    const passwordHash = Deno.env.get("PRIVATE_PRODUCT_PREVIEW_PASSWORD_HASH");
    const secret = Deno.env.get("PRIVATE_PRODUCT_PREVIEW_SIGNING_KEY");
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!previewId || !salt || !passwordHash || !secret || !url || !serviceKey) return json({ success: false }, 503);
    const body = await request.json();
    if (body.preview !== previewId) return json({ success: false }, 404);

    if (body.action === "login") {
      const now = Date.now();
      for (const [ip, entry] of attempts) if (entry.expires <= now) attempts.delete(ip);
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
      const attempt = attempts.get(ip) || { count: 0, expires: now + 15 * 60_000 };
      if (attempt.count >= 10) return json({ success: false }, 429);
      attempt.count++;
      attempts.set(ip, attempt);
      if (typeof body.password !== "string" || !body.password || body.password.length > 200) return json({ success: false }, 401);
      const key = await crypto.subtle.importKey("raw", encoder.encode(body.password), "PBKDF2", false, ["deriveBits"]);
      const hash = hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(salt), iterations: 150_000 }, key, 256));
      if (!equal(hash, passwordHash)) return json({ success: false }, 401);
      attempts.delete(ip);
      const payload = `${previewId}.${Math.floor(now / 1000) + maxAge}`;
      return json({ success: true, session: `${payload}.${await sign(payload, secret)}` });
    }

    if (typeof body.session !== "string" || !/^[a-f0-9]{40}\.\d{10}\.[a-f0-9]{64}$/.test(body.session)) return json({ success: false }, 401);
    const [id, expires, signature] = body.session.split(".");
    const remaining = Number(expires) - Math.floor(Date.now() / 1000);
    if (id !== previewId || remaining <= 0 || remaining > maxAge || !equal(signature, await sign(`${id}.${expires}`, secret))) return json({ success: false }, 401);

    const storage = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }).storage.from("private-product-previews");
    if (body.action === "content") {
      const { data, error } = await storage.download(`${previewId}/content.json`);
      if (error || !data) return json({ success: false }, 503);
      const content = JSON.parse(await data.text());
      return json(content[body.lang === "en" ? "en" : "de"]);
    }
    if (body.action !== "media" || !["hero.mp4", "hero-original.mp4", "cabinet.webp"].includes(body.asset)) return json({ success: false }, 404);
    const { data, error } = await storage.download(`${previewId}/${body.asset}`);
    if (error || !data) return json({ success: false }, 503);
    const file = new Uint8Array(await data.arrayBuffer());
    const mediaHeaders = { ...headers, "Content-Type": body.asset.endsWith(".mp4") ? "video/mp4" : "image/webp", "Accept-Ranges": "bytes", "X-Content-Type-Options": "nosniff" };
    if (body.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(body.range);
      const start = match?.[1] ? Number(match[1]) : Math.max(0, file.length - Number(match?.[2]));
      const end = match?.[1] && match[2] ? Math.min(Number(match[2]), file.length - 1) : file.length - 1;
      if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= file.length || end < start) {
        return new Response(null, { status: 416, headers: { ...mediaHeaders, "Content-Range": `bytes */${file.length}` } });
      }
      return new Response(file.subarray(start, end + 1), { status: 206, headers: { ...mediaHeaders, "Content-Range": `bytes ${start}-${end}/${file.length}`, "Content-Length": String(end - start + 1) } });
    }
    return new Response(file, { headers: { ...mediaHeaders, "Content-Length": String(file.length) } });
  } catch {
    return json({ success: false }, 503);
  }
});
