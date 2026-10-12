import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { getPrivateProductPreview, PRIVATE_RESPONSE_HEADERS } from "@/lib/privateProductPreview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ preview: string }> }) {
  const { preview } = await params;
  // Validate the signed preview session before exposing the unpublished model.
  const content = await getPrivateProductPreview(preview, "de");
  if (!content) return new Response(null, { status: 401, headers: PRIVATE_RESPONSE_HEADERS });
  if (content.product.slug !== "onovo-kunstor") {
    return new Response(null, { status: 404, headers: PRIVATE_RESPONSE_HEADERS });
  }
  const path = join(process.cwd(), "private-assets/onovo-kunstor/Onovo-Kunstor.glb");
  try {
    const file = await stat(path);
    const stream = Readable.toWeb(createReadStream(path)) as ReadableStream<Uint8Array>;
    return new Response(stream, {
      headers: {
        ...PRIVATE_RESPONSE_HEADERS,
        "Content-Type": "model/gltf-binary",
        "Content-Length": String(file.size),
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return new Response(null, { status: 404, headers: PRIVATE_RESPONSE_HEADERS });
  }
}
