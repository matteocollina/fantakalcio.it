"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "mc-blog-theme";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem(storageKey);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      const documentTheme = document.documentElement.dataset.theme;
      if (documentTheme === "light" || documentTheme === "dark") {
        return documentTheme;
      }
    }

    return getPreferredTheme();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function handleToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Attiva tema chiaro" : "Attiva tema scuro"}
      aria-pressed={isDark}
      suppressHydrationWarning
      className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--surface-strong)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] shadow-sm backdrop-blur-sm hover:border-[var(--accent-hover-border)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {isDark ? "☀" : "☾"}
      </span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
