import { BlogListing } from "./components/blog-listing";
import { getAllPostSummaries, POSTS_PER_PAGE } from "@/lib/blog";

export default async function Home() {
  const posts = await getAllPostSummaries();
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const visiblePosts = posts.slice(0, POSTS_PER_PAGE);

  return (
    <BlogListing
      posts={visiblePosts}
      currentPage={1}
      totalPages={totalPages}
    />
  );
}
