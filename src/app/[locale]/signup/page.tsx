import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { signup } from "@/app/auth/actions";
import { locales, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

const copy = {
  en: {
    eyebrow: "Create account",
    title: "Start with MboaScribe",
    lead: "One account for transcription and translation projects.",
    name: "Your name",
    email: "Email",
    password: "Password",
    hint: "At least 8 characters",
    submit: "Create account",
    haveAccount: "Already have an account?",
    login: "Sign in",
  },
  fr: {
    eyebrow: "Créer un compte",
    title: "Commencez avec MboaScribe",
    lead: "Un seul compte pour vos projets de transcription et de traduction.",
    name: "Votre nom",
    email: "E-mail",
    password: "Mot de passe",
    hint: "Au moins 8 caractères",
    submit: "Créer le compte",
    haveAccount: "Vous avez déjà un compte ?",
    login: "Se connecter",
  },
  es: {
    eyebrow: "Crear cuenta",
    title: "Empieza con MboaScribe",
    lead: "Una cuenta para proyectos de transcripción y traducción.",
    name: "Tu nombre",
    email: "Correo electrónico",
    password: "Contraseña",
    hint: "Al menos 8 caracteres",
    submit: "Crear cuenta",
    haveAccount: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
  },
} as const;

export const instant = false;

export default async function SignupPage({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  const t = copy[locale];

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) redirect(`/${locale}/dashboard`);

  const query = await searchParams;

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link className="brand" href={`/${locale}`}>
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          <span>MboaScribe</span>
        </Link>
        <div className="auth-copy">
          <span className="kicker">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
        {query.error && <p className="auth-alert auth-error">{query.error}</p>}
        <form className="auth-form" action={signup}>
          <input type="hidden" name="locale" value={locale} />
          <label>
            <span>{t.name}</span>
            <input
              name="displayName"
              type="text"
              autoComplete="name"
              required
            />
          </label>
          <label>
            <span>{t.email}</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>{t.password}</span>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <small>{t.hint}</small>
          </label>
          <button className="button full" type="submit">
            {t.submit} →
          </button>
        </form>
        <p className="auth-foot">
          {t.haveAccount} <Link href={`/${locale}/login`}>{t.login}</Link>
        </p>
      </section>
    </main>
  );
}
