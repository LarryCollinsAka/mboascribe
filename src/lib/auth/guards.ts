import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPermissionCodes } from "@/lib/auth/permissions";
import { getRoleCodes } from "@/lib/auth/access";
export async function requirePortalUser(locale:string){const supabase=await createClient();const{data}=await supabase.auth.getClaims();const id=data?.claims?.sub;if(!id)redirect(`/${locale}/login`);return {id,email:typeof data.claims.email==="string"?data.claims.email:undefined,roles:await getRoleCodes(id),permissions:await getPermissionCodes(id)};}
export async function requirePermission(locale:string,code:string){const u=await requirePortalUser(locale);if(!u.permissions.has(code))notFound();return u;}
export async function requireSuperadmin(locale:string){const u=await requirePortalUser(locale);if(!u.roles.includes("SUPERADMIN"))notFound();return u;}
