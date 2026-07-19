"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, isLang, t, type Lang } from "@/lib/i18n";

/** Cambia el primer segmento de la ruta actual por otro idioma, conservando el resto. */
export function LangSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname() || `/${lang}`;
  const parts = pathname.split("/");
  const rest = isLang(parts[1] ?? "") ? parts.slice(2).join("/") : parts.slice(1).join("/");

  return (
    <nav aria-label={t(lang).langSwitcher} className="flex items-center gap-0.5">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          className="label rounded px-1.5 py-1 no-underline transition-colors hover:text-[var(--clay)]"
          style={{
            color: l === lang ? "var(--clay)" : "var(--muted)",
            background: l === lang ? "var(--clay-wash)" : "transparent",
            fontWeight: l === lang ? 700 : 500,
          }}
          aria-current={l === lang ? "true" : undefined}
          hrefLang={l}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
