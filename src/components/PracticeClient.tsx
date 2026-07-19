"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Question } from "@/lib/content";
import { Quiz } from "@/components/Quiz";
import { useProgress, accuracy } from "@/lib/progress";
import { t, type Lang } from "@/lib/i18n";

type D = { n: number; titleEs: string; weight: number };

function Setup({
  lang,
  cert,
  certName,
  questions,
  domains,
}: {
  lang: Lang;
  cert: string;
  certName: string;
  questions: Question[];
  domains: D[];
}) {
  const S = t(lang);
  const sp = useSearchParams();
  const preset = sp.get("dominio");
  const { progress, ready } = useProgress();

  const [selected, setSelected] = useState<number[]>(preset ? [Number(preset)] : domains.map((d) => d.n));
  const [size, setSize] = useState(20);
  const [only, setOnly] = useState<"all" | "unseen" | "failed" | "official">("all");
  const [running, setRunning] = useState(false);

  const seenIds = new Set(progress.attempts.map((a) => a.qid));
  const failedIds = new Set(progress.attempts.filter((a) => !a.correct).map((a) => a.qid));

  const pool = useMemo(() => {
    let p = questions.filter((q) => selected.includes(q.domain));
    if (only === "unseen") p = p.filter((q) => !seenIds.has(q.id));
    if (only === "failed") p = p.filter((q) => failedIds.has(q.id));
    if (only === "official") p = p.filter((q) => q.source === "official");
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, selected, only, progress.attempts]);

  const picked = useMemo(() => {
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(size, shuffled.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, size, running]);

  const titles = Object.fromEntries(domains.map((d) => [d.n, d.titleEs]));

  if (running) {
    return (
      <>
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="display text-[clamp(1.6rem,3vw,2.2rem)]">{S.practice.titleRunning(cert)}</h1>
          <button className="label transition-colors hover:text-[var(--clay)]" onClick={() => setRunning(false)}>
            {S.practice.changeSelection}
          </button>
        </div>
        <Quiz lang={lang} questions={picked} mode="practice" cert={cert} domainTitles={titles} />
      </>
    );
  }

  const toggle = (n: number) =>
    setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));

  const FILTERS: { k: typeof only; label: string; count: number }[] = [
    { k: "all", label: S.practice.filters.all, count: questions.filter((q) => selected.includes(q.domain)).length },
    {
      k: "unseen",
      label: S.practice.filters.unseen,
      count: questions.filter((q) => selected.includes(q.domain) && !seenIds.has(q.id)).length,
    },
    {
      k: "failed",
      label: S.practice.filters.failed,
      count: questions.filter((q) => selected.includes(q.domain) && failedIds.has(q.id)).length,
    },
    {
      k: "official",
      label: S.practice.filters.official,
      count: questions.filter((q) => selected.includes(q.domain) && q.source === "official").length,
    },
  ];

  return (
    <>
      <header className="rise">
        <nav className="label mb-6">
          <Link href={`/${lang}/cert/${cert}`} className="no-underline hover:text-[var(--clay)]">
            {cert}
          </Link>
          <span className="mx-2" style={{ color: "var(--rule)" }}>
            /
          </span>
          {S.practice.breadcrumb}
        </nav>
        <h1 className="display text-[clamp(2rem,4.5vw,3.2rem)]">{S.practice.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          {S.practice.sub(certName)}
        </p>
      </header>

      <div className="rise mt-10 grid gap-6 lg:grid-cols-[1fr_20rem]" style={{ animationDelay: "80ms" }}>
        <div className="card p-6 sm:p-8">
          <p className="label">{S.practice.domainsKicker}</p>
          <div className="mt-4 space-y-1.5">
            {domains.map((d) => {
              const on = selected.includes(d.n);
              const acc = ready ? accuracy(progress.attempts, cert, d.n) : null;
              const pct = acc ? Math.round((acc.correct / acc.total) * 100) : null;
              return (
                <button
                  key={d.n}
                  onClick={() => toggle(d.n)}
                  className="flex w-full items-center gap-3.5 rounded border p-3 text-left transition-colors"
                  style={{
                    borderColor: on ? "var(--clay)" : "var(--rule)",
                    background: on ? "var(--clay-wash)" : "transparent",
                  }}
                  aria-pressed={on}
                >
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-[3px] border text-[0.65rem] font-bold"
                    style={{
                      borderColor: on ? "var(--clay)" : "var(--rule)",
                      background: on ? "var(--clay)" : "transparent",
                      color: on ? "#fffdf8" : "transparent",
                      fontFamily: "var(--font-mono)",
                    }}
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label mr-2">D{d.n}</span>
                    <span className="text-sm font-bold">{d.titleEs}</span>
                  </span>
                  <span className="label shrink-0">{d.weight}%</span>
                  {pct !== null && (
                    <span
                      className="label shrink-0 tabular-nums"
                      style={{ color: pct >= 80 ? "var(--verde)" : pct >= 60 ? "var(--clay)" : "var(--carmin)" }}
                    >
                      {pct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex gap-2">
            <button className="label transition-colors hover:text-[var(--clay)]" onClick={() => setSelected(domains.map((d) => d.n))}>
              {S.practice.all}
            </button>
            <span style={{ color: "var(--rule)" }}>·</span>
            <button className="label transition-colors hover:text-[var(--clay)]" onClick={() => setSelected([])}>
              {S.practice.none}
            </button>
            <span style={{ color: "var(--rule)" }}>·</span>
            <button
              className="label transition-colors hover:text-[var(--clay)]"
              onClick={() =>
                setSelected(
                  [...domains].sort((a, b) => b.weight - a.weight).slice(0, 3).map((d) => d.n),
                )
              }
              title={S.practice.top3Title}
            >
              {S.practice.top3}
            </button>
          </div>
        </div>

        <div className="card h-fit p-6">
          <p className="label">{S.practice.filterKicker}</p>
          <div className="mt-3 space-y-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.k}
                onClick={() => setOnly(f.k)}
                disabled={f.count === 0 && f.k !== "all"}
                className="flex w-full items-center justify-between rounded border px-3 py-2 text-sm transition-colors disabled:opacity-35"
                style={{
                  borderColor: only === f.k ? "var(--clay)" : "var(--rule)",
                  background: only === f.k ? "var(--clay-wash)" : "transparent",
                }}
                suppressHydrationWarning
              >
                <span>{f.label}</span>
                <span className="label" suppressHydrationWarning>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <p className="label mt-6">{S.practice.howMany}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[10, 20, 40, pool.length].map((n, i) => {
              const label = i === 3 ? S.practice.allSizeLabel : String(n);
              const active = size === n;
              if (i === 3 && pool.length <= 40) return null;
              return (
                <button
                  key={label}
                  onClick={() => setSize(n)}
                  disabled={n === 0}
                  className="label rounded border px-3 py-1.5 transition-colors disabled:opacity-35"
                  style={{
                    borderColor: active ? "var(--clay)" : "var(--rule)",
                    background: active ? "var(--clay-wash)" : "transparent",
                    color: active ? "var(--clay)" : "var(--muted)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--rule)" }}>
            <p className="numeral text-[2.6rem]" suppressHydrationWarning>
              {Math.min(size, pool.length)}
            </p>
            <p className="label mt-1.5" suppressHydrationWarning>
              {S.practice.inSession(pool.length)}
            </p>
            <button
              className="btn mt-5 w-full justify-center"
              onClick={() => setRunning(true)}
              disabled={pool.length === 0}
              suppressHydrationWarning
            >
              {S.practice.start}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function PracticeClient(props: {
  lang: Lang;
  cert: string;
  certName: string;
  questions: Question[];
  domains: D[];
}) {
  return (
    <div className="mx-auto max-w-[64rem] px-5 py-12 sm:px-8">
      <Suspense fallback={<p className="label">{t(props.lang).practice.loading}</p>}>
        <Setup {...props} />
      </Suspense>
    </div>
  );
}
