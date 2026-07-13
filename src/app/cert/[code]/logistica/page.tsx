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
        title: `Registro y día del examen — ${c.code}`,
        description: `Cómo registrarse, agendar en Pearson VUE, qué esperar el día del examen, reglas de conducta, reintentos y recertificación de ${c.name}.`,
      }
    : {};
}

export default async function LogisticsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = cert(code);
  if (!c) notFound();

  return (
    <div className="mx-auto max-w-[52rem] px-5 py-12 sm:px-8">
      <nav className="label mb-6">
        <Link href={`/cert/${c.code}`} className="no-underline hover:text-[var(--clay)]">
          {c.code}
        </Link>
        <span className="mx-2" style={{ color: "var(--rule)" }}>
          /
        </span>
        Logística
      </nav>

      <header className="rise">
        <h1 className="display text-[clamp(2.2rem,5vw,3.4rem)]">Registro y día del examen</h1>
        <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          Todo lo operativo de {c.code}: desde el checkout en Partner Academy hasta las reglas que te pueden anular el
          examen si las rompes.
        </p>
      </header>

      {/* pasos de registro */}
      <section className="rise mt-12" style={{ animationDelay: "80ms" }}>
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[1.8rem]">Registro, paso a paso</h2>
        </div>
        <ol className="mt-8 space-y-6">
          {c.registrationSteps.map((s, i) => (
            <li key={i} className="flex gap-5">
              <span className="numeral shrink-0 text-[2rem]" style={{ color: "var(--clay)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="pt-1.5 leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>

        <a
          href="https://anthropic-partners.skilljar.com/page/partner-certifications"
          target="_blank"
          rel="noreferrer"
          className="btn mt-8 no-underline"
        >
          Ir al registro oficial ↗
        </a>
      </section>

      {/* reglas del día */}
      <section className="mt-16">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[1.8rem]">Reglas del día del examen</h2>
        </div>
        <ul className="mt-8 space-y-4">
          {c.examDayRules.map((r, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="label shrink-0 pt-1" style={{ color: "var(--carmin)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="leading-relaxed">{r}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* cómo prepararse, según Anthropic */}
      <section className="mt-16">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[1.8rem]">Cómo prepararse, según Anthropic</h2>
        </div>
        <ul className="mt-8 space-y-4">
          {c.howToPrepare.map((h, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="label shrink-0 pt-1" style={{ color: "var(--clay)" }}>
                ◆
              </span>
              <p className="leading-relaxed">{h}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* el resto */}
      {c.logisticsHtml && (
        <article className="prose-study mt-16" dangerouslySetInnerHTML={{ __html: c.logisticsHtml }} />
      )}

      <div className="mt-14 flex flex-wrap gap-3">
        <Link href={`/cert/${c.code}/practica`} className="btn no-underline">
          Practicar
        </Link>
        <Link href={`/cert/${c.code}`} className="btn btn-ghost no-underline">
          Volver a {c.code}
        </Link>
      </div>
    </div>
  );
}
