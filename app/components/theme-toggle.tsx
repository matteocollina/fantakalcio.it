"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "fantakalcio-theme";

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
      className="inline-flex size-9 items-center justify-center border border-[var(--border-strong)] bg-[var(--surface)] text-sm font-bold text-[var(--text-secondary)] hover:border-[var(--sport)] hover:text-[var(--sport)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sport)]"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {isDark ? "☀" : "☾"}
      </span>
      <span className="sr-only">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
