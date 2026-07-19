"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DONATE_URL, SUGGESTED, donateLive } from "@/lib/donate";
import { isLang, t, type Lang } from "@/lib/i18n";

/**
 * Banner de apoyo, visible en todo el sitio salvo en /donar. Un solo botón
 * "invítame un café" → link único pay-what-you-want. Si aún no hay link
 * configurado, cae a /donar en lugar de quedar muerto.
 */
export function CoffeeBanner({ lang }: { lang: Lang }) {
  const pathname = usePathname() || "";
  const seg = pathname.split("/")[1] ?? "";
  const effLang: Lang = isLang(seg) ? seg : lang;
  if (pathname.endsWith("/donar")) return null;
  const S = t(effLang);
  const live = donateLive();

  return (
    <aside
      aria-label={S.banner.groupLabel}
      className="border-t"
      style={{ borderColor: "var(--rule)", background: "var(--clay-wash)" }}
    >
      <div className="mx-auto flex max-w-[84rem] flex-wrap items-center gap-x-8 gap-y-5 px-5 py-7 sm:px-8">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl"
          style={{ background: "var(--clay)", color: "#fffdf8" }}
          aria-hidden
        >
          ☕
        </span>

        <div className="min-w-0 flex-1">
          <p className="display text-[1.15rem] leading-snug">{S.banner.title}</p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {S.banner.sub}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="label hidden sm:inline" style={{ color: "var(--muted)" }} aria-hidden>
            {SUGGESTED.map((n) => `$${n}`).join(" · ")}
          </span>
          {live ? (
            <a href={DONATE_URL} target="_blank" rel="noreferrer" className="btn no-underline">
              {S.nav.coffee}
            </a>
          ) : (
            <Link href={`/${effLang}/donar`} className="btn no-underline">
              {S.nav.coffee}
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
