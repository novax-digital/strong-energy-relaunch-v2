import { NextRequest, NextResponse } from "next/server";
import {
  privateProductPath, PRIVATE_RESPONSE_HEADERS,
  PREVIEW_COOKIE, PREVIEW_MAX_AGE, requestPrivatePreview
} from "@/lib/privateProductPreview";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; expires: number }>();

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  let sameOrigin = false;
  try {
    sameOrigin = Boolean(origin && new URL(origin).host === host && ["http:", "https:"].includes(new URL(origin).protocol));
  } catch {
    // Reject missing or malformed origins.
  }
  if (!sameOrigin) {
    return NextResponse.json({ success: false }, { status: 403, headers: PRIVATE_RESPONSE_HEADERS });
  }

  const now = Date.now();
  for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const entry = attempts.get(ip) || { count: 0, expires: now + 15 * 60_000 };
  if (entry.count >= 10) {
    return NextResponse.json({ success: false }, { status: 429, headers: { ...PRIVATE_RESPONSE_HEADERS, "Retry-After": "900" } });
  }
  entry.count += 1;
  attempts.set(ip, entry);

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const preview = typeof body?.preview === "string" ? body.preview : "";
  if (!password || password.length > 200 || !/^[a-f0-9]{40}$/.test(preview)) {
    return NextResponse.json({ success: false }, { status: 400, headers: PRIVATE_RESPONSE_HEADERS });
  }
  const result = await requestPrivatePreview({ action: "login", password, preview });
  if (!result.ok) {
    return NextResponse.json({ success: false }, { status: result.status, headers: PRIVATE_RESPONSE_HEADERS });
  }
  const { session } = await result.json() as { session: string };
  attempts.delete(ip);
  const lang = body?.lang === "en" ? "en" : "de";
  const response = NextResponse.json({ success: true, next: privateProductPath(preview, lang) }, { headers: PRIVATE_RESPONSE_HEADERS });
  response.cookies.set(PREVIEW_COOKIE, session, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: PREVIEW_MAX_AGE
  });
  return response;
}
