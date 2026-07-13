"use client";

import { useState } from "react";

type Card = { en: string; es: string; meaning: string };

/**
 * El glosario del dominio, en modo tarjeta. El examen se rinde en inglés: la carta
 * muestra el término inglés y esconde el significado hasta que el estudiante se compromete.
 */
export function Flashcards({ cards, certCode, domain }: { cards: Card[]; certCode: string; domain: number }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState<"cards" | "table">("cards");
  const c = cards[i];

  const go = (n: number) => {
    setFlipped(false);
    setI((n + cards.length) % cards.length);
  };

  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
        <h2 className="display text-[1.7rem]">Glosario del dominio</h2>
        <div className="flex gap-1">
          {(["cards", "table"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="label rounded px-2.5 py-1 transition-colors"
              style={{
                color: mode === m ? "var(--clay)" : "var(--muted)",
                background: mode === m ? "var(--clay-wash)" : "transparent",
              }}
            >
              {m === "cards" ? "Tarjetas" : "Tabla"}
            </button>
          ))}
        </div>
      </div>

      {mode === "cards" ? (
        <>
          <button
            onClick={() => setFlipped(!flipped)}
            className="card mt-6 flex min-h-[15rem] w-full flex-col items-center justify-center p-8 text-center transition-transform duration-200 hover:-translate-y-0.5"
            aria-label="Voltear tarjeta"
            key={`${i}-${flipped}`}
          >
            {!flipped ? (
              <div className="rise">
                <p className="label">Término {i + 1} de {cards.length}</p>
                <p className="display mt-4 text-[clamp(1.8rem,4vw,2.6rem)]" lang="en">
                  {c.en}
                </p>
                <p className="label mt-6" style={{ color: "var(--clay)" }}>
                  Clic para revelar
                </p>
              </div>
            ) : (
              <div className="rise">
                <p className="display text-[clamp(1.4rem,3vw,2rem)]" style={{ color: "var(--clay)" }}>
                  {c.es}
                </p>
                {c.meaning && <p className="mx-auto mt-4 max-w-xl leading-relaxed">{c.meaning}</p>}
              </div>
            )}
          </button>

          <div className="mt-4 flex items-center gap-3">
            <button className="btn btn-ghost" onClick={() => go(i - 1)}>
              ←
            </button>
            <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: "var(--rule)" }}>
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{ width: `${((i + 1) / cards.length) * 100}%`, background: "var(--clay)" }}
              />
            </div>
            <button className="btn btn-ghost" onClick={() => go(i + 1)}>
              →
            </button>
          </div>
        </>
      ) : (
        <div className="table-scroll mt-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["Término (EN)", "Español", "Qué significa"].map((h) => (
                  <th
                    key={h}
                    className="label whitespace-nowrap border-b p-3 text-left"
                    style={{ borderColor: "var(--rule)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cards.map((x, n) => (
                <tr key={`${certCode}-${domain}-${n}`}>
                  <td className="border-b p-3 font-bold" style={{ borderColor: "var(--rule)" }} lang="en">
                    {x.en}
                  </td>
                  <td className="border-b p-3" style={{ borderColor: "var(--rule)", color: "var(--clay)" }}>
                    {x.es}
                  </td>
                  <td className="border-b p-3" style={{ borderColor: "var(--rule)", color: "var(--muted)" }}>
                    {x.meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
