import { NextResponse } from "next/server";
import {
  sanitizeProtectionNextPath,
  SITE_PROTECTION_COOKIE,
  SITE_PROTECTION_COOKIE_MAX_AGE,
  SITE_PROTECTION_COOKIE_VALUE,
  verifySiteProtectionPassword
} from "@/lib/siteProtection";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { password?: unknown; next?: unknown } | null;
  const password = typeof payload?.password === "string" ? payload.password : "";
  const nextPath = sanitizeProtectionNextPath(payload?.next);
  const success = await verifySiteProtectionPassword(password);

  if (!success) {
    return NextResponse.json({ error: "Das Passwort stimmt nicht." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, next: nextPath });
  response.cookies.set(SITE_PROTECTION_COOKIE, SITE_PROTECTION_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SITE_PROTECTION_COOKIE_MAX_AGE,
    path: "/"
  });

  return response;
}
