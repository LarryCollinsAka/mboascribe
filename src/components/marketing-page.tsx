import Link from "next/link";
import { LocaleSwitcher } from "./locale-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export function MarketingPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return <main className="site-shell">
    <nav className="nav-wrap">
      <Link className="brand" href={`/${locale}`}><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span><span>MboaScribe</span></Link>
      <div className="nav-links"><a href="#how-it-works">{t.nav.how}</a><a href="#services">{t.nav.services}</a><a href="#pricing">{t.nav.pricing}</a></div>
      <div className="nav-actions"><LocaleSwitcher locale={locale}/><Link className="button button-small" href={`/${locale}/dashboard`}>{t.nav.start}</Link></div>
    </nav>
    <section className="hero">
      <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
      <div className="hero-copy">
        <div className="eyebrow"><span className="flag-dot"/> {t.hero.eyebrow}</div>
        <h1>{t.hero.titleA} <em>{t.hero.titleEm}</em> {t.hero.titleB}</h1>
        <p className="hero-lead">{t.hero.lead}</p>
        <div className="hero-actions"><Link className="button" href={`/${locale}/dashboard`}>{t.hero.primary} <span>→</span></Link><a className="text-link" href="#how-it-works">{t.hero.secondary} <span>↘</span></a></div>
        <div className="trust-row">{t.trust.map((x,i)=><span key={x}>{i>0 && <b>• </b>}{x}</span>)}</div>
      </div>
      <div className="hero-visual" aria-label="MboaScribe language workflow">
        <div className="visual-halo halo-a"/><div className="visual-halo halo-b"/>
        <div className="audio-card"><div className="card-top"><span className="play">▶</span><div><strong>Interview / Manuscript</strong><small>French · English · Spanish</small></div><span className="live-pill">Ready</span></div><div className="waveform">{[22,38,18,52,34,66,28,45,74,31,58,24,48,70,36,55,27,64,40,21,50,32,68,42,25,57,35,72,29,46].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div><div className="progress"><span/></div><div className="card-meta"><span>Language workflow</span><strong>Human QA</strong></div></div>
        <div className="transcript-card"><span className="review-badge">✓ Human reviewed</span><p><b>Transcription</b> Audio and video with context-aware review.</p><p className="muted-line"><b>Translation</b> Documents, manuscripts and books with proofreading.</p></div><div className="cameroon-ribbon"><span/><span/><span/></div>
      </div>
    </section>
    <section className="proof-strip" id="services"><p>{t.proof}</p><div>{t.sectors.map(x=><strong key={x}>{x}</strong>)}</div></section>
    <section className="section" id="how-it-works"><div className="section-heading"><span className="kicker">{t.workflow.kicker}</span><h2>{t.workflow.title}</h2><p>{t.workflow.lead}</p></div><div className="steps-grid">{t.workflow.steps.map(([n,title,text])=><article className="step-card" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="section service-section" id="pricing"><div className="service-copy"><span className="kicker">{t.payments.kicker}</span><h2>{t.payments.title}</h2><p>{t.payments.lead}</p></div><div className="payment-card">{t.payments.methods.map(([icon,name,text])=><div key={name}><span className="payment-icon">{icon}</span><p><strong>{name}</strong><small>{text}</small></p></div>)}<Link className="button full" href={`/${locale}/dashboard`}>{t.nav.start} →</Link></div></section>
    <footer><Link className="brand" href={`/${locale}`}><span className="brand-mark"><i/><i/><i/></span><span>MboaScribe</span></Link><p>{t.footer}</p><span>© 2026 MboaScribe</span></footer>
  </main>;
}
