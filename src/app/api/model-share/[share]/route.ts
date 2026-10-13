import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { isValidModelShare, MODEL_SHARE_HEADERS } from "@/lib/privateModelShare";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ share: string }> }) {
  const { share } = await params;
  if (!isValidModelShare(share)) return new Response(null, { status: 404, headers: MODEL_SHARE_HEADERS });

  const path = join(process.cwd(), "private-assets/onovo-kunstor/Onovo-Kunstor.glb");
  try {
    const file = await stat(path);
    const stream = Readable.toWeb(createReadStream(path)) as ReadableStream<Uint8Array>;
    return new Response(stream, {
      headers: {
        ...MODEL_SHARE_HEADERS,
        "Content-Type": "model/gltf-binary",
        "Content-Length": String(file.size),
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return new Response(null, { status: 404, headers: MODEL_SHARE_HEADERS });
  }
}
