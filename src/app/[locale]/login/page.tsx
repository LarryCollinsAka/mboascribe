import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { login } from "@/app/auth/actions";
import { PasswordField } from "@/components/auth/password-field";
import { locales, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ error?: string; message?: string }> };
const copy = {
  en: { eyebrow:"Welcome back", title:"Sign in to MboaScribe", lead:"Access your projects, deliveries and account.", email:"Email", password:"Password", submit:"Sign in", noAccount:"New to MboaScribe?", signup:"Create an account" },
  fr: { eyebrow:"Bon retour", title:"Connectez-vous à MboaScribe", lead:"Accédez à vos projets, livraisons et à votre compte.", email:"E-mail", password:"Mot de passe", submit:"Se connecter", noAccount:"Nouveau sur MboaScribe ?", signup:"Créer un compte" },
  es: { eyebrow:"Bienvenido de nuevo", title:"Inicia sesión en MboaScribe", lead:"Accede a tus proyectos, entregas y cuenta.", email:"Correo electrónico", password:"Contraseña", submit:"Iniciar sesión", noAccount:"¿Nuevo en MboaScribe?", signup:"Crear una cuenta" },
} as const;
export const instant = false;
export default async function LoginPage({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params; if (!locales.includes(rawLocale as Locale)) notFound(); const locale=rawLocale as Locale; const t=copy[locale];
  const supabase=await createClient(); const {data}=await supabase.auth.getClaims(); if(data?.claims?.sub) redirect(`/${locale}/dashboard`); const query=await searchParams;
  return <main className="auth-shell"><section className="auth-card"><Link className="brand" href={`/${locale}`}><span className="brand-mark"><i/><i/><i/></span><span>MboaScribe</span></Link><div className="auth-copy"><span className="kicker">{t.eyebrow}</span><h1>{t.title}</h1><p>{t.lead}</p></div>{query.error&&<p className="auth-alert auth-error">{query.error}</p>}{query.message&&<p className="auth-alert auth-success">{query.message}</p>}<form className="auth-form" action={login}><input type="hidden" name="locale" value={locale}/><label><span>{t.email}</span><input name="email" type="email" autoComplete="email" required/></label><PasswordField label={t.password} autoComplete="current-password"/><button className="button full" type="submit">{t.submit} →</button></form><p className="auth-foot">{t.noAccount} <Link href={`/${locale}/signup`}>{t.signup}</Link></p></section></main>;
}
