import {
  bigint,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "./orders";

export const recordingStatusEnum = pgEnum("recording_status", [
  "PENDING_UPLOAD",
  "UPLOADED",
  "PROCESSING",
  "READY",
  "FAILED",
  "DELETED",
]);

export const recordings = pgTable(
  "recordings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    originalFilename: varchar("original_filename", { length: 500 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    objectKey: varchar("object_key", { length: 1000 }).notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }),
    durationSeconds: integer("duration_seconds"),
    status: recordingStatusEnum("status").default("PENDING_UPLOAD").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("recordings_order_id_idx").on(table.orderId),
    index("recordings_status_idx").on(table.status),
  ],
);
