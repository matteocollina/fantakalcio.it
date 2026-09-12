import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { unstable_cache } from "next/cache";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
export const POSTS_PER_PAGE = 10;

export type BlogPostFrontmatter = {
  title: string;
  subtitle: string;
  description: string;
  publishedAt: string;
  tags: string[];
};

export type BlogPostSummary = BlogPostFrontmatter & {
  slug: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

export type BlogCategory = {
  name: string;
  slug: string;
  count: number;
};

function normalizeFrontmatterValue(value: string) {
  const normalized = value.trim();

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    return normalized.slice(1, -1);
  }

  return normalized;
}

function normalizeMarkdownSource(source: string) {
  return source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

function parseFrontmatter(source: string): BlogPostFrontmatter & { content: string } {
  const normalizedSource = normalizeMarkdownSource(source);
  const match = normalizedSource.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error("Post markdown senza frontmatter valido.");
  }

  const [, rawFrontmatter, content] = match;
  const entries = rawFrontmatter
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        throw new Error(`Frontmatter non valido: ${line}`);
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      return [key, value] as const;
    });

  const frontmatter = Object.fromEntries(entries);
  const title = normalizeFrontmatterValue(frontmatter.title);
  const subtitle = normalizeFrontmatterValue(frontmatter.subtitle);
  const description = normalizeFrontmatterValue(frontmatter.description);
  const publishedAt = normalizeFrontmatterValue(frontmatter.publishedAt);
  const tags = parseFrontmatterTags(frontmatter.tags);

  if (!title || !subtitle || !description || !publishedAt) {
    throw new Error("Frontmatter incompleto nel post markdown.");
  }

  return {
    title,
    subtitle,
    description,
    publishedAt,
    tags,
    content: content.trim(),
  };
}

function parseFrontmatterTags(value: string | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function sortPosts<T extends BlogPostSummary>(posts: T[]) {
  return posts.sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
}

function sortCategories(categories: BlogCategory[]) {
  return categories.sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.name.localeCompare(right.name, "it");
  });
}

const loadAllPostSummaries = unstable_cache(
  async () => {
    const entries = await readdir(BLOG_DIR, { withFileTypes: true });
    const posts = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map(async (entry) => {
          const slug = entry.name.replace(/\.md$/, "");
          const source = await readFile(path.join(BLOG_DIR, entry.name), "utf8");
          const post = parseFrontmatter(source);

          return {
            slug,
            title: post.title,
            subtitle: post.subtitle,
            description: post.description,
            publishedAt: post.publishedAt,
            tags: post.tags,
          };
        }),
    );

    return sortPosts(posts);
  },
  ["blog-posts"],
  {
    revalidate: 3600,
    tags: ["blog-posts"],
  },
);

export async function getAllPostSummaries() {
  return loadAllPostSummaries();
}

export async function getPostBySlug(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  try {
    const source = await readFile(filePath, "utf8");
    const post = parseFrontmatter(source);

    return {
      slug,
      ...post,
    };
  } catch {
    return null;
  }
}

export async function getAdjacentPosts(slug: string) {
  const posts = await getAllPostSummaries();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return {
      previousPost: null,
      nextPost: null,
    };
  }

  return {
    previousPost: posts[currentIndex - 1] ?? null,
    nextPost: posts[currentIndex + 1] ?? null,
  };
}

export function slugifyTag(tag: string) {
  return tag
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getAllCategories() {
  const posts = await getAllPostSummaries();
  const categories = new Map<string, BlogCategory>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = slugifyTag(tag);

      if (!slug) {
        continue;
      }

      const existing = categories.get(slug);

      if (existing) {
        existing.count += 1;
        continue;
      }

      categories.set(slug, {
        name: tag,
        slug,
        count: 1,
      });
    }
  }

  return sortCategories([...categories.values()]);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getAllCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getPostsByTagSlug(slug: string) {
  const posts = await getAllPostSummaries();

  return posts.filter((post) =>
    post.tags.some((tag) => slugifyTag(tag) === slug),
  );
}

export function formatPublishedAt(date: string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "long",
  }).format(new Date(date));
}
