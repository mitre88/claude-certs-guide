import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { certs, cert } from "@/lib/content";
import { DomainProgress } from "@/components/DomainProgress";
import { isLang, t, CERT_LEVELS, CERT_FEES, type Lang } from "@/lib/i18n";

export const dynamicParams = false;
export const generateStaticParams = () => certs("es").map((c) => ({ code: c.code }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}): Promise<Metadata> {
  const { lang, code } = await params;
  if (!isLang(lang)) return {};
  const c = cert(lang, code);
  if (!c) return {};
  const S = t(lang);
  return {
    title: `${c.name} (${c.code})`,
    description: S.cert.metaDescription(c.nameEs, c.domains.length, c.stats.questions, c.items, c.minutes),
  };
}

export default async function CertPage({ params }: { params: Promise<{ lang: string; code: string }> }) {
  const { lang: raw, code } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const S = t(lang);
  const c = cert(lang, code);
  if (!c) notFound();
  const byWeight = [...c.domains].sort((a, b) => b.weight - a.weight);
  const top3 = byWeight.slice(0, 3);
  const top3Sum = top3.reduce((s, d) => s + d.weight, 0);
  const [w1, w2, w3] = S.cert.wherePara(
    top3.map((d) => `D${d.n}`).join(", "),
    top3Sum.toFixed(1).replace(/\.0$/, ""),
  );

  return (
    <div className="mx-auto max-w-[84rem] px-5 py-14 sm:px-8">
      {/* ---------- encabezado ---------- */}
      <header className="rise">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="label rounded px-2 py-1" style={{ background: "var(--clay-wash)", color: "var(--clay)" }}>
            {c.code}
          </span>
          <span className="label">{CERT_LEVELS[c.code]}</span>
          <span className="label">v{c.version} · {c.effective}</span>
        </div>

        <h1 className="display mt-5 text-[clamp(2.2rem,5.5vw,4rem)]">{c.nameEs}</h1>
        <p className="mt-2 text-lg" lang="en" style={{ color: "var(--muted)" }}>
          {c.name}
        </p>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">{S.certTagline[c.code]}</p>
      </header>

      {/* ---------- ficha técnica ---------- */}
      <dl
        className="rise mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-y py-8 sm:grid-cols-3 lg:grid-cols-6"
        style={{ animationDelay: "80ms", borderColor: "var(--rule)" }}
      >
        {[
          { n: String(c.items), l: S.cert.fichaLabels[0] },
          { n: `${c.minutes}′`, l: S.cert.fichaLabels[1] },
          { n: String(c.passScaled), l: S.cert.fichaLabels[2] },
          { n: `$${CERT_FEES[c.code]}`, l: S.cert.fichaLabels[3] },
          { n: `${c.validityMonths}m`, l: S.cert.fichaLabels[4] },
          { n: String(c.domains.length), l: S.cert.fichaLabels[5] },
        ].map((x) => (
          <div key={x.l}>
            <dd className="numeral text-[2.2rem]">{x.n}</dd>
            <dt className="label mt-2">{x.l}</dt>
          </div>
        ))}
      </dl>

      {/* ---------- acciones ---------- */}
      <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "120ms" }}>
        <Link href={`/${lang}/cert/${c.code}/practica`} className="btn no-underline">
          {S.cert.practicar(c.stats.questions)}
        </Link>
        <Link href={`/${lang}/cert/${c.code}/simulacro`} className="btn btn-ghost no-underline">
          {S.cert.simulacro}
        </Link>
        <Link href={`/${lang}/cert/${c.code}/decodificador`} className="btn btn-ghost no-underline">
          {S.cert.decodificador}
        </Link>
      </div>

      {/* ---------- estrategia: dónde está el examen ---------- */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.6rem,3vw,2.2rem)]">{S.cert.whereTitle}</h2>
          <p className="label hidden sm:block">{S.cert.whereKicker}</p>
        </div>

        <p className="mt-6 max-w-3xl leading-relaxed" style={{ color: "var(--muted)" }}>
          {w1}
          <strong style={{ color: "var(--ink)" }}>{top3.map((d) => `D${d.n}`).join(", ")}</strong>
          {w2.replace(top3Sum.toFixed(1).replace(/\.0$/, ""), top3Sum.toFixed(1).replace(/\.0$/, ""))}
          {w3}
        </p>

        <div className="mt-10 space-y-3">
          {byWeight.map((d, i) => (
            <Link
              key={d.n}
              href={`/${lang}/cert/${c.code}/dominio/${d.n}`}
              className="card rise group block p-5 no-underline transition-all duration-300 hover:-translate-y-0.5 sm:p-6"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6">
                <div className="flex items-baseline gap-3 sm:w-24 sm:flex-col sm:gap-0">
                  <p
                    className="numeral text-[2.6rem] transition-colors group-hover:text-[var(--clay)]"
                    style={{ color: i < 3 ? "var(--clay)" : "var(--ink)" }}
                  >
                    {d.weight}
                    <span className="text-[1.2rem]">%</span>
                  </p>
                  <p className="label">{S.cert.domainLabel(d.n)}</p>
                </div>

                <div className="min-w-0">
                  <h3 className="display text-[1.35rem]">{d.titleEs}</h3>
                  <p className="mt-0.5 text-sm" lang="en" style={{ color: "var(--muted)" }}>
                    {d.title}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                    <span className="label">{S.cert.objectivesCount(d.objectives.length)}</span>
                    <span className="label">
                      {S.cert.examItems(Math.max(1, Math.round((d.weight / 100) * c.items)))}
                    </span>
                    <span className="label">
                      {S.cert.questionsHere(c.questions.filter((q) => q.domain === d.n).length)}
                    </span>
                  </div>
                  <div className="mt-3 h-1 w-full max-w-md overflow-hidden rounded-full" style={{ background: "var(--rule)" }}>
                    <div
                      className="bar-grow h-full rounded-full"
                      style={{
                        width: `${(d.weight / byWeight[0].weight) * 100}%`,
                        background: "var(--clay)",
                        animationDelay: `${i * 60}ms`,
                      }}
                    />
                  </div>
                </div>

                <DomainProgress lang={lang} cert={c.code} domain={d.n} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- perfil + logística ---------- */}
      <section className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
            <h2 className="display text-[1.8rem]">{S.cert.forWhoTitle}</h2>
          </div>
          <p className="mt-5 leading-relaxed">{c.audience}</p>

          <p className="label mt-8">{S.cert.mqcLabel}</p>
          <p className="mt-2.5 leading-relaxed" style={{ color: "var(--muted)" }}>
            {c.mqc}
          </p>

          <p className="label mt-8" style={{ color: "var(--carmin)" }}>
            {S.cert.notForLabel}
          </p>
          <p className="mt-2.5 leading-relaxed" style={{ color: "var(--muted)" }}>
            {c.notFor}
          </p>
        </div>

        <div>
          <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
            <h2 className="display text-[1.8rem]">{S.cert.rulesTitle}</h2>
          </div>
          <dl className="mt-5 space-y-5">
            {[
              [S.cert.ruleKeys[0], c.scoring],
              [S.cert.ruleKeys[1], c.retakePolicy],
              [S.cert.ruleKeys[2], c.recertification],
              [S.cert.ruleKeys[3], c.prerequisites],
              [S.cert.ruleKeys[4], c.languages],
            ].map(([k, v]) => (
              <div key={k} className="border-b pb-5 last:border-0" style={{ borderColor: "var(--rule)" }}>
                <dt className="label" style={{ color: "var(--clay)" }}>
                  {k}
                </dt>
                <dd className="mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <Link href={`/${lang}/cert/${c.code}/logistica`} className="btn btn-ghost mt-6 no-underline">
            {S.cert.logisticsCta}
          </Link>
        </div>
      </section>

      {/* ---------- fuentes ---------- */}
      <section className="mt-20 border-t pt-8" style={{ borderColor: "var(--rule)" }}>
        <p className="label">{S.cert.sourceLabel}</p>
        <ul className="mt-3 space-y-1.5 text-sm" style={{ color: "var(--muted)" }}>
          {c.sources.map((src) => (
            <li key={src}>{src}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
