import { boolean, index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/** Data-driven catalog of work MboaScribe can perform. */
export const taskTypes = pgTable("task_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  description: text("description"),
  isSystem: boolean("is_system").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("task_types_category_idx").on(table.category), index("task_types_active_idx").on(table.isActive)]);
