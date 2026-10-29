import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const translationContentTypeEnum = pgEnum("translation_content_type", [
  "GENERAL_DOCUMENT",
  "BOOK",
  "MANUSCRIPT",
  "ARTICLE",
  "ACADEMIC_WRITING",
  "WEBSITE",
  "MARKETING_CONTENT",
  "BUSINESS_DOCUMENT",
  "LEGAL_DOCUMENT",
  "TECHNICAL_DOCUMENT",
  "OTHER",
]);

export const translationProjects = pgTable(
  "translation_projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    contentType: translationContentTypeEnum("content_type")
      .default("GENERAL_DOCUMENT")
      .notNull(),
    sourceLanguage: varchar("source_language", { length: 32 }).notNull(),
    targetLanguage: varchar("target_language", { length: 32 }).notNull(),
    wordCount: integer("word_count"),
    pageCount: integer("page_count"),
    sourceUrl: varchar("source_url", { length: 2048 }),
    requiresProofreading: boolean("requires_proofreading").default(true).notNull(),
    requiresFormatting: boolean("requires_formatting").default(false).notNull(),
    deadline: timestamp("deadline", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("translation_projects_order_id_uidx").on(table.orderId),
    index("translation_projects_content_type_idx").on(table.contentType),
  ],
);
