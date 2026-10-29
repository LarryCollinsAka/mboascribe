import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents, recordings } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { canAccessOrder } from "@/lib/auth/access";
import { sourceObjectKey } from "@/modules/storage/object-keys";
import { objectStorage } from "@/modules/storage/r2-storage";

const MAX_RECORDING = 2 * 1024 * 1024 * 1024;
const MAX_DOCUMENT = 100 * 1024 * 1024;
const RECORDING_TYPES = new Set(["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/aac", "audio/ogg", "video/mp4", "video/webm", "video/quicktime"]);
const DOCUMENT_TYPES = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain", "text/csv", "application/epub+zip"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const profileId = data?.claims?.sub;
  if (error || !profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null) as null | { orderId?: string; kind?: "recording" | "document"; filename?: string; mimeType?: string; sizeBytes?: number };
  if (!body?.orderId || !body.kind || !body.filename || !body.mimeType || !Number.isFinite(body.sizeBytes)) {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }

  const order = await canAccessOrder(profileId, body.orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const allowedTypes = body.kind === "recording" ? RECORDING_TYPES : DOCUMENT_TYPES;
  const maxSize = body.kind === "recording" ? MAX_RECORDING : MAX_DOCUMENT;
  if (!allowedTypes.has(body.mimeType) || body.sizeBytes! <= 0 || body.sizeBytes! > maxSize) {
    return NextResponse.json({ error: "File type or size is not allowed" }, { status: 400 });
  }

  const assetId = crypto.randomUUID();
  const objectKey = sourceObjectKey({ organizationId: order.organizationId, orderId: body.orderId, assetId, kind: body.kind, filename: body.filename });

  if (body.kind === "recording") {
    await db.insert(recordings).values({ id: assetId, orderId: body.orderId, originalFilename: body.filename, mimeType: body.mimeType, objectKey, sizeBytes: body.sizeBytes });
  } else {
    await db.insert(documents).values({ id: assetId, orderId: body.orderId, originalFilename: body.filename, mimeType: body.mimeType, objectKey, sizeBytes: body.sizeBytes });
  }

  const signed = await objectStorage.createPresignedUpload({ objectKey, contentType: body.mimeType });
  return NextResponse.json({ ...signed, assetId });
}
