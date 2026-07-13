"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Todo el progreso vive en localStorage. Sin cuentas, sin backend, sin telemetría:
 * el estudiante es dueño de sus datos y el sitio es estático.
 */

export type Attempt = {
  qid: string;
  cert: string;
  domain: number;
  correct: boolean;
  at: number;
};

export type MockRun = {
  cert: string;
  at: number;
  total: number;
  correct: number;
  scaled: number;
  seconds: number;
  byDomain: Record<number, { total: number; correct: number }>;
};

export type Progress = {
  attempts: Attempt[];
  mocks: MockRun[];
  readDomains: string[]; // "CCAO-F:3"
  checked: string[]; // "CCAO-F:3:7" — ítem del checklist
};

const EMPTY: Progress = { attempts: [], mocks: [], readDomains: [], checked: [] };
const KEY = "cert-progress-v1";

function read(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function write(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("progress-change"));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(read());
    setReady(true);
    const sync = () => setProgress(read());
    window.addEventListener("progress-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("progress-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const recordAttempt = useCallback((a: Omit<Attempt, "at">) => {
    const p = read();
    // Solo el intento más reciente por pregunta cuenta para la precisión.
    p.attempts = [...p.attempts.filter((x) => x.qid !== a.qid), { ...a, at: Date.now() }];
    write(p);
  }, []);

  const recordMock = useCallback((m: Omit<MockRun, "at">) => {
    const p = read();
    p.mocks = [...p.mocks, { ...m, at: Date.now() }].slice(-30);
    write(p);
  }, []);

  const markRead = useCallback((cert: string, domain: number) => {
    const p = read();
    const key = `${cert}:${domain}`;
    if (!p.readDomains.includes(key)) {
      p.readDomains = [...p.readDomains, key];
      write(p);
    }
  }, []);

  const toggleCheck = useCallback((cert: string, domain: number, idx: number) => {
    const p = read();
    const key = `${cert}:${domain}:${idx}`;
    p.checked = p.checked.includes(key) ? p.checked.filter((k) => k !== key) : [...p.checked, key];
    write(p);
  }, []);

  const reset = useCallback(() => write(EMPTY), []);

  return { progress, ready, recordAttempt, recordMock, markRead, toggleCheck, reset };
}

export function accuracy(attempts: Attempt[], cert?: string, domain?: number) {
  const rel = attempts.filter(
    (a) => (!cert || a.cert === cert) && (domain === undefined || a.domain === domain),
  );
  if (!rel.length) return null;
  return { total: rel.length, correct: rel.filter((a) => a.correct).length };
}

/**
 * Estimación honesta, no una promesa: Anthropic no publica el mapeo raw→scaled.
 * Anclamos 0→100 y 100%→1000 linealmente y lo etiquetamos como aproximación.
 */
export function estimateScaled(correct: number, total: number) {
  if (!total) return 0;
  return Math.round(100 + (correct / total) * 900);
}
