import clarity from "./blog/designing-for-clinical-clarity.mdx?raw";
import connected from "./blog/connected-care-teams.mdx?raw";
import data from "./blog/patient-data-with-purpose.mdx?raw";
import calm from "./blog/building-calm-digital-workspaces.mdx?raw";

export type BlogPostMetadata = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  coverImage: string;
  featured: boolean;
  readingTime: string;
};

export type BlogPost = BlogPostMetadata & { body: string };

const sources = [
  ["designing-for-clinical-clarity", clarity],
  ["connected-care-teams", connected],
  ["patient-data-with-purpose", data],
  ["building-calm-digital-workspaces", calm],
] as const;

function parsePost(slug: string, source: string): BlogPost {
  const [, frontmatter = "", body = ""] = source.split("---");
  const fields = Object.fromEntries(frontmatter.trim().split("\n").map((line) => {
    const separator = line.indexOf(":");
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
  }));
  return { slug, title: fields.title, excerpt: fields.excerpt, author: fields.author, publishedAt: fields.publishedAt, category: fields.category, coverImage: fields.coverImage, featured: fields.featured === "true", readingTime: fields.readingTime, body: body.trim() };
}

export const blogPosts = sources.map(([slug, source]) => parsePost(slug, source)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const getPost = (slug: string) => blogPosts.find((post) => post.slug === slug);
export const getFeaturedPosts = () => blogPosts.filter((post) => post.featured);
export const getCategories = () => ["All", ...Array.from(new Set(blogPosts.map((post) => post.category)))];
export const getRelatedPosts = (post: BlogPost) => blogPosts.filter((item) => item.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 2);
export const getHeadings = (body: string) => body.split("\n").filter((line) => line.startsWith("## ")).map((line) => ({ title: line.slice(3), id: slugify(line.slice(3)) }));
export const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
