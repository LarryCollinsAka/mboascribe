import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents, recordings } from "@/db/schema";
import { canAccessOrder } from "@/lib/auth/access";
import { createClient } from "@/lib/supabase/server";
import { objectStorage } from "@/modules/storage/r2-storage";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const profileId = data?.claims?.sub;
  if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as null | { orderId?: string; assetId?: string; kind?: "recording" | "document" };
  if (!body?.orderId || !body.assetId || !body.kind) return NextResponse.json({ error: "Invalid confirmation" }, { status: 400 });
  if (!await canAccessOrder(profileId, body.orderId)) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (body.kind === "recording") {
    const [asset] = await db.select({ objectKey: recordings.objectKey }).from(recordings).where(and(eq(recordings.id, body.assetId), eq(recordings.orderId, body.orderId))).limit(1);
    if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    if (!await objectStorage.exists(asset.objectKey)) return NextResponse.json({ error: "Upload not found in storage" }, { status: 409 });
    await db.update(recordings).set({ status: "UPLOADED", updatedAt: new Date() }).where(eq(recordings.id, body.assetId));
  } else {
    const [asset] = await db.select({ objectKey: documents.objectKey }).from(documents).where(and(eq(documents.id, body.assetId), eq(documents.orderId, body.orderId))).limit(1);
    if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    if (!await objectStorage.exists(asset.objectKey)) return NextResponse.json({ error: "Upload not found in storage" }, { status: 409 });
    await db.update(documents).set({ status: "UPLOADED", updatedAt: new Date() }).where(eq(documents.id, body.assetId));
  }
  return NextResponse.json({ ok: true });
}
