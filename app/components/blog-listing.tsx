import Link from "next/link";

import BlogTagSidebar from "@/app/components/blog-tag-sidebar";
import type { BlogCategory, BlogPostSummary } from "@/lib/blog";
import { formatPublishedAt, slugifyTag } from "@/lib/blog";

type BlogListingProps = {
  posts: BlogPostSummary[];
  categories: BlogCategory[];
  currentPage: number;
  totalPages: number;
};

function buildPageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

export function BlogListing({
  posts,
  categories,
  currentPage,
  totalPages,
}: BlogListingProps) {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Blog
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
          Articoli e aggiornamenti frontend
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
          Un archivio semplice con note, riflessioni e contenuti pratici sul
          frontend.
        </p>
        <p className="text-sm text-[var(--text-subtle)]">
          Pagina {currentPage} di {totalPages}
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="lg:hidden">
          <BlogTagSidebar categories={categories} variant="mobile" />
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-5">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)]"
              >
                <Link href={`/blog/${post.slug}`} className="group block space-y-3">
                  <p className="text-sm font-medium text-[var(--text-muted)]">
                    {formatPublishedAt(post.publishedAt)}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--text-tertiary)]">
                    {post.title}
                  </h2>
                  <p className="text-base leading-7 text-[var(--text-tertiary)]">
                    {post.description}
                  </p>
                </Link>
                {post.tags.length > 0 ? (
                  <ul className="flex flex-wrap gap-2 pt-4">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={`/blog/categorie/${slugifyTag(tag)}`}
                          className="inline-flex rounded-full border border-[var(--accent-border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)] transition-colors hover:border-[var(--accent-hover-border)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>

          {totalPages > 1 ? (
            <nav
              aria-label="Paginazione articoli"
              className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-6"
            >
              {currentPage > 1 ? (
                <Link
                  href={buildPageHref(currentPage - 1)}
                  className="inline-flex rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition-colors hover:border-[var(--accent-hover-border)] hover:bg-[var(--accent-hover-bg)] hover:text-[var(--accent-hover-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]"
                >
                  Precedente
                </Link>
              ) : (
                <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--text-subtle)]">
                  Precedente
                </span>
              )}

              {currentPage < totalPages ? (
                <Link
                  href={buildPageHref(currentPage + 1)}
                  className="ml-auto inline-flex rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition-colors hover:border-[var(--accent-hover-border)] hover:bg-[var(--accent-hover-bg)] hover:text-[var(--accent-hover-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]"
                >
                  Successiva
                </Link>
              ) : (
                <span className="ml-auto inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--text-subtle)]">
                  Successiva
                </span>
              )}
            </nav>
          ) : null}
        </div>

        {categories.length > 0 ? (
          <aside className="hidden lg:sticky lg:top-8 lg:block">
            <BlogTagSidebar categories={categories} />
          </aside>
        ) : null}
      </div>
    </section>
  );
}
