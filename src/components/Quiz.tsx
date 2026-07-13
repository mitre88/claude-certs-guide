"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/content";
import { useProgress, estimateScaled } from "@/lib/progress";

type Mode = "practice" | "mock";

const DIFF: Record<string, string> = { easy: "Fácil", medium: "Media", hard: "Difícil" };

function shuffle<T>(arr: T[], seed: number): T[] {
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function Quiz({
  questions,
  mode,
  cert,
  minutes,
  passScaled = 720,
  domainTitles,
}: {
  questions: Question[];
  mode: Mode;
  cert: string;
  minutes?: number;
  passScaled?: number;
  domainTitles: Record<number, string>;
}) {
  const { recordAttempt, recordMock } = useProgress();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [left, setLeft] = useState((minutes ?? 0) * 60);
  const started = useRef(Date.now());
  const recorded = useRef(false);

  const q = questions[idx];
  const total = questions.length;

  // El temporizador solo existe en simulacro.
  useEffect(() => {
    if (mode !== "mock" || done || !minutes) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setDone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mode, done, minutes]);

  const isCorrect = (qq: Question, sel: string[] = []) =>
    sel.length === qq.correct.length && qq.correct.every((k) => sel.includes(k));

  const score = useMemo(() => {
    const byDomain: Record<number, { total: number; correct: number }> = {};
    let correct = 0;
    for (const qq of questions) {
      const ok = isCorrect(qq, picked[qq.id]);
      if (ok) correct++;
      byDomain[qq.domain] ??= { total: 0, correct: 0 };
      byDomain[qq.domain].total++;
      if (ok) byDomain[qq.domain].correct++;
    }
    return { correct, total, byDomain, scaled: estimateScaled(correct, total) };
  }, [questions, picked, total]);

  useEffect(() => {
    if (mode !== "mock" || !done || recorded.current) return;
    recorded.current = true;
    for (const qq of questions) {
      if (picked[qq.id]?.length) {
        recordAttempt({ qid: qq.id, cert, domain: qq.domain, correct: isCorrect(qq, picked[qq.id]) });
      }
    }
    recordMock({
      cert,
      total,
      correct: score.correct,
      scaled: score.scaled,
      seconds: Math.round((Date.now() - started.current) / 1000),
      byDomain: score.byDomain,
    });
  }, [done, mode, questions, picked, cert, total, score, recordAttempt, recordMock]);

  if (!total) {
    return (
      <p className="card p-8 text-center" style={{ color: "var(--muted)" }}>
        No hay preguntas disponibles para esta selección.
      </p>
    );
  }

  const select = (key: string) => {
    if (mode === "practice" && revealed[q.id]) return;
    const cur = picked[q.id] ?? [];
    if (q.type === "multiple-response") {
      setPicked({ ...picked, [q.id]: cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key] });
    } else {
      setPicked({ ...picked, [q.id]: [key] });
    }
  };

  const reveal = () => {
    setRevealed({ ...revealed, [q.id]: true });
    recordAttempt({ qid: q.id, cert, domain: q.domain, correct: isCorrect(q, picked[q.id]) });
  };

  const next = () => (idx < total - 1 ? setIdx(idx + 1) : setDone(true));

  // ---------- informe final ----------
  if (done) {
    const passed = score.scaled >= passScaled;
    const mins = Math.floor((Date.now() - started.current) / 60000);
    return (
      <div className="rise space-y-8">
        <div className="card p-8 sm:p-10">
          <p className="label">{mode === "mock" ? "Resultado del simulacro" : "Resultado de la sesión"}</p>
          <div className="mt-5 flex flex-wrap items-end gap-x-10 gap-y-6">
            <div>
              <p className="numeral text-[clamp(3.5rem,10vw,6rem)]" style={{ color: passed ? "var(--verde)" : "var(--carmin)" }}>
                {score.scaled}
              </p>
              <p className="label mt-2">Escalado estimado · 100–1000</p>
            </div>
            <div>
              <p className="numeral text-[clamp(2rem,5vw,3rem)]">
                {score.correct}
                <span style={{ color: "var(--muted)" }}>/{total}</span>
              </p>
              <p className="label mt-2">
                Aciertos · {Math.round((score.correct / total) * 100)}% crudo
              </p>
            </div>
            <div>
              <p className="numeral text-[clamp(2rem,5vw,3rem)]">{mins}′</p>
              <p className="label mt-2">Tiempo empleado</p>
            </div>
          </div>

          <div
            className="mt-8 border-l-2 p-4 text-sm"
            style={{
              borderColor: passed ? "var(--verde)" : "var(--carmin)",
              background: passed ? "var(--verde-wash)" : "var(--carmin-wash)",
            }}
          >
            <p className="font-bold">
              {passed
                ? `Por encima del corte (${passScaled}) en esta simulación.`
                : `Por debajo del corte (${passScaled}) en esta simulación.`}
            </p>
            <p className="mt-1.5" style={{ color: "var(--muted)" }}>
              Anthropic no publica el mapeo de aciertos crudos a escala 100–1000, así que este número es una
              <strong> estimación lineal</strong>, no una predicción. Trátalo como semáforo, no como veredicto: apunta a
              ≥80% crudo antes de pagar el examen.
            </p>
          </div>
        </div>

        <div className="card p-8 sm:p-10">
          <p className="label mb-6">Desglose por dominio</p>
          <div className="space-y-5">
            {Object.entries(score.byDomain)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([d, s]) => {
                const pct = Math.round((s.correct / s.total) * 100);
                const weak = pct < 70;
                return (
                  <div key={d}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-sm font-bold">
                        <span className="label mr-2">D{d}</span>
                        {domainTitles[Number(d)]}
                      </p>
                      <p className="label shrink-0" style={{ color: weak ? "var(--carmin)" : "var(--verde)" }}>
                        {s.correct}/{s.total} · {pct}%
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--rule)" }}>
                      <div
                        className="bar-grow h-full rounded-full"
                        style={{ width: `${pct}%`, background: weak ? "var(--carmin)" : "var(--verde)" }}
                      />
                    </div>
                    {weak && (
                      <Link
                        href={`/cert/${cert}/dominio/${d}`}
                        className="label mt-1.5 inline-block no-underline"
                        style={{ color: "var(--clay)" }}
                      >
                        → Repasar el capítulo del dominio {d}
                      </Link>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="card p-8 sm:p-10">
          <p className="label mb-6">Revisión de las {total} preguntas</p>
          <div className="space-y-8">
            {questions.map((qq, i) => (
              <Review key={qq.id} q={qq} n={i + 1} sel={picked[qq.id] ?? []} ok={isCorrect(qq, picked[qq.id])} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="btn" onClick={() => location.reload()}>
            Otra ronda
          </button>
          <Link href={`/cert/${cert}`} className="btn btn-ghost no-underline">
            Volver a {cert}
          </Link>
        </div>
      </div>
    );
  }

  // ---------- pregunta activa ----------
  const sel = picked[q.id] ?? [];
  const shown = mode === "practice" && revealed[q.id];
  const answered = questions.filter((x) => (picked[x.id] ?? []).length > 0).length;
  const timeLow = mode === "mock" && left < 300;
  const optionOrder = mode === "mock" ? shuffle(q.options, q.id.length * 7919) : q.options;

  return (
    <div className="space-y-6">
      {/* barra de estado */}
      <div className="card flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3.5">
        <p className="label">
          {idx + 1} <span style={{ color: "var(--rule)" }}>/</span> {total}
        </p>
        <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: "var(--rule)", minWidth: "6rem" }}>
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${((idx + 1) / total) * 100}%`, background: "var(--clay)" }}
          />
        </div>
        {mode === "mock" && minutes ? (
          <p
            className="label tabular-nums"
            style={{ color: timeLow ? "var(--carmin)" : "var(--muted)", fontWeight: timeLow ? 700 : 500 }}
            aria-live={timeLow ? "polite" : "off"}
          >
            {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
          </p>
        ) : null}
        {mode === "mock" && <p className="label">{answered} respondidas</p>}
        <button
          onClick={() => setFlagged({ ...flagged, [q.id]: !flagged[q.id] })}
          className="label transition-colors hover:text-[var(--clay)]"
          style={{ color: flagged[q.id] ? "var(--clay)" : "var(--muted)" }}
        >
          {flagged[q.id] ? "◆ Marcada" : "◇ Marcar"}
        </button>
      </div>

      {/* pregunta */}
      <article key={q.id} className="card rise p-6 sm:p-9">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className="label rounded px-2 py-1"
            style={{ background: "var(--clay-wash)", color: "var(--clay)" }}
          >
            D{q.domain} · {domainTitles[q.domain]}
          </span>
          {q.source === "official" && (
            <span
              className="label rounded px-2 py-1"
              style={{ background: "var(--verde-wash)", color: "var(--verde)" }}
              title="Pregunta de ejemplo publicada por Anthropic en el exam guide oficial"
            >
              ★ Oficial
            </span>
          )}
          <span className="label">{DIFF[q.difficulty] ?? q.difficulty}</span>
          {q.type === "multiple-response" && (
            <span className="label" style={{ color: "var(--clay)" }}>
              Respuesta múltiple
            </span>
          )}
        </div>

        {q.scenario && (
          <p className="label mt-5" style={{ color: "var(--muted)" }}>
            Escenario: {q.scenario}
          </p>
        )}

        <p className="mt-4 text-[1.15rem] leading-[1.6]" lang="en">
          {q.stem}
        </p>

        <div className="mt-7 space-y-2.5" role={q.type === "multiple-choice" ? "radiogroup" : "group"}>
          {optionOrder.map((o) => {
            const chosen = sel.includes(o.key);
            const right = q.correct.includes(o.key);
            let border = "var(--rule)";
            let bg = "transparent";
            if (shown && right) {
              border = "var(--verde)";
              bg = "var(--verde-wash)";
            } else if (shown && chosen && !right) {
              border = "var(--carmin)";
              bg = "var(--carmin-wash)";
            } else if (chosen) {
              border = "var(--clay)";
              bg = "var(--clay-wash)";
            }
            return (
              <button
                key={o.key}
                onClick={() => select(o.key)}
                disabled={shown}
                role={q.type === "multiple-choice" ? "radio" : "checkbox"}
                aria-checked={chosen}
                className="flex w-full gap-3.5 rounded border p-3.5 text-left transition-all duration-150 disabled:cursor-default"
                style={{ borderColor: border, background: bg }}
              >
                <span
                  className="label mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[3px] border"
                  style={{
                    borderColor: chosen || (shown && right) ? "currentColor" : "var(--rule)",
                    color: shown && right ? "var(--verde)" : shown && chosen ? "var(--carmin)" : chosen ? "var(--clay)" : "var(--muted)",
                    fontWeight: 700,
                  }}
                >
                  {shown && right ? "✓" : shown && chosen ? "✕" : o.key}
                </span>
                <span className="text-[0.97rem] leading-relaxed" lang="en">
                  {o.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* explicación (solo práctica) */}
        {shown && (
          <div className="rise mt-7 border-t pt-6" style={{ borderColor: "var(--rule)" }}>
            <p
              className="label"
              style={{ color: isCorrect(q, sel) ? "var(--verde)" : "var(--carmin)" }}
            >
              {isCorrect(q, sel) ? "Correcto" : `Incorrecto — la respuesta es ${q.correct.join(" + ")}`}
            </p>
            <p className="mt-3 leading-relaxed">{q.explanationEs}</p>

            {q.officialRationale && (
              <p className="mt-3 border-l-2 pl-3.5 text-sm italic" style={{ borderColor: "var(--verde)", color: "var(--muted)" }} lang="en">
                Justificación oficial de Anthropic: {q.officialRationale}
              </p>
            )}

            {Object.keys(q.distractorsEs).length > 0 && (
              <div className="mt-5">
                <p className="label mb-2.5">Por qué fallan las otras</p>
                <ul className="space-y-2 text-sm">
                  {Object.entries(q.distractorsEs).map(([k, why]) => (
                    <li key={k} className="flex gap-2.5">
                      <span className="label shrink-0" style={{ color: "var(--carmin)" }}>
                        {k}
                      </span>
                      <span style={{ color: "var(--muted)" }}>{why}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {q.trap && (
              <p className="label mt-5" style={{ color: "var(--clay)" }}>
                Trampa: {q.trap}
              </p>
            )}
            {q.objective && (
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }} lang="en">
                Objetivo medido: {q.objective}
              </p>
            )}
          </div>
        )}
      </article>

      {/* controles */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-ghost" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
          ← Anterior
        </button>

        {mode === "practice" && !shown ? (
          <button className="btn" onClick={reveal} disabled={!sel.length}>
            Comprobar
          </button>
        ) : (
          <button className="btn" onClick={next}>
            {idx === total - 1 ? "Terminar y ver informe" : "Siguiente →"}
          </button>
        )}

        {mode === "mock" && (
          <button
            className="btn btn-ghost ml-auto"
            onClick={() => {
              if (confirm(`Entregar el simulacro con ${answered} de ${total} respondidas?`)) setDone(true);
            }}
          >
            Entregar
          </button>
        )}
      </div>

      {/* navegador de ítems (simulacro) */}
      {mode === "mock" && (
        <div className="card p-4">
          <p className="label mb-3">Navegación</p>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((qq, i) => {
              const has = (picked[qq.id] ?? []).length > 0;
              return (
                <button
                  key={qq.id}
                  onClick={() => setIdx(i)}
                  className="label grid h-7 w-7 place-items-center rounded-[3px] border transition-colors"
                  style={{
                    borderColor: i === idx ? "var(--clay)" : "var(--rule)",
                    background: has ? "var(--clay-wash)" : "transparent",
                    color: flagged[qq.id] ? "var(--clay)" : has ? "var(--ink)" : "var(--muted)",
                    fontWeight: i === idx ? 700 : 500,
                  }}
                  aria-label={`Ir a la pregunta ${i + 1}${has ? " (respondida)" : ""}`}
                >
                  {flagged[qq.id] ? "◆" : i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Review({ q, n, sel, ok }: { q: Question; n: number; sel: string[]; ok: boolean }) {
  const [open, setOpen] = useState(!ok);
  return (
    <div className="border-l-2 pl-4" style={{ borderColor: ok ? "var(--verde)" : "var(--carmin)" }}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-start gap-3 text-left">
        <span className="label shrink-0" style={{ color: ok ? "var(--verde)" : "var(--carmin)" }}>
          {n} {ok ? "✓" : "✕"}
        </span>
        <span className="flex-1 text-sm leading-relaxed" lang="en">
          {q.stem.length > 150 && !open ? q.stem.slice(0, 150) + "…" : q.stem}
        </span>
      </button>
      {open && (
        <div className="mt-3 space-y-2 text-sm">
          {q.options.map((o) => {
            const right = q.correct.includes(o.key);
            const chosen = sel.includes(o.key);
            return (
              <p
                key={o.key}
                className="flex gap-2"
                style={{ color: right ? "var(--verde)" : chosen ? "var(--carmin)" : "var(--muted)" }}
                lang="en"
              >
                <span className="label shrink-0" style={{ color: "inherit" }}>
                  {right ? "✓" : chosen ? "✕" : o.key}
                </span>
                {o.text}
              </p>
            );
          })}
          <p className="pt-2 leading-relaxed">{q.explanationEs}</p>
        </div>
      )}
    </div>
  );
}
