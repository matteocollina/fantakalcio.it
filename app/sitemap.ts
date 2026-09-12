import type { MetadataRoute } from "next";

import {
  getAllCategories,
  getAllPostSummaries,
  getPostsByTagSlug,
} from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

function latestDate(dates: Array<string | Date>) {
  return dates.reduce((latest, candidate) => {
    const candidateDate = new Date(candidate);
    return candidateDate > latest ? candidateDate : latest;
  }, new Date(0));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    getAllPostSummaries(),
    getAllCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: posts[0]?.publishedAt ? new Date(posts[0].publishedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const categoryRoutes = await Promise.all(
    categories.map(async (category) => {
      const categoryPosts = await getPostsByTagSlug(category.slug);

      return {
        url: absoluteUrl(`/blog/categorie/${category.slug}`),
        lastModified:
          categoryPosts.length > 0
            ? latestDate(categoryPosts.map((post) => post.publishedAt))
            : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    }),
  );

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
