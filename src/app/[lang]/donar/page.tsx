import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { globalStats, totalFee } from "@/lib/content";
import { DONATE_URL, SUGGESTED, donateLive } from "@/lib/donate";
import { isLang, t, type Lang } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const S = t(lang);
  return { title: S.donar.metaTitle, description: S.donar.metaDescription };
}

export default async function DonatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const S = t(lang);
  const s = globalStats(lang);
  const live = donateLive();

  return (
    <div className="mx-auto max-w-[52rem] px-5 py-16 sm:px-8">
      <header className="rise">
        <p className="label">{S.donar.kicker}</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,5.5vw,3.8rem)]">{S.donar.title}</h1>
        <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          {S.donar.intro(s.questions)}
        </p>
      </header>

      {/* la propuesta */}
      <section className="card rise mt-12 p-8 sm:p-10" style={{ animationDelay: "80ms" }}>
        <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="label" style={{ color: "var(--clay)" }}>
              {S.donar.mathKicker}
            </p>
            <p className="mt-4 text-lg leading-relaxed">
              {S.donar.math1a}
              <strong style={{ color: "var(--clay)" }}>{S.donar.math1b(totalFee())}</strong>
              {S.donar.math1c}
            </p>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--muted)" }}>
              {S.donar.math2}
            </p>
          </div>

          <div className="text-center sm:w-44">
            <p className="numeral text-[clamp(3rem,9vw,4.5rem)]" style={{ color: "var(--clay)" }}>
              ☕
            </p>
            <p className="label mt-2">{S.donar.payOnce}</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8" style={{ borderColor: "var(--rule)" }}>
          {live ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noreferrer"
                className="btn no-underline"
              >
                ☕ {S.nav.coffee.replace(/^☕\s*/, "")} — {S.donar.stripeGo}
              </a>
              <span className="label" style={{ color: "var(--muted)" }}>
                {SUGGESTED.map((n) => `$${n}`).join(" · ")} {S.donar.orAnyAmount}
              </span>
            </div>
          ) : (
            <div
              className="border-l-2 p-4"
              style={{ borderColor: "var(--clay)", background: "var(--clay-wash)" }}
            >
              <p className="label" style={{ color: "var(--clay)" }}>
                {S.donar.pendingKicker}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {S.donar.pendingPara1}{" "}
                <code
                  className="rounded px-1.5 py-0.5 text-xs"
                  style={{ background: "var(--surface)", fontFamily: "var(--font-mono)", color: "var(--clay)" }}
                >
                  NEXT_PUBLIC_STRIPE_DONATE_URL
                </code>{" "}
                {S.donar.pendingPara2}
              </p>
            </div>
          )}

          <p className="mt-5 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            {S.donar.stripeNote}
          </p>
        </div>
      </section>

      {/* a dónde va */}
      <section className="mt-16">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[1.8rem]">{S.donar.whereTitle}</h2>
        </div>
        <ul className="mt-8 space-y-6">
          {S.donar.where.map(([tt, d]) => (
            <li key={tt}>
              <p className="display text-lg" style={{ color: "var(--clay)" }}>
                {tt}
              </p>
              <p className="mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                {d}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t pt-8" style={{ borderColor: "var(--rule)" }}>
        <p className="label mb-4">{S.donar.otherTitle}</p>
        <ul className="space-y-2.5">
          {S.donar.other.map((x) => (
            <li key={x} className="flex gap-3">
              <span className="label shrink-0 pt-1" style={{ color: "var(--clay)" }}>
                ◆
              </span>
              <span style={{ color: "var(--muted)" }}>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14">
        <Link href={`/${lang}`} className="btn btn-ghost no-underline">
          {S.donar.backCta}
        </Link>
      </div>
    </div>
  );
}
