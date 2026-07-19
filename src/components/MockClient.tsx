"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/content";
import { Quiz } from "@/components/Quiz";
import { useProgress } from "@/lib/progress";
import { t, LANG_TAGS, type Lang } from "@/lib/i18n";

type D = { n: number; titleEs: string; weight: number };
type BP = { n: number; weight: number; items: number };

export function MockClient({
  lang,
  cert,
  certName,
  minutes,
  passScaled,
  questions,
  blueprint,
  domains,
}: {
  lang: Lang;
  cert: string;
  certName: string;
  items: number;
  minutes: number;
  passScaled: number;
  questions: Question[];
  blueprint: BP[];
  domains: D[];
}) {
  const S = t(lang);
  const [running, setRunning] = useState(false);
  const [seed, setSeed] = useState(1);
  const { progress, ready } = useProgress();

  const exam = useMemo(() => {
    let s = (Date.now() + seed) >>> 0;
    const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
    const out: Question[] = [];
    for (const b of blueprint) {
      const pool = [...questions.filter((q) => q.domain === b.n)];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      out.push(...pool.slice(0, Math.min(b.items, pool.length)));
    }
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }, [questions, blueprint, seed]);

  const titles = Object.fromEntries(domains.map((d) => [d.n, d.titleEs]));
  const history = ready ? progress.mocks.filter((m) => m.cert === cert).slice().reverse() : [];
  const shortfall = blueprint.filter((b) => questions.filter((q) => q.domain === b.n).length < b.items);

  if (running) {
    return (
      <div className="mx-auto max-w-[64rem] px-5 py-12 sm:px-8">
        <Quiz
          lang={lang}
          questions={exam}
          mode="mock"
          cert={cert}
          minutes={minutes}
          passScaled={passScaled}
          domainTitles={titles}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[64rem] px-5 py-12 sm:px-8">
      <nav className="label mb-6">
        <Link href={`/${lang}/cert/${cert}`} className="no-underline hover:text-[var(--clay)]">
          {cert}
        </Link>
        <span className="mx-2" style={{ color: "var(--rule)" }}>
          /
        </span>
        {S.mock.breadcrumb}
      </nav>

      <header className="rise">
        <h1 className="display text-[clamp(2rem,4.5vw,3.2rem)]">{S.mock.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          {S.mock.sub(exam.length, certName, minutes)}
        </p>
      </header>

      <div className="rise mt-10 grid gap-6 lg:grid-cols-[1fr_18rem]" style={{ animationDelay: "80ms" }}>
        <div className="card p-6 sm:p-8">
          <p className="label">{S.mock.mixKicker}</p>
          <div className="mt-5 space-y-4">
            {blueprint.map((b) => {
              const d = domains.find((x) => x.n === b.n)!;
              const have = questions.filter((q) => q.domain === b.n).length;
              const actual = Math.min(b.items, have);
              return (
                <div key={b.n}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm">
                      <span className="label mr-2">D{b.n}</span>
                      <span className="font-bold">{d.titleEs}</span>
                    </p>
                    <p className="label shrink-0 tabular-nums">{S.mock.itemsPct(actual, b.weight)}</p>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full" style={{ background: "var(--rule)" }}>
                    <div
                      className="bar-grow h-full rounded-full"
                      style={{ width: `${b.weight}%`, background: "var(--clay)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {shortfall.length > 0 && (
            <p
              className="mt-6 border-l-2 p-3 text-sm"
              style={{ borderColor: "var(--clay)", background: "var(--clay-wash)", color: "var(--muted)" }}
            >
              {S.mock.shortfall(shortfall.map((b) => `D${b.n}`).join(", "))}
            </p>
          )}
        </div>

        <div className="card h-fit p-6">
          <dl className="space-y-3.5 text-sm">
            {[
              [S.mock.stats.items, String(exam.length)],
              [S.mock.stats.time, S.mock.stats.timeValue(minutes)],
              [S.mock.stats.pass, `${passScaled} / 1000`],
              [S.mock.stats.feedback, S.mock.stats.feedbackValue],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt style={{ color: "var(--muted)" }}>{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <button
            className="btn mt-6 w-full justify-center"
            onClick={() => {
              setSeed((s) => s + 1);
              setRunning(true);
            }}
          >
            {S.mock.start}
          </button>
          <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
            {S.mock.timerNote(minutes)}
          </p>
        </div>
      </div>

      {history.length > 0 && (
        <section className="mt-14">
          <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
            <h2 className="display text-[1.7rem]">{S.mock.historyTitle}</h2>
          </div>
          <div className="mt-6 space-y-2">
            {history.map((m, i) => {
              const passed = m.scaled >= passScaled;
              return (
                <div key={m.at} className="card flex flex-wrap items-center gap-x-8 gap-y-2 p-4">
                  <p className="numeral text-[1.8rem]" style={{ color: passed ? "var(--verde)" : "var(--carmin)" }}>
                    {m.scaled}
                  </p>
                  <p className="label">{S.mock.raw(m.correct, m.total, Math.round((m.correct / m.total) * 100))}</p>
                  <p className="label">{S.mock.minutes(Math.round(m.seconds / 60))}</p>
                  <p className="label ml-auto">
                    {new Date(m.at).toLocaleDateString(LANG_TAGS[lang], { day: "numeric", month: "short" })}
                    {i === 0 && history.length > 1 && (
                      <span
                        className="ml-2"
                        style={{ color: m.scaled >= history[1].scaled ? "var(--verde)" : "var(--carmin)" }}
                      >
                        {m.scaled >= history[1].scaled ? "▲" : "▼"} {Math.abs(m.scaled - history[1].scaled)}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
