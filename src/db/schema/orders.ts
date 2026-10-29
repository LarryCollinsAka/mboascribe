import {
  bigint,
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations";

export const orderStatusEnum = pgEnum("order_status", [
  "DRAFT",
  "AWAITING_PAYMENT",
  "PAID",
  "TRANSCRIBING",
  "REVIEW_QUEUE",
  "IN_REVIEW",
  "QUALITY_APPROVED",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "REVISION_REQUESTED",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),

    status: orderStatusEnum("status")
      .default("DRAFT")
      .notNull(),

    currency: varchar("currency", {
      length: 3,
    })
      .default("XAF")
      .notNull(),

    quotedAmount: bigint("quoted_amount", {
      mode: "number",
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("orders_organization_id_idx").on(table.organizationId),
    index("orders_status_idx").on(table.status),
  ],
);