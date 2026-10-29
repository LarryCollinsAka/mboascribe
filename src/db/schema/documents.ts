import { bigint, index, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const documentStatusEnum = pgEnum("document_status", [
  "PENDING_UPLOAD",
  "UPLOADED",
  "ANALYZING",
  "READY",
  "IN_PRODUCTION",
  "DELIVERED",
  "FAILED",
  "DELETED",
]);

/** Uploaded source/deliverable metadata. Translation semantics live in translation_projects. */
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    originalFilename: varchar("original_filename", { length: 500 }).notNull(),
    mimeType: varchar("mime_type", { length: 150 }).notNull(),
    objectKey: varchar("object_key", { length: 1000 }).notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }),
    wordCount: integer("word_count"),
    pageCount: integer("page_count"),
    status: documentStatusEnum("status").default("PENDING_UPLOAD").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("documents_order_id_idx").on(table.orderId),
    index("documents_status_idx").on(table.status),
  ],
);
