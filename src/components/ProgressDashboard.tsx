"use client";

import Link from "next/link";
import { useProgress, accuracy } from "@/lib/progress";
import { t, CERT_ROLES, type Lang } from "@/lib/i18n";

/**
 * Recibe la lista de certs recortada vía props desde la página server —
 * importar lib/content aquí arrastraría los cuatro bundles completos al
 * JS del cliente.
 */
export type DashCert = { code: string; passScaled: number; domainNs: number[] };

export function ProgressDashboard({ lang, list }: { lang: Lang; list: DashCert[] }) {
  const S = t(lang);
  const { progress, ready, reset } = useProgress();

  if (!ready) return <div className="mt-14 h-40" />;

  const hasData = progress.attempts.length > 0 || progress.readDomains.length > 0;
  if (!hasData) {
    return (
      <section className="card mt-14 p-8 text-center sm:p-10">
        <p className="display text-xl">{S.dash.emptyTitle}</p>
        <p className="mx-auto mt-3 max-w-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          {S.dash.emptyPara}
        </p>
        <Link href={`/${lang}/cert/CCAO-F/practica`} className="btn mt-6 no-underline">
          {S.dash.emptyCta}
        </Link>
      </section>
    );
  }

  const totalDomains = list.reduce((s, c) => s + c.domainNs.length, 0);

  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
        <h2 className="display text-[clamp(1.6rem,3vw,2.2rem)]">{S.dash.title}</h2>
        <button
          className="label transition-colors hover:text-[var(--carmin)]"
          onClick={() => {
            if (confirm(S.dash.confirmClear)) reset();
          }}
        >
          {S.dash.clear}
        </button>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
        {[
          { n: String(progress.attempts.length), l: S.dash.statAnswered },
          {
            n: (() => {
              const a = accuracy(progress.attempts);
              return a ? `${Math.round((a.correct / a.total) * 100)}%` : "—";
            })(),
            l: S.dash.statAccuracy,
          },
          { n: `${progress.readDomains.length}/${totalDomains}`, l: S.dash.statChapters },
          { n: String(progress.mocks.length), l: S.dash.statMocks },
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
          const read = c.domainNs.filter((n) => progress.readDomains.includes(`${c.code}:${n}`)).length;
          const lastMock = progress.mocks.filter((m) => m.cert === c.code).slice(-1)[0];
          const pct = acc ? Math.round((acc.correct / acc.total) * 100) : null;

          if (!acc && read === 0) return null;

          return (
            <Link key={c.code} href={`/${lang}/cert/${c.code}`} className="card block p-5 no-underline transition-transform hover:-translate-y-0.5 sm:p-6">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <p className="display w-40 text-lg">
                  {CERT_ROLES[c.code]}
                  <span className="label ml-2">{c.code}</span>
                </p>

                <div className="flex-1" style={{ minWidth: "12rem" }}>
                  <div className="flex justify-between">
                    <span className="label">{S.dash.chapters}</span>
                    <span className="label">
                      {read}/{c.domainNs.length}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full" style={{ background: "var(--rule)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(read / c.domainNs.length) * 100}%`, background: "var(--clay)" }}
                    />
                  </div>
                </div>

                {pct !== null && (
                  <p
                    className="label tabular-nums"
                    style={{ color: pct >= 80 ? "var(--verde)" : pct >= 60 ? "var(--clay)" : "var(--carmin)" }}
                  >
                    {S.dash.pctOf(pct, acc!.total)}
                  </p>
                )}

                {lastMock && (
                  <p
                    className="numeral text-[1.5rem]"
                    style={{ color: lastMock.scaled >= c.passScaled ? "var(--verde)" : "var(--carmin)" }}
                    title={S.dash.lastMockTitle}
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
