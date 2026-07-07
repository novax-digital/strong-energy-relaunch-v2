const SITE_PROTECTION_SETTING_ID = "main";
const SITE_PROTECTION_STATUS_CACHE_MS = 60_000;

export const SITE_PROTECTION_COOKIE = "strong-energy-site-preview";
export const SITE_PROTECTION_COOKIE_VALUE = "unlocked";
export const SITE_PROTECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const STATIC_FILE_PATTERN = /\.(?:avif|css|gif|ico|jpg|jpeg|js|json|map|png|svg|txt|webmanifest|webp|xml|woff|woff2)$/i;
let siteProtectionStatusCache: { value: boolean; expiresAt: number } | null = null;

export function isSiteProtectionBypassedPath(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/site-protected") ||
    pathname.startsWith("/api/site-password") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/videos") ||
    STATIC_FILE_PATTERN.test(pathname)
  );
}

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

export async function fetchSiteProtectionEnabled({ cacheMs = SITE_PROTECTION_STATUS_CACHE_MS }: { cacheMs?: number } = {}) {
  const config = supabaseConfig();

  if (!config) {
    return false;
  }

  const now = Date.now();
  if (cacheMs > 0 && siteProtectionStatusCache && siteProtectionStatusCache.expiresAt > now) {
    return siteProtectionStatusCache.value;
  }

  try {
    const response = await fetch(
      `${config.url}/rest/v1/site_settings_public?id=eq.${SITE_PROTECTION_SETTING_ID}&select=password_protection_enabled`,
      {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`
        },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      return false;
    }

    const [settings] = (await response.json()) as Array<{ password_protection_enabled?: boolean | null }>;
    const enabled = Boolean(settings?.password_protection_enabled);
    if (cacheMs > 0) {
      siteProtectionStatusCache = {
        value: enabled,
        expiresAt: now + cacheMs
      };
    }
    return enabled;
  } catch {
    return false;
  }
}

export async function verifySiteProtectionPassword(password: string) {
  const config = supabaseConfig();

  if (!config || !password.trim()) {
    return false;
  }

  try {
    const response = await fetch(`${config.url}/functions/v1/verify-site-password`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password }),
      cache: "no-store"
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export function sanitizeProtectionNextPath(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/de";
  }

  if (value.startsWith("/site-protected") || value.startsWith("/api/")) {
    return "/de";
  }

  return value;
}
