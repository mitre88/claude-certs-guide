import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { certs, cert } from "@/lib/content";
import { isLang, t, type Lang } from "@/lib/i18n";

export const dynamicParams = false;
export const generateStaticParams = () => certs("es").map((c) => ({ code: c.code }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}): Promise<Metadata> {
  const { lang, code } = await params;
  if (!isLang(lang)) return {};
  const c = cert(lang, code);
  const S = t(lang);
  return c ? { title: S.logistics.metaTitle(c.code), description: S.logistics.metaDescription(c.name) } : {};
}

export default async function LogisticsPage({ params }: { params: Promise<{ lang: string; code: string }> }) {
  const { lang: raw, code } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const S = t(lang);
  const c = cert(lang, code);
  if (!c) notFound();

  return (
    <div className="mx-auto max-w-[52rem] px-5 py-12 sm:px-8">
      <nav className="label mb-6">
        <Link href={`/${lang}/cert/${c.code}`} className="no-underline hover:text-[var(--clay)]">
          {c.code}
        </Link>
        <span className="mx-2" style={{ color: "var(--rule)" }}>
          /
        </span>
        {S.logistics.breadcrumb}
      </nav>

      <header className="rise">
        <h1 className="display text-[clamp(2.2rem,5vw,3.4rem)]">{S.logistics.title}</h1>
        <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          {S.logistics.intro(c.code)}
        </p>
      </header>

      {/* pasos de registro */}
      <section className="rise mt-12" style={{ animationDelay: "80ms" }}>
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[1.8rem]">{S.logistics.regTitle}</h2>
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
          {S.logistics.officialRegCta}
        </a>
      </section>

      {/* reglas del día */}
      <section className="mt-16">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[1.8rem]">{S.logistics.rulesTitle}</h2>
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
          <h2 className="display text-[1.8rem]">{S.logistics.prepTitle}</h2>
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
        <article
          className="prose-study mt-16"
          lang={c.logisticsTranslated ? undefined : "es"}
          dangerouslySetInnerHTML={{ __html: c.logisticsHtml }}
        />
      )}

      <div className="mt-14 flex flex-wrap gap-3">
        <Link href={`/${lang}/cert/${c.code}/practica`} className="btn no-underline">
          {S.logistics.practice}
        </Link>
        <Link href={`/${lang}/cert/${c.code}`} className="btn btn-ghost no-underline">
          {S.logistics.backTo(c.code)}
        </Link>
      </div>
    </div>
  );
}
