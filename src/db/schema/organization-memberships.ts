import { index, pgEnum, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { profiles } from "./profiles";

export const organizationRoleEnum = pgEnum("organization_role", [
  "OWNER",
  "ADMIN",
  "MEMBER",
  "BILLING",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "INVITED",
  "ACTIVE",
  "SUSPENDED",
]);

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    role: organizationRoleEnum("role").default("MEMBER").notNull(),
    status: membershipStatusEnum("status").default("ACTIVE").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("organization_memberships_org_profile_uidx").on(
      table.organizationId,
      table.profileId,
    ),
    index("organization_memberships_profile_id_idx").on(table.profileId),
  ],
);
