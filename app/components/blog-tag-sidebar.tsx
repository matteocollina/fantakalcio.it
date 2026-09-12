"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import type { BlogCategory } from "@/lib/blog";

type BlogTagSidebarProps = {
  categories: BlogCategory[];
  variant?: "mobile" | "desktop";
};

export default function BlogTagSidebar({
  categories,
  variant = "desktop",
}: BlogTagSidebarProps) {
  const isMobile = variant === "mobile";
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(!isMobile);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase("it-IT");
  const filteredCategories = normalizedQuery
    ? categories.filter((category) =>
        category.name.toLocaleLowerCase("it-IT").includes(normalizedQuery),
      )
    : categories;

  return (
    <div
      className={
        isMobile
          ? "space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          : "space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6"
      }
    >
      {isMobile ? (
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-xl bg-[var(--surface-muted)] px-3 py-3 text-left transition-colors hover:bg-[var(--surface-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]"
        >
          <span className="space-y-1">
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
              Tutti i tag
            </span>
            <span className="block text-sm text-[var(--text-secondary)]">
              {categories.length} {categories.length === 1 ? "argomento" : "argomenti"}
            </span>
          </span>
          <span className="text-lg leading-none text-[var(--text-secondary)]">
            {isOpen ? "−" : "+"}
          </span>
        </button>
      ) : (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Tutti i tag
          </h2>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            Cerca tra gli argomenti del blog.
          </p>
        </div>
      )}

      {!isMobile || isOpen ? (
        <>
          {isMobile ? (
            <p className="text-sm text-[var(--text-secondary)]">
              Cerca tra gli argomenti del blog.
            </p>
          ) : null}

          <label className={isMobile ? "block space-y-1.5" : "block space-y-2"}>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              Cerca
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Es. Next.js, CSS, AI..."
              className={
                isMobile
                  ? "w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-subtle)] focus:border-[var(--accent-hover-border)] focus:bg-[var(--surface)]"
                  : "w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-subtle)] focus:border-[var(--accent-hover-border)] focus:bg-[var(--surface)]"
              }
            />
          </label>

          <div className="space-y-3">
            <p className="text-xs text-[var(--text-subtle)]">
              {filteredCategories.length} {filteredCategories.length === 1 ? "tag trovato" : "tag trovati"}
            </p>

            <nav
              aria-label="Menu tag blog"
              className={isMobile ? "max-h-36 overflow-y-auto pr-1" : "max-h-[min(50vh,36rem)] overflow-y-auto pr-1"}
            >
              <ul className={isMobile ? "space-y-2" : "flex flex-wrap gap-2 lg:flex-col lg:items-stretch"}>
                {filteredCategories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/blog/categorie/${category.slug}`}
                      className={
                        isMobile
                          ? "flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-hover-border)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]"
                          : "inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)] transition-colors hover:border-[var(--accent-hover-border)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)] lg:flex lg:w-full lg:justify-between"
                      }
                    >
                      <span>{category.name}</span>
                      <span className="text-[var(--text-subtle)]">{category.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {filteredCategories.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-5 text-sm text-[var(--text-secondary)]">
                Nessun tag corrisponde alla ricerca.
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
