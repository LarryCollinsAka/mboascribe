import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { taskTypes, workTasks } from "@/db/schema";
import { locales, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { taskLifecycleAction } from "./actions";
export const instant = false;
export default async function TasksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params; if (!locales.includes(raw as Locale)) notFound(); const locale = raw as Locale;
  const supabase = await createClient(); const { data } = await supabase.auth.getClaims(); const userId = data?.claims?.sub; if (!userId) redirect(`/${locale}/login`);
  const rows = await db.select({ id: workTasks.id, title: workTasks.title, status: workTasks.status, priority: workTasks.priority, type: taskTypes.name, dueAt: workTasks.dueAt }).from(workTasks).innerJoin(taskTypes, eq(workTasks.taskTypeId, taskTypes.id)).where(eq(workTasks.currentAssigneeId, userId));
  return <main className="standalone-page"><a href={`/${locale}/dashboard`}>← Dashboard</a><span className="kicker">Workspace</span><h1>My tasks</h1><p>Assigned production work appears here across transcription, translation, writing support and quality review.</p>{rows.length === 0 ? <div className="empty-panel"><h2>No tasks assigned yet</h2><p>When Operations assigns work to you, it will appear here.</p></div> : <div className="task-list">{rows.map(t => <article className="task-card" key={t.id}><small>{t.type} · {t.priority}</small><h2>{t.title}</h2><p>{t.status.replaceAll("_", " ")}</p><form action={taskLifecycleAction} className="task-actions"><input type="hidden" name="locale" value={locale}/><input type="hidden" name="taskId" value={t.id}/>{t.status==="ASSIGNED"&&<button className="button button-small" name="action" value="accept">Accept task</button>}{["ACCEPTED","REVISION_REQUESTED"].includes(t.status)&&<button className="button button-small" name="action" value="start">Start work</button>}{t.status==="IN_PROGRESS"&&<><textarea name="notes" placeholder="Submission notes"/><button className="button button-small" name="action" value="submit">Submit for review</button></>}</form></article>)}</div>}</main>;
}
