import { notFound, redirect } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { OrderForm } from "./order-form";
export const instant = false;
export default async function NewOrderPage({params}:{params:Promise<{locale:string}>}){const{locale:raw}=await params;if(!locales.includes(raw as Locale))notFound();const locale=raw as Locale;const supabase=await createClient();const{data}=await supabase.auth.getClaims();if(!data?.claims?.sub)redirect(`/${locale}/login`);return <main className="standalone-page"><a href={`/${locale}/dashboard`}>← Dashboard</a><span className="kicker">New order</span><h1>Start a service request</h1><p>Choose the commercial service and the requirements you actually need. MboaScribe will create only the operational tasks required for that order.</p><OrderForm locale={locale}/></main>}
