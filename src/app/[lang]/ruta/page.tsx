import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { certs, totalFee } from "@/lib/content";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { isLang, t, CERT_ROLES, CERT_LEVELS, CERT_FEES, type Lang } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const S = t(lang);
  return { title: S.ruta.metaTitle, description: S.ruta.metaDescription };
}

export default async function RoutePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const S = t(lang);
  const list = certs(lang);

  return (
    <div className="mx-auto max-w-[84rem] px-5 py-14 sm:px-8">
      <header className="rise max-w-3xl">
        <p className="label">{S.ruta.kicker}</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,5.5vw,4rem)]">{S.ruta.title(totalFee())}</h1>
        <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          {S.ruta.intro}
        </p>
      </header>

      {/* dashboard personal */}
      <ProgressDashboard
        lang={lang}
        list={list.map((c) => ({ code: c.code, passScaled: c.passScaled, domainNs: c.domains.map((d) => d.n) }))}
      />

      {/* la ruta */}
      <section className="mt-20">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.8rem,3.5vw,2.4rem)]">{S.ruta.orderTitle}</h2>
        </div>

        <div className="mt-10 space-y-4">
          {S.ruta.plan.map((p, i) => {
            const c = list.find((x) => x.code === p.code);
            if (!c) return null;
            return (
              <div key={p.code} className="card rise p-6 sm:p-9" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-10">
                  <div className="lg:w-40">
                    <p className="numeral text-[clamp(3rem,6vw,4.4rem)]" style={{ color: "var(--clay)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="label mt-2">{p.weeks}</p>
                    <p className="label mt-1">${CERT_FEES[p.code]} · {S.home.items(c.items)}</p>
                  </div>

                  <div>
                    <Link href={`/${lang}/cert/${c.code}`} className="no-underline">
                      <h3 className="display text-[1.7rem] transition-colors hover:text-[var(--clay)]">
                        {CERT_ROLES[p.code]} — {CERT_LEVELS[p.code]}
                        <span className="label ml-3">{c.code}</span>
                      </h3>
                    </Link>
                    <p className="mt-3 max-w-2xl leading-relaxed">{p.why}</p>
                    <p
                      className="mt-4 border-l-2 py-1 pl-3.5 text-sm"
                      style={{ borderColor: "var(--clay)", color: "var(--muted)" }}
                    >
                      <strong style={{ color: "var(--clay)" }}>{S.ruta.hoursLabel} </strong>
                      {p.focus}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <Link href={`/${lang}/cert/${c.code}`} className="btn btn-ghost no-underline">
                        {S.ruta.temario}
                      </Link>
                      <Link href={`/${lang}/cert/${c.code}/decodificador`} className="btn btn-ghost no-underline">
                        {S.cert.decodificador}
                      </Link>
                      <Link href={`/${lang}/cert/${c.code}/simulacro`} className="btn btn-ghost no-underline">
                        {S.cert.simulacro}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* verdades incómodas */}
      <section className="mt-20">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.8rem,3.5vw,2.4rem)]">{S.ruta.truthsTitle}</h2>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {S.ruta.truths.map((x, i) => (
            <div key={x.t} className="rise" style={{ animationDelay: `${i * 60}ms` }}>
              <h3 className="display text-xl" style={{ color: "var(--clay)" }}>
                {x.t}
              </h3>
              <p className="mt-2.5 leading-relaxed" style={{ color: "var(--muted)" }}>
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
