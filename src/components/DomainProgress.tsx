"use client";

import { useProgress, accuracy } from "@/lib/progress";
import { t, type Lang } from "@/lib/i18n";

/** Anillo de precisión del dominio. Silencioso hasta que hay datos que mostrar. */
export function DomainProgress({ lang, cert, domain }: { lang: Lang; cert: string; domain: number }) {
  const S = t(lang);
  const { progress, ready } = useProgress();
  if (!ready) return <span className="label sm:w-24" />;

  const acc = accuracy(progress.attempts, cert, domain);
  const read = progress.readDomains.includes(`${cert}:${domain}`);

  if (!acc) {
    return (
      <span className="label whitespace-nowrap sm:w-24 sm:text-right" style={{ color: read ? "var(--clay)" : "var(--muted)" }}>
        {read ? S.domainProgress.read : S.domainProgress.noData}
      </span>
    );
  }

  const pct = Math.round((acc.correct / acc.total) * 100);
  const color = pct >= 80 ? "var(--verde)" : pct >= 60 ? "var(--clay)" : "var(--carmin)";
  const C = 2 * Math.PI * 15;

  return (
    <div className="flex items-center gap-2.5 sm:w-24 sm:flex-col sm:gap-1">
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden className="-rotate-90">
        <circle cx="19" cy="19" r="15" fill="none" stroke="var(--rule)" strokeWidth="3" />
        <circle
          cx="19"
          cy="19"
          r="15"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (pct / 100) * C}
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <span className="label whitespace-nowrap" style={{ color }}>
        {pct}% · {acc.total}
      </span>
    </div>
  );
}
