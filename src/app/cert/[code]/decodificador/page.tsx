import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { certs, cert } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => certs().map((c) => ({ code: c.code }));

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const c = cert(code);
  return c
    ? {
        title: `Decodificador del examen — ${c.code}`,
        description: `Cómo están construidos los ítems de ${c.name}: el arquetipo de respuesta correcta, los roles de los distractores y la técnica de eliminación.`,
      }
    : {};
}

export default async function DecoderPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = cert(code);
  if (!c) notFound();

  const official = c.questions.filter((q) => q.source === "official");

  return (
    <div className="mx-auto max-w-[52rem] px-5 py-12 sm:px-8">
      <nav className="label mb-6">
        <Link href={`/cert/${c.code}`} className="no-underline hover:text-[var(--clay)]">
          {c.code}
        </Link>
        <span className="mx-2" style={{ color: "var(--rule)" }}>
          /
        </span>
        Decodificador
      </nav>

      <header className="rise">
        <h1 className="display text-[clamp(2.2rem,5vw,3.4rem)]">El decodificador</h1>
        <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          Un examen de opción múltiple no es una prueba de memoria: es un artefacto construido con reglas. Estas son las
          de {c.code}, derivadas de las {official.length} preguntas de ejemplo que Anthropic publicó y del lenguaje del
          exam guide.
        </p>
      </header>

      {c.decoderHtml ? (
        <article
          className="prose-study rise mt-12"
          style={{ animationDelay: "80ms" }}
          dangerouslySetInnerHTML={{ __html: c.decoderHtml }}
        />
      ) : (
        <p className="card mt-12 p-8" style={{ color: "var(--muted)" }}>
          Aún no publicado.
        </p>
      )}

      {official.length > 0 && (
        <section className="mt-16">
          <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
            <h2 className="display text-[1.8rem]">Las preguntas oficiales, diseccionadas</h2>
          </div>
          <p className="mt-4 leading-relaxed" style={{ color: "var(--muted)" }}>
            Estas {official.length} son las únicas preguntas reales que Anthropic ha publicado para este examen. Valen
            más que cien inventadas: son la muestra de calibración.
          </p>

          <div className="mt-8 space-y-5">
            {official.map((q, i) => (
              <details key={q.id} className="card group p-6">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start gap-4">
                    <span className="numeral text-[1.8rem]" style={{ color: "var(--clay)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="label">
                        D{q.domain}
                        {q.scenario ? ` · ${q.scenario}` : ""}
                      </p>
                      <p className="mt-1.5 text-[0.97rem] leading-relaxed" lang="en">
                        {q.stem}
                      </p>
                      <p className="label mt-3 transition-colors group-open:hidden" style={{ color: "var(--clay)" }}>
                        Ver disección ↓
                      </p>
                    </div>
                  </div>
                </summary>

                <div className="mt-6 space-y-2.5 border-t pt-6" style={{ borderColor: "var(--rule)" }}>
                  {q.options.map((o) => {
                    const right = q.correct.includes(o.key);
                    return (
                      <div
                        key={o.key}
                        className="flex gap-3 rounded border p-3"
                        style={{
                          borderColor: right ? "var(--verde)" : "var(--rule)",
                          background: right ? "var(--verde-wash)" : "transparent",
                        }}
                      >
                        <span
                          className="label shrink-0 pt-0.5"
                          style={{ color: right ? "var(--verde)" : "var(--muted)", fontWeight: 700 }}
                        >
                          {right ? "✓" : o.key}
                        </span>
                        <span className="text-sm leading-relaxed" lang="en">
                          {o.text}
                        </span>
                      </div>
                    );
                  })}

                  <div className="pt-4">
                    <p className="label" style={{ color: "var(--verde)" }}>
                      Justificación oficial
                    </p>
                    <p className="mt-2 text-sm leading-relaxed" lang="en" style={{ color: "var(--muted)" }}>
                      {q.officialRationale}
                    </p>
                  </div>

                  <div className="pt-3">
                    <p className="label" style={{ color: "var(--clay)" }}>
                      Qué te enseña
                    </p>
                    <p className="mt-2 leading-relaxed">{q.explanationEs}</p>
                  </div>

                  {q.trap && (
                    <p className="label pt-3" style={{ color: "var(--clay)" }}>
                      Trampa: {q.trap}
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 flex flex-wrap gap-3">
        <Link href={`/cert/${c.code}/practica`} className="btn no-underline">
          Aplicarlo en práctica
        </Link>
        <Link href={`/cert/${c.code}`} className="btn btn-ghost no-underline">
          Volver a {c.code}
        </Link>
      </div>
    </div>
  );
}
