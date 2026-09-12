import type { Metadata } from "next";

import { BlogListing } from "@/app/components/blog-listing";
import { getAllPostSummaries, POSTS_PER_PAGE } from "@/lib/blog";
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
    currentPage <= 1 ? `Ultime notizie | ${siteConfig.name}` : `Ultime notizie - Pagina ${currentPage} | ${siteConfig.name}`;

  return {
    title: currentPage <= 1 ? "Ultime notizie" : `Ultime notizie - Pagina ${currentPage}`,
    description: "Notizie, analisi e consigli per il fantacalcio.",
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description: "Notizie, analisi e consigli per il fantacalcio.",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Notizie, analisi e consigli per il fantacalcio.",
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogPage(props: PageProps<"/blog">) {
  const posts = await getAllPostSummaries();
  const searchParams = await props.searchParams;
  const requestedPage = parsePageParam(searchParams.page);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <BlogListing
      posts={visiblePosts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
