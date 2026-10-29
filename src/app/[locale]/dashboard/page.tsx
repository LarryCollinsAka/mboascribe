import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { ensureProfile } from "@/lib/auth/profile";

export const instant = false;

type DashboardPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    redirect(`/${locale}/login`);
  }

  const email = typeof data.claims.email === "string" ? data.claims.email : undefined;
  await ensureProfile(userId, email, locale);

  const t = getDictionary(locale).dashboard;
  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <Link className="brand" href={`/${locale}`}>
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          <span>MboaScribe</span>
        </Link>
        <div className="nav-actions">
          <LocaleSwitcher locale={locale} />
          <Link className="text-link" href={`/${locale}`}>
            ← Home
          </Link>
          <form action={logout}>
            <input type="hidden" name="locale" value={locale} />
            <button className="logout-button" type="submit">Sign out</button>
          </form>
        </div>
      </header>
      <section className="dashboard-intro dashboard-wide">
        <span className="kicker">{t.kicker}</span>
        <h1>{t.title}</h1>
        <p>{t.lead}</p>
        <div className="service-choice-grid">
          <article className="service-choice">
            <span className="service-symbol">◉</span>
            <h2>{t.transcription}</h2>
            <p>{t.transcriptionText}</p>
            <button className="button" type="button">
              {t.start} →
            </button>
          </article>
          <article className="service-choice">
            <span className="service-symbol">文</span>
            <h2>{t.translation}</h2>
            <p>{t.translationText}</p>
            <span className="quote-note">{t.custom}</span>
            <button className="button" type="button">
              {t.start} →
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}
