import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { ensureProfile } from "@/lib/auth/profile";
import { getRoleCodes } from "@/lib/auth/access";

export const instant=false;
export default async function DashboardPage({params}:{params:Promise<{locale:string}>}){const{locale:rawLocale}=await params;if(!locales.includes(rawLocale as Locale))notFound();const locale=rawLocale as Locale;const supabase=await createClient();const{data,error}=await supabase.auth.getClaims();const userId=data?.claims?.sub;if(error||!userId)redirect(`/${locale}/login`);const email=typeof data.claims.email==="string"?data.claims.email:undefined;await ensureProfile(userId,email,locale);const roles=await getRoleCodes(userId);const t=getDictionary(locale).dashboard;
return <main className="portal-shell"><DashboardSidebar locale={locale} roles={roles}/><section className="portal-main"><header className="portal-topbar"><div><span className="kicker">Workspace</span><strong>{email ?? "MboaScribe account"}</strong></div><div className="nav-actions"><LocaleSwitcher locale={locale}/><Link className="text-link" href={`/${locale}`}>Home</Link><form action={logout}><input type="hidden" name="locale" value={locale}/><button className="logout-button" type="submit">Sign out</button></form></div></header><section className="portal-content"><div className="dashboard-intro dashboard-wide"><span className="kicker">{t.kicker}</span><h1>{t.title}</h1><p>{t.lead}</p><div className="portal-status-row"><span>Secure account</span>{roles.length>0&&<span>{roles.join(" · ")}</span>}</div><div className="service-choice-grid"><article className="service-choice"><span className="service-symbol">◉</span><h2>{t.transcription}</h2><p>{t.transcriptionText}</p><button className="button" type="button">{t.start} →</button></article><article className="service-choice"><span className="service-symbol">文</span><h2>{t.translation}</h2><p>{t.translationText}</p><span className="quote-note">{t.custom}</span><button className="button" type="button">{t.start} →</button></article></div></div></section></section></main>}
