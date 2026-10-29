"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/i18n/config";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(nextLocale: Locale) {
    const parts = pathname.split("/");
    if (locales.includes(parts[1] as Locale)) parts[1] = nextLocale;
    else parts.splice(1, 0, nextLocale);
    router.push(parts.join("/") || `/${nextLocale}`);
  }

  return (
    <label className="locale-picker">
      <span className="sr-only">Language</span>
      <select value={locale} onChange={(e) => switchLocale(e.target.value as Locale)} aria-label="Language">
        {locales.map((item) => <option key={item} value={item}>{localeLabels[item]}</option>)}
      </select>
    </label>
  );
}
