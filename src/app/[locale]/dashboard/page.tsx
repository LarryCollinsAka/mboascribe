import Link from "next/link";
import { notFound } from "next/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/config";

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
