import { index, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { roles } from "./roles";

export const profileRoles = pgTable(
  "profile_roles",
  {
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.roleId] }),
    index("profile_roles_role_id_idx").on(table.roleId),
  ],
);
