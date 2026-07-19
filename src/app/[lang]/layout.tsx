import type { Metadata } from "next";
import { Fraunces, Newsreader, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CoffeeBanner } from "@/components/CoffeeBanner";
import { LangSwitcher } from "@/components/LangSwitcher";
import { certs } from "@/lib/content";
import { LOCALES, LANG_TAGS, isLang, t, CERT_ROLES, CERT_LEVELS, type Lang } from "@/lib/i18n";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const S = t(lang);
  return {
    metadataBase: new URL("https://claude-certs-guide.vercel.app"),
    title: { default: S.meta.siteTitle, template: S.meta.template },
    description: S.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(LOCALES.map((l) => [LANG_TAGS[l], `/${l}`])),
    },
    openGraph: {
      type: "website",
      locale: lang === "es" ? "es_ES" : lang === "en" ? "en_US" : lang === "fr" ? "fr_FR" : "ja_JP",
      title: S.meta.siteTitle,
      description: S.meta.ogDescription,
    },
  };
}

// Evita el parpadeo de tema: corre antes de pintar.
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}})()`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const S = t(lang);
  const list = certs(lang);

  return (
    <html lang={LANG_TAGS[lang]} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className={`${fraunces.variable} ${newsreader.variable} ${jetbrains.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:px-4 focus:py-2"
          style={{ background: "var(--ink)", color: "var(--paper)" }}
        >
          {S.nav.skip}
        </a>

        <header
          className="sticky top-0 z-40 border-b backdrop-blur-sm"
          style={{ borderColor: "var(--rule)", background: "color-mix(in srgb, var(--paper) 88%, transparent)" }}
        >
          <div className="mx-auto flex max-w-[84rem] items-center gap-4 px-5 py-3 sm:px-8">
            <Link href={`/${lang}`} className="group flex shrink-0 items-baseline gap-2.5 no-underline">
              <span
                className="grid h-7 w-7 place-items-center rounded-[3px] text-[0.7rem] font-bold transition-transform group-hover:-rotate-6"
                style={{ background: "var(--clay)", color: "#fffdf8", fontFamily: "var(--font-mono)" }}
                aria-hidden
              >
                C
              </span>
              <span className="display text-[1.05rem]" style={{ color: "var(--ink)" }}>
                {S.nav.brand}
              </span>
            </Link>

            <nav className="ml-auto hidden items-center gap-1 xl:flex" aria-label={S.footer.certsLabel}>
              {list.map((c) => (
                <Link
                  key={c.code}
                  href={`/${lang}/cert/${c.code}`}
                  className="label rounded px-2.5 py-1.5 no-underline transition-colors hover:text-[var(--clay)]"
                  style={{ color: "var(--muted)" }}
                >
                  {CERT_ROLES[c.code]}
                  <span className="ml-1 opacity-50">{CERT_LEVELS[c.code] === "Professional" ? "Pro" : "F"}</span>
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 xl:ml-3">
              <Link
                href={`/${lang}/ruta`}
                className="label hidden no-underline transition-colors hover:text-[var(--clay)] sm:block"
                style={{ color: "var(--muted)" }}
              >
                {S.nav.ruta}
              </Link>
              <Link
                href={`/${lang}/donar`}
                className="label hidden rounded border px-2.5 py-1.5 no-underline transition-colors hover:border-[var(--clay)] hover:text-[var(--clay)] md:block"
                style={{ borderColor: "var(--rule)", color: "var(--muted)" }}
              >
                {S.nav.coffee}
              </Link>
              <LangSwitcher lang={lang} />
              <ThemeToggle labelLight={S.nav.themeToLight} labelDark={S.nav.themeToDark} />
            </div>
          </div>
        </header>

        <main id="main">{children}</main>

        <div className="mt-24">
          <CoffeeBanner lang={lang} />
        </div>

        <footer className="border-t" style={{ borderColor: "var(--rule)" }}>
          <div className="mx-auto max-w-[84rem] px-5 py-12 sm:px-8">
            <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <p className="display text-xl">{S.nav.brand}</p>
                <p className="mt-3 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
                  {S.footer.blurb}
                </p>
                <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
                  {S.footer.disclaimer}
                </p>
              </div>
              <nav aria-label={S.footer.certsLabel}>
                <p className="label mb-3">{S.footer.certsLabel}</p>
                <ul className="space-y-2 text-sm">
                  {list.map((c) => (
                    <li key={c.code}>
                      <Link href={`/${lang}/cert/${c.code}`} className="no-underline hover:text-[var(--clay)]">
                        {CERT_ROLES[c.code]} — {CERT_LEVELS[c.code]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label={S.footer.linksLabel}>
                <p className="label mb-3">{S.footer.linksLabel}</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href={`/${lang}/ruta`} className="no-underline hover:text-[var(--clay)]">
                      {S.footer.rutaLink}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lang}/donar`} className="no-underline hover:text-[var(--clay)]">
                      {S.footer.coffeeLink}
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://anthropic-partners.skilljar.com/page/partner-certifications"
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline hover:text-[var(--clay)]"
                    >
                      {S.footer.officialReg}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.pearsonvue.com/us/en/anthropic.html"
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline hover:text-[var(--clay)]"
                    >
                      {S.footer.pearson}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
