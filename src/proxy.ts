import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  fetchSiteProtectionEnabled,
  isSiteProtectionBypassedPath,
  SITE_PROTECTION_COOKIE,
  SITE_PROTECTION_COOKIE_VALUE
} from "@/lib/siteProtection";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isSiteProtectionBypassedPath(pathname)) {
    return NextResponse.next();
  }

  const protectionEnabled = await fetchSiteProtectionEnabled();

  if (!protectionEnabled || request.cookies.get(SITE_PROTECTION_COOKIE)?.value === SITE_PROTECTION_COOKIE_VALUE) {
    return NextResponse.next();
  }

  const protectedUrl = request.nextUrl.clone();
  protectedUrl.pathname = "/site-protected";
  protectedUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;

  return NextResponse.redirect(protectedUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon.png).*)"]
};
