"use client";

import { useProgress } from "@/lib/progress";

export function MarkRead({ cert, domain }: { cert: string; domain: number }) {
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
      {done ? "✓ Capítulo leído" : "Marcar como leído"}
    </button>
  );
}
