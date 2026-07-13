"use client";

import Link from "next/link";
import { useProgress, accuracy } from "@/lib/progress";
import { certs, CERT_META } from "@/lib/content";

export function ProgressDashboard() {
  const { progress, ready, reset } = useProgress();
  const list = certs();

  if (!ready) return <div className="mt-14 h-40" />;

  const hasData = progress.attempts.length > 0 || progress.readDomains.length > 0;
  if (!hasData) {
    return (
      <section className="card mt-14 p-8 text-center sm:p-10">
        <p className="display text-xl">Tu progreso aparecerá aquí</p>
        <p className="mx-auto mt-3 max-w-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          En cuanto respondas la primera pregunta o marques un capítulo como leído, este panel se llena: precisión por
          dominio, capítulos cubiertos, historial de simulacros. Todo vive en tu navegador — sin cuenta, sin servidor.
        </p>
        <Link href="/cert/CCAO-F/practica" className="btn mt-6 no-underline">
          Responder la primera
        </Link>
      </section>
    );
  }

  const totalDomains = list.reduce((s, c) => s + c.domains.length, 0);

  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
        <h2 className="display text-[clamp(1.6rem,3vw,2.2rem)]">Tu progreso</h2>
        <button
          className="label transition-colors hover:text-[var(--carmin)]"
          onClick={() => {
            if (confirm("¿Borrar todo tu progreso? No se puede deshacer.")) reset();
          }}
        >
          Borrar todo
        </button>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
        {[
          { n: progress.attempts.length, l: "Preguntas respondidas" },
          {
            n: (() => {
              const a = accuracy(progress.attempts);
              return a ? `${Math.round((a.correct / a.total) * 100)}%` : "—";
            })(),
            l: "Precisión global",
          },
          { n: `${progress.readDomains.length}/${totalDomains}`, l: "Capítulos leídos" },
          { n: progress.mocks.length, l: "Simulacros" },
        ].map((x) => (
          <div key={x.l}>
            <dd className="numeral text-[2.6rem]">{x.n}</dd>
            <dt className="label mt-2">{x.l}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-10 space-y-4">
        {list.map((c) => {
          const acc = accuracy(progress.attempts, c.code);
          const read = c.domains.filter((d) => progress.readDomains.includes(`${c.code}:${d.n}`)).length;
          const lastMock = progress.mocks.filter((m) => m.cert === c.code).slice(-1)[0];
          const pct = acc ? Math.round((acc.correct / acc.total) * 100) : null;

          if (!acc && read === 0) return null;

          return (
            <Link key={c.code} href={`/cert/${c.code}`} className="card block p-5 no-underline transition-transform hover:-translate-y-0.5 sm:p-6">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <p className="display w-40 text-lg">
                  {CERT_META[c.code]?.role}
                  <span className="label ml-2">{c.code}</span>
                </p>

                <div className="flex-1" style={{ minWidth: "12rem" }}>
                  <div className="flex justify-between">
                    <span className="label">Capítulos</span>
                    <span className="label">
                      {read}/{c.domains.length}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full" style={{ background: "var(--rule)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(read / c.domains.length) * 100}%`, background: "var(--clay)" }}
                    />
                  </div>
                </div>

                {pct !== null && (
                  <p
                    className="label tabular-nums"
                    style={{ color: pct >= 80 ? "var(--verde)" : pct >= 60 ? "var(--clay)" : "var(--carmin)" }}
                  >
                    {pct}% de {acc!.total}
                  </p>
                )}

                {lastMock && (
                  <p
                    className="numeral text-[1.5rem]"
                    style={{ color: lastMock.scaled >= c.passScaled ? "var(--verde)" : "var(--carmin)" }}
                    title="Último simulacro (escalado estimado)"
                  >
                    {lastMock.scaled}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
