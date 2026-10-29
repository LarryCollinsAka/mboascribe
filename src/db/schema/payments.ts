import { bigint, index, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const paymentMethodEnum = pgEnum("payment_method", ["SELAR","MANUAL","GREY_BANK_TRANSFER","AIRTM"]);
export const paymentStatusEnum = pgEnum("payment_status", ["PENDING","AWAITING_VERIFICATION","VERIFIED","REJECTED","REFUNDED"]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").default("PENDING").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  externalReference: varchar("external_reference", { length: 255 }),
  proofObjectKey: varchar("proof_object_key", { length: 1000 }),
  verificationNote: text("verification_note"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("payments_order_id_idx").on(table.orderId), index("payments_status_idx").on(table.status)]);
