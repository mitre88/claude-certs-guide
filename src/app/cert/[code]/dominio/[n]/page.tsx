import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { certs, cert, domain } from "@/lib/content";
import { Checklist } from "@/components/Checklist";
import { MarkRead } from "@/components/MarkRead";
import { Flashcards } from "@/components/Flashcards";

export const dynamicParams = false;
export const generateStaticParams = () =>
  certs().flatMap((c) => c.domains.map((d) => ({ code: c.code, n: String(d.n) })));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string; n: string }>;
}): Promise<Metadata> {
  const { code, n } = await params;
  const d = domain(code, Number(n));
  if (!d) return {};
  return {
    title: `D${d.n}: ${d.titleEs} (${d.weight}%) — ${code}`,
    description: `Capítulo completo del dominio ${d.n} de ${code}: ${d.objectives.length} objetivos oficiales, conceptos clave, ejemplos, errores comunes, glosario y checklist.`,
  };
}

export default async function DomainPage({ params }: { params: Promise<{ code: string; n: string }> }) {
  const { code, n } = await params;
  const c = cert(code);
  const d = domain(code, Number(n));
  if (!c || !d) notFound();

  const idx = c.domains.findIndex((x) => x.n === d.n);
  const prev = c.domains[idx - 1];
  const next = c.domains[idx + 1];
  const qCount = c.questions.filter((q) => q.domain === d.n).length;
  const examItems = Math.max(1, Math.round((d.weight / 100) * c.items));

  return (
    <div className="mx-auto max-w-[84rem] px-5 py-12 sm:px-8">
      <nav className="label flex flex-wrap items-center gap-2" aria-label="Migas">
        <Link href={`/cert/${c.code}`} className="no-underline hover:text-[var(--clay)]">
          {c.code}
        </Link>
        <span style={{ color: "var(--rule)" }}>/</span>
        <span>Dominio {d.n}</span>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
        {/* ---------- columna principal ---------- */}
        <div className="min-w-0">
          <header className="rise">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
              <p className="numeral text-[clamp(4rem,10vw,7rem)]" style={{ color: "var(--clay)" }}>
                {d.weight}
                <span className="text-[0.35em]">%</span>
              </p>
              <div className="pb-2">
                <p className="label">Dominio {d.n} de {c.domains.length}</p>
                <p className="label mt-1">≈{examItems} de los {c.items} ítems</p>
              </div>
            </div>
            <h1 className="display mt-5 text-[clamp(2rem,4.5vw,3.2rem)]">{d.titleEs}</h1>
            <p className="mt-2 text-lg" lang="en" style={{ color: "var(--muted)" }}>
              {d.title}
            </p>
          </header>

          {/* objetivos oficiales */}
          <section className="card rise mt-10 p-6 sm:p-8" style={{ animationDelay: "80ms" }}>
            <p className="label" style={{ color: "var(--clay)" }}>
              Objetivos oficiales · verbatim del exam guide
            </p>
            <ul className="mt-5 space-y-3">
              {d.objectives.map((o, i) => (
                <li key={i} className="flex gap-3.5 text-[0.95rem] leading-relaxed" lang="en">
                  <span className="label shrink-0 pt-0.5" style={{ color: "var(--clay)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* el capítulo */}
          {d.html ? (
            <article
              className="prose-study rise mt-14"
              style={{ animationDelay: "140ms" }}
              dangerouslySetInnerHTML={{ __html: d.html }}
            />
          ) : (
            <p className="card mt-14 p-8" style={{ color: "var(--muted)" }}>
              El capítulo de este dominio aún no está publicado.
            </p>
          )}

          {d.glossary.length > 0 && <Flashcards cards={d.glossary} certCode={c.code} domain={d.n} />}

          {d.checklist.length > 0 && <Checklist items={d.checklist} cert={c.code} domain={d.n} />}

          {/* navegación entre dominios */}
          <nav className="mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2" style={{ borderColor: "var(--rule)" }}>
            {prev ? (
              <Link href={`/cert/${c.code}/dominio/${prev.n}`} className="card p-5 no-underline transition-transform hover:-translate-y-0.5">
                <p className="label">← Dominio {prev.n} · {prev.weight}%</p>
                <p className="display mt-1.5 text-lg">{prev.titleEs}</p>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/cert/${c.code}/dominio/${next.n}`}
                className="card p-5 text-right no-underline transition-transform hover:-translate-y-0.5"
              >
                <p className="label">Dominio {next.n} · {next.weight}% →</p>
                <p className="display mt-1.5 text-lg">{next.titleEs}</p>
              </Link>
            )}
          </nav>
        </div>

        {/* ---------- riel lateral ---------- */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-6">
            <p className="label">Este dominio</p>
            <dl className="mt-4 space-y-3.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt style={{ color: "var(--muted)" }}>Peso</dt>
                <dd className="font-bold">{d.weight}%</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt style={{ color: "var(--muted)" }}>Ítems estimados</dt>
                <dd className="font-bold">≈{examItems}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt style={{ color: "var(--muted)" }}>Objetivos</dt>
                <dd className="font-bold">{d.objectives.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt style={{ color: "var(--muted)" }}>Preguntas</dt>
                <dd className="font-bold">{qCount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt style={{ color: "var(--muted)" }}>Lectura</dt>
                <dd className="font-bold">≈{Math.max(1, Math.round(d.words / 220))} min</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-2.5">
              <Link
                href={`/cert/${c.code}/practica?dominio=${d.n}`}
                className="btn w-full justify-center no-underline"
              >
                Practicar este dominio
              </Link>
              <MarkRead cert={c.code} domain={d.n} />
            </div>
          </div>

          <div className="card mt-4 p-6">
            <p className="label mb-3">Otros dominios</p>
            <ul className="space-y-2">
              {c.domains.map((x) => (
                <li key={x.n}>
                  <Link
                    href={`/cert/${c.code}/dominio/${x.n}`}
                    className="flex items-baseline justify-between gap-3 text-sm no-underline transition-colors hover:text-[var(--clay)]"
                    style={{ color: x.n === d.n ? "var(--clay)" : "var(--ink)", fontWeight: x.n === d.n ? 700 : 400 }}
                  >
                    <span className="truncate">
                      <span className="label mr-1.5">D{x.n}</span>
                      {x.titleEs}
                    </span>
                    <span className="label shrink-0">{x.weight}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
