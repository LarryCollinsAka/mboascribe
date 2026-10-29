import { bigint, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { profiles } from "./profiles";

export const serviceTypeEnum = pgEnum("service_type", [
  "TRANSCRIPTION",
  "TRANSLATION",
  "TRANSCRIPTION_TRANSLATION",
  "SUBTITLING",
  "WRITING_SUPPORT",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "DRAFT",
  "AWAITING_QUOTE",
  "QUOTED",
  "AWAITING_PAYMENT",
  "PAYMENT_REVIEW",
  "PAID",
  "IN_PRODUCTION",
  "QUALITY_REVIEW",
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
    createdBy: uuid("created_by")
      .notNull()
      .references(() => profiles.id),
    serviceType: serviceTypeEnum("service_type").notNull(),
    status: orderStatusEnum("status").default("DRAFT").notNull(),
    currency: varchar("currency", { length: 3 }).default("XAF").notNull(),
    quotedAmount: bigint("quoted_amount", { mode: "number" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("orders_organization_id_idx").on(table.organizationId),
    index("orders_created_by_idx").on(table.createdBy),
    index("orders_status_idx").on(table.status),
    index("orders_service_type_idx").on(table.serviceType),
  ],
);
