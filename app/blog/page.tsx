import type { Metadata } from "next";

import { BlogListing } from "@/app/components/blog-listing";
import {
  getAllCategories,
  getAllPostSummaries,
  POSTS_PER_PAGE,
} from "@/lib/blog";
import { siteConfig } from "@/lib/site";

function parsePageParam(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(candidate ?? "1", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export async function generateMetadata(
  props: PageProps<"/blog">,
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const currentPage = parsePageParam(searchParams.page);
  const canonical = currentPage <= 1 ? "/" : `/blog?page=${currentPage}`;
  const title =
    currentPage <= 1 ? `Blog | ${siteConfig.name}` : `Blog - Pagina ${currentPage} | ${siteConfig.name}`;

  return {
    title: currentPage <= 1 ? "Blog" : `Blog - Pagina ${currentPage}`,
    description:
      "Archivio degli articoli e aggiornamenti frontend di Matteo Collina.",
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description:
        "Archivio degli articoli e aggiornamenti frontend di Matteo Collina.",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Archivio degli articoli e aggiornamenti frontend di Matteo Collina.",
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogPage(props: PageProps<"/blog">) {
  const [posts, categories] = await Promise.all([
    getAllPostSummaries(),
    getAllCategories(),
  ]);
  const searchParams = await props.searchParams;
  const requestedPage = parsePageParam(searchParams.page);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <BlogListing
      posts={visiblePosts}
      categories={categories}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
