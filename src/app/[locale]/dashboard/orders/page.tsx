import { desc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { locales, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
export const instant = false;
export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) { const {locale:raw}=await params;if(!locales.includes(raw as Locale))notFound();const locale=raw as Locale;const supabase=await createClient();const{data}=await supabase.auth.getClaims();const userId=data?.claims?.sub;if(!userId)redirect(`/${locale}/login`);const rows=await db.select().from(orders).where(eq(orders.createdBy,userId)).orderBy(desc(orders.createdAt));return <main className="standalone-page"><a href={`/${locale}/dashboard`}>← Dashboard</a><span className="kicker">Customer portal</span><h1>My orders</h1>{rows.length===0?<div className="empty-panel"><h2>No orders yet</h2><p>Your transcription, translation and writing-support orders will appear here.</p><a className="button" href={`/${locale}/dashboard/new-order`}>Create an order →</a></div>:<div className="task-list">{rows.map(o=><a href={`/${locale}/dashboard/orders/${o.id}`} className="task-card" key={o.id}><small>{o.serviceType}</small><h2>{o.status.replaceAll("_"," ")}</h2><p>{o.quotedAmount ? `${o.currency} ${o.quotedAmount}` : "Quote pending"}</p></a>)}</div>}</main>}
