import Image from "next/image";
import Link from "next/link";

import type { BlogPostSummary } from "@/lib/blog";
import { formatPublishedAt, slugifyTag } from "@/lib/blog";

type BlogListingProps = {
  posts: BlogPostSummary[];
  currentPage: number;
  totalPages: number;
};

function buildPageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

function TopicLabel({ tag }: { tag: string }) {
  return (
    <Link href={`/categorie/${slugifyTag(tag)}`} className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[var(--sport)] hover:underline hover:underline-offset-4">
      {tag}
    </Link>
  );
}

export function BlogListing({ posts, currentPage, totalPages }: BlogListingProps) {
  const [leadPost, ...newsPosts] = posts;

  return (
    <section className="space-y-9">
      <header className="flex items-end justify-between gap-5 border-b-4 border-[var(--text-primary)] pb-3">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--signal)]">
            <span className="size-2 animate-pulse rounded-full bg-current" />
            Live dalla redazione
          </p>
          <h1 className="text-4xl font-black uppercase italic leading-none tracking-[-0.05em] text-[var(--text-primary)] sm:text-6xl">Ultime notizie</h1>
        </div>
        <p className="hidden max-w-xs text-right text-sm font-medium leading-6 text-[var(--text-muted)] md:block">
          Formazioni, indisponibili e analisi per arrivare pronti alla prossima giornata.
        </p>
      </header>

      {leadPost ? (
        <article className="grid overflow-hidden bg-[var(--masthead)] text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-72 lg:min-h-[27rem]">
            <Image src="/stadio-fantakalcio.jpg" alt="Stadio illuminato durante una partita di calcio" fill priority={currentPage === 1} sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1830]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0c1830]/35" />
            <a href="https://unsplash.com/photos/football-stadium-at-night-with-fans-and-bright-lights-kP60kmDQcq8" target="_blank" rel="noreferrer" className="absolute bottom-3 left-3 text-[10px] font-medium text-white/55 hover:text-white">Foto: lesha tuman / Unsplash</a>
          </div>
          <div className="flex flex-col justify-end p-6 sm:p-9 lg:p-10">
            <div className="mb-auto flex items-center justify-between gap-3 pb-10">
              <span className="bg-[var(--sport)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white">In evidenza</span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/55">{formatPublishedAt(leadPost.publishedAt)}</span>
            </div>
            {leadPost.tags.length > 0 ? (
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {leadPost.tags.map((tag) => <TopicLabel key={tag} tag={tag} />)}
              </div>
            ) : null}
            <Link href={`/blog/${leadPost.slug}`} className="group">
              <h2 className="mt-3 text-3xl font-black leading-[1.05] tracking-[-0.04em] text-white transition-colors group-hover:text-emerald-300 sm:text-4xl">{leadPost.title}</h2>
              <p className="mt-4 line-clamp-3 text-base leading-7 text-white/70">{leadPost.description}</p>
              <span className="mt-6 inline-block text-sm font-black uppercase tracking-[0.14em] text-white">Leggi la notizia <span aria-hidden="true">→</span></span>
            </Link>
          </div>
        </article>
      ) : (
        <div className="sport-grid border-l-8 border-[var(--sport)] bg-[var(--surface)] px-6 py-16 sm:px-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--sport)]">Spogliatoi aperti</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black uppercase italic tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl">La redazione sta preparando le prossime notizie</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-tertiary)]">Qui troverai aggiornamenti, analisi e consigli per la tua formazione.</p>
        </div>
      )}

      <div className="max-w-5xl">
        <div>
          <div className="mb-1 flex items-center justify-between border-b border-[var(--border-strong)] pb-3">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-[var(--text-primary)]">Tutte le notizie</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Pagina {currentPage}/{totalPages}</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {newsPosts.map((post, index) => (
              <article key={post.slug} className="group grid grid-cols-[2.5rem_1fr] gap-3 py-6 sm:grid-cols-[4rem_1fr] sm:gap-5">
                <span className="text-3xl font-black italic leading-none text-[var(--border-strong)] sm:text-5xl">{String(index + 2).padStart(2, "0")}</span>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {post.tags.map((tag) => <TopicLabel key={tag} tag={tag} />)}
                    <span className="text-xs font-semibold text-[var(--text-subtle)]">{formatPublishedAt(post.publishedAt)}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-extrabold leading-tight tracking-[-0.025em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--sport)] sm:text-2xl">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-tertiary)] sm:text-base">{post.description}</p>
                  </Link>
                </div>
              </article>
            ))}
            {newsPosts.length === 0 && leadPost ? (
              <p className="py-8 text-sm font-medium text-[var(--text-muted)]">Altre notizie in arrivo dalla redazione.</p>
            ) : null}
          </div>
          {totalPages > 1 ? (
            <nav aria-label="Paginazione articoli" className="mt-6 flex items-center justify-between border-t-4 border-[var(--text-primary)] pt-5">
              {currentPage > 1 ? <Link href={buildPageHref(currentPage - 1)} className="bg-[var(--masthead)] px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--sport)]">← Precedente</Link> : <span />}
              {currentPage < totalPages ? <Link href={buildPageHref(currentPage + 1)} className="bg-[var(--masthead)] px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--sport)]">Successiva →</Link> : null}
            </nav>
          ) : null}
        </div>

      </div>
    </section>
  );
}
