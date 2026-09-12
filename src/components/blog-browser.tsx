"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPostMetadata } from "@/content/posts";

export function BlogBrowser({ posts, categories }: { posts: BlogPostMetadata[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => posts.filter((post) => {
    const matchesCategory = category === "All" || post.category === category;
    const text = `${post.title} ${post.excerpt} ${post.author}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  }), [category, posts, query]);

  return (
    <div>
      <div className="flex flex-col gap-5 border-y border-forest/15 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="Filter articles by category">{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`filter-chip ${category === item ? "filter-chip-active" : ""}`}>{item}</button>)}</div>
        <label className="search-field"><span aria-hidden="true">⌕</span><span className="sr-only">Search insights</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search insights" /></label>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">{filtered.map((post, index) => <ArticleCard key={post.slug} post={post} index={index} />)}</div>
      ) : (
        <div className="my-20 rounded-[2rem] border border-dashed border-forest/20 bg-white px-6 py-16 text-center"><p className="text-4xl" aria-hidden="true">⌕</p><h2 className="mt-4 text-2xl font-medium">No insights found</h2><p className="mt-3 text-muted">Try a different keyword or explore another category.</p><button type="button" className="button button-outline mt-7" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>
      )}
    </div>
  );
}

export function ArticleCard({ post, index = 0 }: { post: BlogPostMetadata; index?: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="article-card group overflow-hidden">
      <div className={`article-visual visual-${(index % 3) + 1}`}><span>{post.category}</span><div className="visual-ring" /></div>
      <div className="p-7"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-muted">{formatDate(post.publishedAt)} · {post.readingTime}</p><h2 className="mt-4 text-2xl font-medium leading-tight tracking-tight group-hover:text-coral">{post.title}</h2><p className="mt-3 line-clamp-3 leading-7 text-muted">{post.excerpt}</p><span className="mt-6 inline-block text-sm font-semibold">Read article →</span></div>
    </Link>
  );
}

function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date)); }
