"use client";

import { useProgress } from "@/lib/progress";

export function Checklist({ items, cert, domain }: { items: string[]; cert: string; domain: number }) {
  const { progress, ready, toggleCheck } = useProgress();
  const checked = (i: number) => progress.checked.includes(`${cert}:${domain}:${i}`);
  const done = ready ? items.filter((_, i) => checked(i)).length : 0;
  const pct = Math.round((done / items.length) * 100);

  return (
    <section className="card mt-14 p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="label" style={{ color: "var(--clay)" }}>
          Checklist de dominio
        </p>
        <p className="label" suppressHydrationWarning>
          {done} / {items.length} {done === items.length && items.length > 0 ? "· dominado" : ""}
        </p>
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full" style={{ background: "var(--rule)" }}>
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: pct === 100 ? "var(--verde)" : "var(--clay)" }}
          suppressHydrationWarning
        />
      </div>

      <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
        Si no puedes marcar una casilla con honestidad, ahí está tu siguiente hora de estudio.
      </p>

      <ul className="mt-6 space-y-1">
        {items.map((it, i) => {
          const on = ready && checked(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggleCheck(cert, domain, i)}
                className="flex w-full items-start gap-3 rounded p-2.5 text-left transition-colors hover:bg-[var(--clay-wash)]"
                aria-pressed={on}
              >
                <span
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[3px] border text-[0.65rem] font-bold transition-colors"
                  style={{
                    borderColor: on ? "var(--verde)" : "var(--rule)",
                    background: on ? "var(--verde)" : "transparent",
                    color: on ? "var(--surface)" : "transparent",
                    fontFamily: "var(--font-mono)",
                  }}
                  aria-hidden
                  suppressHydrationWarning
                >
                  ✓
                </span>
                <span
                  className="text-[0.95rem] leading-relaxed"
                  style={{ color: on ? "var(--muted)" : "var(--ink)", textDecoration: on ? "line-through" : "none" }}
                  suppressHydrationWarning
                >
                  {it}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
