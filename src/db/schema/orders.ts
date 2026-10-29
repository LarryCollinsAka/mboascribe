import { bigint, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const serviceTypeEnum = pgEnum("service_type", ["TRANSCRIPTION", "TRANSLATION", "TRANSCRIPTION_TRANSLATION", "SUBTITLING"]);
export const orderStatusEnum = pgEnum("order_status", ["DRAFT","AWAITING_QUOTE","QUOTED","AWAITING_PAYMENT","PAYMENT_REVIEW","PAID","IN_PRODUCTION","QUALITY_REVIEW","DELIVERED","FAILED","CANCELLED","REFUNDED","REVISION_REQUESTED"]);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  serviceType: serviceTypeEnum("service_type").notNull(),
  sourceLocale: varchar("source_locale", { length: 16 }),
  targetLocale: varchar("target_locale", { length: 16 }),
  status: orderStatusEnum("status").default("DRAFT").notNull(),
  currency: varchar("currency", { length: 3 }).default("XAF").notNull(),
  quotedAmount: bigint("quoted_amount", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("orders_organization_id_idx").on(table.organizationId), index("orders_status_idx").on(table.status), index("orders_service_type_idx").on(table.serviceType)]);
