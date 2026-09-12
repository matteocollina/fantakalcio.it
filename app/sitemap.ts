import type { MetadataRoute } from "next";

import { getAllCategories, getAllPostSummaries, getPostsByTagSlug } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPostSummaries(), getAllCategories()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: posts[0]?.publishedAt ? new Date(posts[0].publishedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = await Promise.all(
    categories.map(async (category) => {
      const categoryPosts = await getPostsByTagSlug(category.slug);
      return {
        url: absoluteUrl(`/categorie/${category.slug}`),
        lastModified: categoryPosts[0]?.publishedAt ? new Date(categoryPosts[0].publishedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    }),
  );

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
