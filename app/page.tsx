import { BlogListing } from "./components/blog-listing";
import {
  getAllCategories,
  getAllPostSummaries,
  POSTS_PER_PAGE,
} from "@/lib/blog";

export default async function Home() {
  const [posts, categories] = await Promise.all([
    getAllPostSummaries(),
    getAllCategories(),
  ]);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const visiblePosts = posts.slice(0, POSTS_PER_PAGE);

  return (
    <BlogListing
      posts={visiblePosts}
      categories={categories}
      currentPage={1}
      totalPages={totalPages}
    />
  );
}
