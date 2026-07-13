"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    setTheme(stored ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="grid h-8 w-8 place-items-center rounded border transition-colors hover:border-[var(--clay)] hover:text-[var(--clay)]"
      style={{ borderColor: "var(--rule)", color: "var(--muted)" }}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
      suppressHydrationWarning
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        {theme === "dark" ? (
          <>
            <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line
                key={a}
                x1="8"
                y1="1.4"
                x2="8"
                y2="3"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                transform={`rotate(${a} 8 8)`}
              />
            ))}
          </>
        ) : (
          <path
            d="M13.2 9.6A5.8 5.8 0 0 1 6.4 2.8a5.8 5.8 0 1 0 6.8 6.8Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
