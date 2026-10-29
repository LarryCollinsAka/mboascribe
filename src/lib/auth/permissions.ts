import { eq } from "drizzle-orm";
import { db } from "@/db";
import { permissions, profileRoles, rolePermissions } from "@/db/schema";

export async function getPermissionCodes(profileId: string) {
  const rows = await db
    .select({ code: permissions.code })
    .from(profileRoles)
    .innerJoin(rolePermissions, eq(profileRoles.roleId, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(profileRoles.profileId, profileId));
  return new Set(rows.map((row) => row.code));
}

export async function hasPermission(profileId: string, code: string) {
  return (await getPermissionCodes(profileId)).has(code);
}
