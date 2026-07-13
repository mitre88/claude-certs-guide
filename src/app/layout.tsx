import type { Metadata } from "next";
import { Fraunces, Newsreader, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { certs, CERT_META } from "@/lib/content";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://claude-certs-guide.vercel.app"),
  title: {
    default: "Guía de certificaciones Claude — preparación en español",
    template: "%s · Guía de certificaciones Claude",
  },
  description:
    "Preparación completa y gratuita, en español, para las cuatro certificaciones oficiales de Anthropic: Associate, Developer y Architect (Foundations y Professional). Temario por dominio, banco de preguntas, simulacros con el blueprint real.",
  keywords: [
    "certificación Claude",
    "Anthropic",
    "CCAO-F",
    "CCDV-F",
    "CCAR-F",
    "CCAR-P",
    "Claude Certified Associate",
    "Claude Certified Developer",
    "Claude Certified Architect",
    "examen Claude español",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Guía de certificaciones Claude",
    description:
      "Temario por dominio, banco de preguntas y simulacros para las 4 certificaciones oficiales de Anthropic. Gratis, en español.",
  },
};

// Evita el parpadeo de tema: corre antes de pintar.
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const list = certs();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className={`${fraunces.variable} ${newsreader.variable} ${jetbrains.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:px-4 focus:py-2"
          style={{ background: "var(--ink)", color: "var(--paper)" }}
        >
          Saltar al contenido
        </a>

        <header
          className="sticky top-0 z-40 border-b backdrop-blur-sm"
          style={{ borderColor: "var(--rule)", background: "color-mix(in srgb, var(--paper) 88%, transparent)" }}
        >
          <div className="mx-auto flex max-w-[84rem] items-center gap-4 px-5 py-3 sm:px-8">
            <Link href="/" className="group flex shrink-0 items-baseline gap-2.5 no-underline">
              <span
                className="grid h-7 w-7 place-items-center rounded-[3px] text-[0.7rem] font-bold transition-transform group-hover:-rotate-6"
                style={{ background: "var(--clay)", color: "#fffdf8", fontFamily: "var(--font-mono)" }}
                aria-hidden
              >
                C
              </span>
              <span className="display text-[1.05rem]" style={{ color: "var(--ink)" }}>
                Certificaciones Claude
              </span>
            </Link>

            <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Certificaciones">
              {list.map((c) => (
                <Link
                  key={c.code}
                  href={`/cert/${c.code}`}
                  className="label rounded px-2.5 py-1.5 no-underline transition-colors hover:text-[var(--clay)]"
                  style={{ color: "var(--muted)" }}
                >
                  {CERT_META[c.code]?.role}
                  <span className="ml-1 opacity-50">{CERT_META[c.code]?.level === "Professional" ? "Pro" : "F"}</span>
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 lg:ml-3">
              <Link href="/ruta" className="label hidden no-underline transition-colors hover:text-[var(--clay)] sm:block" style={{ color: "var(--muted)" }}>
                Ruta
              </Link>
              <Link
                href="/donar"
                className="label rounded border px-2.5 py-1.5 no-underline transition-colors hover:border-[var(--clay)] hover:text-[var(--clay)]"
                style={{ borderColor: "var(--rule)", color: "var(--muted)" }}
              >
                Donar $5
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="mt-24 border-t" style={{ borderColor: "var(--rule)" }}>
          <div className="mx-auto max-w-[84rem] px-5 py-12 sm:px-8">
            <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <p className="display text-xl">Certificaciones Claude</p>
                <p className="mt-3 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
                  Material de estudio gratuito y en español para las cuatro certificaciones de Anthropic. Construido
                  sobre los exam guides oficiales v1.0 (julio 2026) y la documentación pública de Anthropic.
                </p>
                <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
                  Proyecto independiente. No está afiliado, patrocinado ni avalado por Anthropic. &ldquo;Claude&rdquo; es marca de
                  Anthropic PBC.
                </p>
              </div>
              <nav aria-label="Certificaciones">
                <p className="label mb-3">Certificaciones</p>
                <ul className="space-y-2 text-sm">
                  {list.map((c) => (
                    <li key={c.code}>
                      <Link href={`/cert/${c.code}`} className="no-underline hover:text-[var(--clay)]">
                        {CERT_META[c.code]?.role} — {CERT_META[c.code]?.level}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label="Enlaces">
                <p className="label mb-3">Enlaces</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/ruta" className="no-underline hover:text-[var(--clay)]">
                      Ruta de estudio
                    </Link>
                  </li>
                  <li>
                    <Link href="/donar" className="no-underline hover:text-[var(--clay)]">
                      Donar $5
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://anthropic-partners.skilljar.com/page/partner-certifications"
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline hover:text-[var(--clay)]"
                    >
                      Registro oficial ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.pearsonvue.com/us/en/anthropic.html"
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline hover:text-[var(--clay)]"
                    >
                      Pearson VUE ↗
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
