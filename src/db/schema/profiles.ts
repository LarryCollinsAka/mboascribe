import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Application profile for a Supabase Auth user.
 * `id` is intentionally the same UUID as `auth.users.id`.
 * We keep the auth-schema FK out of the Drizzle baseline so Drizzle never
 * attempts to manage Supabase's protected `auth` schema.
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    displayName: varchar("display_name", { length: 255 }),
    preferredLocale: varchar("preferred_locale", { length: 16 })
      .default("en")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("profiles_preferred_locale_idx").on(table.preferredLocale)],
);
