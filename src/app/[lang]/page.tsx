import Link from "next/link";
import { certs, globalStats, totalFee } from "@/lib/content";
import { isLang, t, CERT_ROLES, CERT_LEVELS, CERT_FEES, type Lang } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const S = t(lang);
  const list = certs(lang);
  const s = globalStats(lang);

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="mx-auto max-w-[84rem] px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <p className="label rise" style={{ animationDelay: "0ms" }}>
              {S.home.badge}
            </p>

            <h1 className="display rise mt-5 text-[clamp(2.6rem,6.5vw,5.2rem)]" style={{ animationDelay: "70ms" }}>
              {S.home.h1a}
              <span style={{ color: "var(--clay)" }}>{S.home.h1b}</span>
              {S.home.h1c}
            </h1>

            <p
              className="rise mt-7 max-w-2xl text-lg leading-relaxed"
              style={{ animationDelay: "140ms", color: "var(--muted)" }}
            >
              {S.home.heroPara(s.questions - s.official)}
            </p>

            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "210ms" }}>
              <Link href={`/${lang}/cert/CCAO-F`} className="btn no-underline">
                {S.home.ctaAssociate}
              </Link>
              <Link href={`/${lang}/ruta`} className="btn btn-ghost no-underline">
                {S.home.ctaRoute}
              </Link>
            </div>

            <dl
              className="rise mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t pt-8 sm:grid-cols-4"
              style={{ animationDelay: "280ms", borderColor: "var(--rule)" }}
            >
              {[
                { n: String(s.questions), l: S.home.statQuestions, sub: S.home.statOfficial(s.official) },
                { n: String(s.domains), l: S.home.statDomains, sub: S.home.statObjectives(s.objectives) },
                { n: Math.round(s.words / 1000) + "k", l: S.home.statWords, sub: S.home.statWordsSub },
                { n: "$" + totalFee(), l: S.home.statCost, sub: S.home.statCostSub },
              ].map((x) => (
                <div key={x.l}>
                  <dd className="numeral text-[2.6rem]">{x.n}</dd>
                  <dt className="label mt-2.5">{x.l}</dt>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {x.sub}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          {/* ficha del examen */}
          <aside
            className="card rise h-fit p-7 lg:sticky lg:top-24"
            style={{ animationDelay: "350ms" }}
          >
            <p className="label">{S.home.fichaKicker}</p>
            <ul className="mt-5 space-y-4 text-sm">
              {S.home.ficha.map(([k, v]) => (
                <li key={k} className="border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: "var(--rule)" }}>
                  <p className="label" style={{ color: "var(--clay)" }}>
                    {k}
                  </p>
                  <p className="mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
                    {v}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ---------- las 4 certificaciones ---------- */}
      <section className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8">
        <div className="flex items-baseline justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.8rem,3.5vw,2.6rem)]">{S.home.credsTitle}</h2>
          <p className="label hidden sm:block">{S.home.credsKicker}</p>
        </div>

        <div className="mt-10 space-y-5">
          {list.map((c, i) => {
            const heaviest = [...c.domains].sort((a, b) => b.weight - a.weight)[0];
            return (
              <Link
                key={c.code}
                href={`/${lang}/cert/${c.code}`}
                className="card rise group block p-7 no-underline transition-all duration-300 hover:-translate-y-0.5 sm:p-9"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                  {/* numeral gigante */}
                  <div className="flex items-baseline gap-4 lg:w-44 lg:flex-col lg:items-start lg:gap-1">
                    <p
                      className="numeral text-[clamp(3rem,7vw,4.6rem)] transition-colors group-hover:text-[var(--clay)]"
                      style={{ color: "var(--ink)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="label">{c.code}</p>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="display text-[1.7rem]">{CERT_ROLES[c.code]}</h3>
                      <span
                        className="label rounded px-2 py-0.5"
                        style={{
                          background: CERT_LEVELS[c.code] === "Professional" ? "var(--clay-wash)" : "transparent",
                          color: CERT_LEVELS[c.code] === "Professional" ? "var(--clay)" : "var(--muted)",
                          border: CERT_LEVELS[c.code] === "Professional" ? "none" : "1px solid var(--rule)",
                        }}
                      >
                        {CERT_LEVELS[c.code]}
                      </span>
                    </div>
                    <p className="mt-2.5 max-w-xl leading-relaxed" style={{ color: "var(--muted)" }}>
                      {S.certTagline[c.code]}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                      {[
                        S.home.items(c.items),
                        S.home.domains(c.domains.length),
                        S.home.questionsHere(c.stats.questions),
                        S.home.heaviest(heaviest.n, heaviest.weight),
                      ].map((txt) => (
                        <span key={txt} className="label">
                          {txt}
                        </span>
                      ))}
                    </div>

                    {/* blueprint como cinta */}
                    <div className="mt-5 flex h-1.5 w-full max-w-xl overflow-hidden rounded-full">
                      {c.domains.map((d, di) => (
                        <div
                          key={d.n}
                          className="bar-grow h-full"
                          title={`D${d.n} · ${d.titleEs} · ${d.weight}%`}
                          style={{
                            width: `${d.weight}%`,
                            background: "var(--clay)",
                            opacity: 1 - di * 0.12,
                            animationDelay: `${i * 80 + di * 60}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:gap-2">
                    <p className="numeral text-[2.2rem]">${CERT_FEES[c.code]}</p>
                    <span className="label transition-colors group-hover:text-[var(--clay)]">{S.home.study}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- cómo se usa ---------- */}
      <section className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.8rem,3.5vw,2.6rem)]">{S.home.howTitle}</h2>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {S.home.howSteps.map((x, i) => (
            <div key={x.n} className="rise" style={{ animationDelay: `${i * 90}ms` }}>
              <p className="numeral text-[2.4rem]" style={{ color: "var(--clay)" }}>
                {x.n}
              </p>
              <h3 className="display mt-4 text-xl">{x.t}</h3>
              <p className="mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- donación ---------- */}
      <section className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8">
        <div className="card p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_auto] lg:items-center">
            <div>
              <p className="label">{S.home.donateKicker}</p>
              <h2 className="display mt-3 text-[clamp(1.6rem,3vw,2.2rem)]">{S.home.donateTitle}</h2>
              <p className="mt-4 max-w-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
                {S.home.donatePara}
              </p>
            </div>
            <Link href={`/${lang}/donar`} className="btn shrink-0 no-underline">
              {S.home.donateCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
