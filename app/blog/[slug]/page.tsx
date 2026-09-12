import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BackButton from "@/app/components/back-button";
import MarkdownContent from "@/app/components/markdown-content";
import {
  formatPublishedAt,
  getAdjacentPosts,
  getAllPostSummaries,
  getPostBySlug,
  slugifyTag,
} from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPostSummaries();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: `/blog/${post.slug}`,
      siteName: siteConfig.name,
      title: post.title,
      description: post.description,
      publishedTime: new Date(post.publishedAt).toISOString(),
      tags: post.tags,
      images: [
        {
          url: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
          width: 1200,
          height: 630,
          alt: `${post.title} - anteprima articolo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [absoluteUrl(`/blog/${post.slug}/opengraph-image`)],
    },
  };
}

export default async function BlogDetailPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { previousPost, nextPost } = await getAdjacentPosts(slug);

  return (
    <article className="space-y-8">
      <BackButton fallbackHref="/blog" />

      <header className="space-y-4 border-b border-[var(--border)] pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {formatPublishedAt(post.publishedAt)}
        </p>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            {post.title}
          </h1>
          <p className="max-w-3xl text-xl leading-8 text-[var(--text-tertiary)]">
            {post.subtitle}
          </p>
          <p className="max-w-3xl text-lg leading-8 text-[var(--text-secondary)]">
            {post.description}
          </p>
          {post.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-2">
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
        </div>
      </header>

      <div className="space-y-6">
        <MarkdownContent content={post.content} />
      </div>

      {previousPost || nextPost ? (
        <nav
          aria-label="Navigazione tra articoli"
          className="grid gap-3 border-t border-[var(--border)] pt-6 md:grid-cols-2"
        >
          {previousPost ? (
            <Link
              href={`/blog/${previousPost.slug}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                Articolo precedente
              </p>
              <p className="mt-1.5 text-sm font-medium leading-6 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                {previousPost.title}
              </p>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                {formatPublishedAt(previousPost.publishedAt)}
              </p>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)] md:justify-self-end"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                Articolo successivo
              </p>
              <p className="mt-1.5 text-sm font-medium leading-6 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                {nextPost.title}
              </p>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                {formatPublishedAt(nextPost.publishedAt)}
              </p>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}
