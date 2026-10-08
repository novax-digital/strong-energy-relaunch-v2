import { cookies } from "next/headers";
import { PREVIEW_COOKIE, PRIVATE_RESPONSE_HEADERS, requestPrivatePreview } from "@/lib/privateProductPreview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ preview: string; asset: string }> }) {
  const session = (await cookies()).get(PREVIEW_COOKIE)?.value;
  if (!session) return new Response(null, { status: 401, headers: PRIVATE_RESPONSE_HEADERS });
  const { preview, asset } = await params;
  const result = await requestPrivatePreview({ action: "media", preview, session, asset, range: request.headers.get("range") });
  const headers = new Headers(PRIVATE_RESPONSE_HEADERS);
  for (const name of ["Content-Type", "Content-Length", "Content-Range", "Accept-Ranges"]) {
    const value = result.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(result.body, { status: result.status, headers });
}
