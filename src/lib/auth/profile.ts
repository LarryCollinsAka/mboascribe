import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import type { Locale } from "@/i18n/config";

export async function ensureProfile(
  userId: string,
  email: string | undefined,
  locale: Locale,
) {
  const existing = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(profiles).values({
      id: userId,
      displayName: email?.split("@")[0] ?? null,
      preferredLocale: locale,
    });
  }
}
