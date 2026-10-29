import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/marketing-page";
import { locales, type Locale } from "@/i18n/config";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return <MarketingPage locale={locale as Locale}/>;
}
