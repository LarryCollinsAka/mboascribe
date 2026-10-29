"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { organizationMemberships, organizations, orders, taskTypes, translationProjects, workTasks } from "@/db/schema";
import { locales, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { buildTaskPlan } from "@/modules/orders/task-plan";

const writingCodes = new Set(["ACADEMIC_REVIEW", "RESEARCH_ASSISTANCE", "LITERATURE_REVIEW_SUPPORT", "CITATION_FORMATTING", "ESSAY_SUPPORT", "ASSIGNMENT_SUPPORT", "PROOFREADING", "DOCUMENT_FORMATTING"]);

function checked(formData: FormData, name: string) { return formData.get(name) === "on"; }

export async function createOrderAction(formData: FormData) {
  const localeRaw = String(formData.get("locale") || "en");
  const locale = locales.includes(localeRaw as Locale) ? localeRaw as Locale : "en";
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const profileId = data?.claims?.sub;
  if (!profileId) redirect(`/${locale}/login`);

  const serviceType = String(formData.get("serviceType") || "");
  if (!["TRANSCRIPTION", "TRANSLATION", "WRITING_SUPPORT"].includes(serviceType)) throw new Error("Unsupported service type");

  const writingTask = String(formData.get("writingTask") || "ACADEMIC_REVIEW");
  if (serviceType === "WRITING_SUPPORT" && !writingCodes.has(writingTask)) throw new Error("Unsupported writing task");

  const plan = buildTaskPlan({
    serviceType: serviceType as "TRANSCRIPTION" | "TRANSLATION" | "WRITING_SUPPORT",
    speakerIdentification: checked(formData, "speakerIdentification"),
    timestamps: checked(formData, "timestamps"),
    proofreading: checked(formData, "proofreading"),
    formatting: checked(formData, "formatting"),
    writingTask,
  });

  const orderId = await db.transaction(async (tx) => {
    let [membership] = await tx.select({ organizationId: organizationMemberships.organizationId })
      .from(organizationMemberships)
      .where(and(eq(organizationMemberships.profileId, profileId), eq(organizationMemberships.status, "ACTIVE")))
      .limit(1);

    if (!membership) {
      const [organization] = await tx.insert(organizations).values({ name: "My workspace" }).returning({ id: organizations.id });
      await tx.insert(organizationMemberships).values({ organizationId: organization.id, profileId, role: "OWNER", status: "ACTIVE" });
      membership = { organizationId: organization.id };
    }

    const [order] = await tx.insert(orders).values({ organizationId: membership.organizationId, createdBy: profileId, serviceType: serviceType as "TRANSCRIPTION" | "TRANSLATION" | "WRITING_SUPPORT", status: "AWAITING_QUOTE" }).returning({ id: orders.id });

    if (serviceType === "TRANSLATION") {
      const sourceLanguage = String(formData.get("sourceLanguage") || "").trim();
      const targetLanguage = String(formData.get("targetLanguage") || "").trim();
      if (!sourceLanguage || !targetLanguage) throw new Error("Source and target languages are required");
      await tx.insert(translationProjects).values({
        orderId: order.id,
        sourceLanguage,
        targetLanguage,
        contentType: String(formData.get("contentType") || "GENERAL_DOCUMENT") as "GENERAL_DOCUMENT",
        requiresProofreading: checked(formData, "proofreading"),
        requiresFormatting: checked(formData, "formatting"),
        notes: String(formData.get("notes") || "").trim() || null,
      });
    }

    const codes = [...new Set(plan.map((task) => task.code))];
    const types = await tx.select({ id: taskTypes.id, code: taskTypes.code }).from(taskTypes).where(eq(taskTypes.isActive, true));
    const byCode = new Map(types.filter((type) => codes.includes(type.code)).map((type) => [type.code, type.id]));
    const missing = codes.filter((code) => !byCode.has(code));
    if (missing.length) throw new Error(`Missing active task types: ${missing.join(", ")}`);
    await tx.insert(workTasks).values(plan.map((task) => ({ orderId: order.id, taskTypeId: byCode.get(task.code)!, title: task.title, description: task.description })));
    return order.id;
  });

  redirect(`/${locale}/dashboard/orders/${orderId}`);
}
