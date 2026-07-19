"use client";

import { useProgress } from "@/lib/progress";
import { t, type Lang } from "@/lib/i18n";

export function MarkRead({ lang, cert, domain }: { lang: Lang; cert: string; domain: number }) {
  const S = t(lang);
  const { progress, ready, markRead } = useProgress();
  const done = ready && progress.readDomains.includes(`${cert}:${domain}`);

  return (
    <button
      onClick={() => markRead(cert, domain)}
      disabled={done}
      className="btn btn-ghost w-full justify-center"
      style={done ? { borderColor: "var(--verde)", color: "var(--verde)", opacity: 1 } : undefined}
      suppressHydrationWarning
    >
      {done ? S.markRead.done : S.markRead.mark}
    </button>
  );
}
