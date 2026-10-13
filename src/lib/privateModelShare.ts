import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { PRIVATE_RESPONSE_HEADERS } from "@/lib/privateProductPreview";

// Store only the digest. Replacing it revokes the model's independent bearer link.
const ONOVO_SHARE_DIGEST = Buffer.from("164966aa33aa7af097b612cd85687c4566d88554b415f3df6aab048e125d1601", "hex");

export const MODEL_SHARE_HEADERS = {
  ...PRIVATE_RESPONSE_HEADERS,
  "Referrer-Policy": "no-referrer"
};

export function isValidModelShare(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return false;
  return timingSafeEqual(createHash("sha256").update(token).digest(), ONOVO_SHARE_DIGEST);
}
