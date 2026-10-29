import path from "node:path";

const SAFE_EXT = /^\.[a-z0-9]{1,10}$/i;

export function sourceObjectKey(input: {
  organizationId: string;
  orderId: string;
  assetId: string;
  kind: "recording" | "document";
  filename: string;
}) {
  const rawExt = path.extname(input.filename).toLowerCase();
  const ext = SAFE_EXT.test(rawExt) ? rawExt : "";
  const folder = input.kind === "recording" ? "recordings" : "documents";
  return `organizations/${input.organizationId}/orders/${input.orderId}/${folder}/${input.assetId}/source${ext}`;
}
