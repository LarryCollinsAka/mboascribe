import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { organizationMemberships, orders, profileRoles, roles } from "@/db/schema";

export async function getRoleCodes(profileId: string) {
  const rows = await db
    .select({ code: roles.code })
    .from(profileRoles)
    .innerJoin(roles, eq(profileRoles.roleId, roles.id))
    .where(eq(profileRoles.profileId, profileId));
  return rows.map((row) => row.code);
}

export async function canAccessOrder(profileId: string, orderId: string) {
  const [order] = await db
    .select({ id: orders.id, organizationId: orders.organizationId, createdBy: orders.createdBy })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!order) return null;
  if (order.createdBy === profileId) return order;

  const [membership] = await db
    .select({ id: organizationMemberships.id })
    .from(organizationMemberships)
    .where(and(
      eq(organizationMemberships.organizationId, order.organizationId),
      eq(organizationMemberships.profileId, profileId),
      eq(organizationMemberships.status, "ACTIVE"),
    ))
    .limit(1);
  if (membership) return order;

  const roleCodes = await getRoleCodes(profileId);
  if (roleCodes.some((role) => ["SUPERADMIN", "ADMIN", "OPERATIONS"].includes(role))) return order;
  return null;
}
