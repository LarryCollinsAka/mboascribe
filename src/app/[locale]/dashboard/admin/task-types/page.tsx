import { asc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { taskTypes } from "@/db/schema";
import { locales, type Locale } from "@/i18n/config";
import { getRoleCodes } from "@/lib/auth/access";
import { createClient } from "@/lib/supabase/server";
export const instant = false;
export default async function TaskTypesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params; if (!locales.includes(raw as Locale)) notFound(); const locale = raw as Locale;
  const supabase = await createClient(); const { data } = await supabase.auth.getClaims(); const userId = data?.claims?.sub; if (!userId) redirect(`/${locale}/login`);
  const roles = await getRoleCodes(userId); if (!roles.some(r => r === "SUPERADMIN" || r === "ADMIN")) redirect(`/${locale}/dashboard`);
  const rows = await db.select().from(taskTypes).orderBy(asc(taskTypes.category), asc(taskTypes.name));
  return <main className="standalone-page"><a href={`/${locale}/dashboard`}>← Dashboard</a><span className="kicker">Administration</span><h1>Task types</h1><p>This is the operational catalog behind worker assignments. Task types are data-driven so new work can be introduced without changing PostgreSQL enums.</p>{rows.length === 0 ? <div className="empty-panel"><h2>Task catalog not seeded</h2><p>Run <code>drizzle/seed-task-types.sql</code> after applying the v0.6 migration.</p></div> : <div className="task-list">{rows.map(t => <article className="task-card" key={t.id}><small>{t.category} · {t.isActive ? "ACTIVE" : "INACTIVE"}</small><h2>{t.name}</h2><p>{t.description}</p><code>{t.code}</code></article>)}</div>}</main>;
}
