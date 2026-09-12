import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BackButton from "@/app/components/back-button";
import {
  formatPublishedAt,
  getAllCategories,
  getCategoryBySlug,
  getPostsByTagSlug,
} from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/categorie/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) return {};

  const description = `Tutte le notizie di fantacalcio su ${category.name}.`;

  return {
    title: category.name,
    description,
    alternates: { canonical: `/categorie/${category.slug}` },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: `/categorie/${category.slug}`,
      siteName: siteConfig.name,
      title: `${category.name} | ${siteConfig.name}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function CategoryPage(props: PageProps<"/categorie/[slug]">) {
  const { slug } = await props.params;
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByTagSlug(slug),
  ]);

  if (!category || posts.length === 0) notFound();

  return (
    <section className="mx-auto max-w-5xl space-y-9">
      <BackButton fallbackHref="/" />
      <header className="border-l-8 border-[var(--sport)] bg-[var(--masthead)] px-6 py-10 text-white sm:px-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Categoria</p>
        <h1 className="mt-3 text-4xl font-black uppercase italic tracking-[-0.045em] sm:text-6xl">{category.name}</h1>
        <p className="mt-4 text-sm font-bold uppercase tracking-wider text-white/55">
          {posts.length} {posts.length === 1 ? "notizia" : "notizie"}
        </p>
      </header>

      <div className="divide-y divide-[var(--border)] border-t-4 border-[var(--text-primary)]">
        {posts.map((post, index) => (
          <article key={post.slug} className="grid grid-cols-[3rem_1fr] gap-4 py-6 sm:grid-cols-[5rem_1fr]">
            <span className="text-3xl font-black italic text-[var(--border-strong)] sm:text-5xl">{String(index + 1).padStart(2, "0")}</span>
            <Link href={`/blog/${post.slug}`} className="group">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--sport)]">{formatPublishedAt(post.publishedAt)}</p>
              <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-[var(--text-primary)] group-hover:text-[var(--sport)] sm:text-3xl">{post.title}</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--text-tertiary)]">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
