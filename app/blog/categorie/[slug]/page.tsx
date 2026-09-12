import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BackButton from "@/app/components/back-button";
import {
  formatPublishedAt,
  getAllCategories,
  getCategoryBySlug,
  getPostsByTagSlug,
  slugifyTag,
} from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories
    .filter((category) => category.count > 1)
    .map((category) => ({
      slug: category.slug,
    }));
}

export async function generateMetadata(
  props: PageProps<"/blog/categorie/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return {
    title: category.name,
    description: `Articoli del blog associati al tag ${category.name}.`,
    alternates: {
      canonical: `/blog/categorie/${category.slug}`,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: `/blog/categorie/${category.slug}`,
      siteName: siteConfig.name,
      title: `${category.name} | ${siteConfig.name}`,
      description: `Articoli del blog associati al tag ${category.name}.`,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | ${siteConfig.name}`,
      description: `Articoli del blog associati al tag ${category.name}.`,
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogCategoryPage(
  props: PageProps<"/blog/categorie/[slug]">,
) {
  const { slug } = await props.params;
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByTagSlug(slug),
  ]);

  if (!category || posts.length === 0) {
    notFound();
  }

  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <BackButton fallbackHref="/blog" />
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
            Categoria
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] capitalize">
            {category.name}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            {posts.length} {posts.length === 1 ? "articolo associato" : "articoli associati"} a
            questo tag.
          </p>
        </div>
      </div>

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
                {post.tags.map((tag) => {
                  const tagSlug = slugifyTag(tag);
                  const isCurrentTag = tagSlug === category.slug;

                  return (
                    <li key={tag}>
                      <Link
                        href={`/blog/categorie/${tagSlug}`}
                        aria-current={isCurrentTag ? "page" : undefined}
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)] ${
                          isCurrentTag
                            ? "border-[var(--accent-hover-border)] bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)]"
                            : "border-[var(--accent-border)] bg-[var(--surface-muted)] text-[var(--text-tertiary)] hover:border-[var(--accent-hover-border)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {tag}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
