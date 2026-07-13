import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { certs, cert, CERT_META } from "@/lib/content";
import { DomainProgress } from "@/components/DomainProgress";

export const dynamicParams = false;
export const generateStaticParams = () => certs().map((c) => ({ code: c.code }));

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const c = cert(code);
  if (!c) return {};
  return {
    title: `${c.name} (${c.code})`,
    description: `Guía completa en español para ${c.name}: ${c.domains.length} dominios, ${c.stats.questions} preguntas de práctica, simulacro con el blueprint oficial. ${c.items} ítems, ${c.minutes} min, corte 720/1000.`,
  };
}

export default async function CertPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = cert(code);
  if (!c) notFound();
  const m = CERT_META[c.code];
  const byWeight = [...c.domains].sort((a, b) => b.weight - a.weight);
  const top3 = byWeight.slice(0, 3);
  const top3Sum = top3.reduce((s, d) => s + d.weight, 0);

  return (
    <div className="mx-auto max-w-[84rem] px-5 py-14 sm:px-8">
      {/* ---------- encabezado ---------- */}
      <header className="rise">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="label rounded px-2 py-1" style={{ background: "var(--clay-wash)", color: "var(--clay)" }}>
            {c.code}
          </span>
          <span className="label">{m?.level}</span>
          <span className="label">v{c.version} · {c.effective}</span>
        </div>

        <h1 className="display mt-5 text-[clamp(2.2rem,5.5vw,4rem)]">{c.nameEs}</h1>
        <p className="mt-2 text-lg" lang="en" style={{ color: "var(--muted)" }}>
          {c.name}
        </p>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">{m?.tagline}</p>
      </header>

      {/* ---------- ficha técnica ---------- */}
      <dl
        className="rise mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-y py-8 sm:grid-cols-3 lg:grid-cols-6"
        style={{ animationDelay: "80ms", borderColor: "var(--rule)" }}
      >
        {[
          { n: c.items, l: "Ítems" },
          { n: `${c.minutes}′`, l: "Minutos" },
          { n: c.passScaled, l: "Corte escalado" },
          { n: m ? `$${m.feeNum}` : c.fee, l: "Por intento" },
          { n: `${c.validityMonths}m`, l: "Vigencia" },
          { n: c.domains.length, l: "Dominios" },
        ].map((x) => (
          <div key={x.l}>
            <dd className="numeral text-[2.2rem]">{x.n}</dd>
            <dt className="label mt-2">{x.l}</dt>
          </div>
        ))}
      </dl>

      {/* ---------- acciones ---------- */}
      <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "120ms" }}>
        <Link href={`/cert/${c.code}/practica`} className="btn no-underline">
          Practicar · {c.stats.questions} preguntas
        </Link>
        <Link href={`/cert/${c.code}/simulacro`} className="btn btn-ghost no-underline">
          Simulacro cronometrado
        </Link>
        <Link href={`/cert/${c.code}/decodificador`} className="btn btn-ghost no-underline">
          Decodificador del examen
        </Link>
      </div>

      {/* ---------- estrategia: dónde está el examen ---------- */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.6rem,3vw,2.2rem)]">Dónde está realmente el examen</h2>
          <p className="label hidden sm:block">Ordenado por peso</p>
        </div>

        <p className="mt-6 max-w-3xl leading-relaxed" style={{ color: "var(--muted)" }}>
          Tres dominios —{" "}
          <strong style={{ color: "var(--ink)" }}>
            {top3.map((d) => `D${d.n}`).join(", ")}
          </strong>{" "}
          — concentran el <strong style={{ color: "var(--clay)" }}>{top3Sum.toFixed(1).replace(/\.0$/, "")}%</strong> de los
          ítems. Si tu tiempo es limitado, ahí es donde rinde cada hora.
        </p>

        <div className="mt-10 space-y-3">
          {byWeight.map((d, i) => (
            <Link
              key={d.n}
              href={`/cert/${c.code}/dominio/${d.n}`}
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
                  <p className="label">Dominio {d.n}</p>
                </div>

                <div className="min-w-0">
                  <h3 className="display text-[1.35rem]">{d.titleEs}</h3>
                  <p className="mt-0.5 text-sm" lang="en" style={{ color: "var(--muted)" }}>
                    {d.title}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                    <span className="label">{d.objectives.length} objetivos oficiales</span>
                    <span className="label">
                      ≈{Math.max(1, Math.round((d.weight / 100) * c.items))} ítems en el examen
                    </span>
                    <span className="label">
                      {c.questions.filter((q) => q.domain === d.n).length} preguntas aquí
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

                <DomainProgress cert={c.code} domain={d.n} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- perfil + logística ---------- */}
      <section className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
            <h2 className="display text-[1.8rem]">Para quién es</h2>
          </div>
          <p className="mt-5 leading-relaxed">{c.audience}</p>

          <p className="label mt-8">El candidato mínimamente calificado</p>
          <p className="mt-2.5 leading-relaxed" style={{ color: "var(--muted)" }}>
            {c.mqc}
          </p>

          <p className="label mt-8" style={{ color: "var(--carmin)" }}>
            Para quién NO es
          </p>
          <p className="mt-2.5 leading-relaxed" style={{ color: "var(--muted)" }}>
            {c.notFor}
          </p>
        </div>

        <div>
          <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
            <h2 className="display text-[1.8rem]">Reglas del juego</h2>
          </div>
          <dl className="mt-5 space-y-5">
            {[
              ["Puntuación", c.scoring],
              ["Reintentos", c.retakePolicy],
              ["Recertificación", c.recertification],
              ["Prerrequisitos", c.prerequisites],
              ["Idioma", c.languages],
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
          <Link href={`/cert/${c.code}/logistica`} className="btn btn-ghost mt-6 no-underline">
            Registro, Pearson VUE y día del examen →
          </Link>
        </div>
      </section>

      {/* ---------- fuentes ---------- */}
      <section className="mt-20 border-t pt-8" style={{ borderColor: "var(--rule)" }}>
        <p className="label">Fuente</p>
        <ul className="mt-3 space-y-1.5 text-sm" style={{ color: "var(--muted)" }}>
          {c.sources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
