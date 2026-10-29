import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 150 }).notNull().unique(),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("permissions_code_idx").on(table.code)],
);
