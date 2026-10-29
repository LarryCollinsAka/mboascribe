"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { taskAssignments, workTasks } from "@/db/schema";
import { hasPermission } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
export async function assignTaskAction(formData:FormData){const supabase=await createClient();const{data}=await supabase.auth.getClaims();const actor=data?.claims?.sub;if(!actor||!await hasPermission(actor,"tasks.assign"))throw new Error("Forbidden");const taskId=String(formData.get("taskId")||"");const assigneeId=String(formData.get("assigneeId")||"");const locale=String(formData.get("locale")||"en");if(!taskId||!assigneeId)throw new Error("Task and assignee are required");await db.transaction(async tx=>{const[current]=await tx.select({assignee:workTasks.currentAssigneeId}).from(workTasks).where(eq(workTasks.id,taskId)).limit(1);if(!current)throw new Error("Task not found");if(current.assignee){await tx.update(taskAssignments).set({status:"REASSIGNED",endedAt:new Date()}).where(eq(taskAssignments.taskId,taskId));}await tx.insert(taskAssignments).values({taskId,assigneeId,assignedById:actor,status:"ASSIGNED"});await tx.update(workTasks).set({currentAssigneeId:assigneeId,status:"ASSIGNED",updatedAt:new Date()}).where(eq(workTasks.id,taskId));});revalidatePath(`/${locale}/dashboard/admin/tasks`);}
