import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog-browser";
import { MarkdownArticle } from "@/components/markdown-article";
import { blogPosts, getHeadings, getPost, getRelatedPosts } from "@/content/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return blogPosts.map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` }, openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.publishedAt, authors: [post.author], images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] }, twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.coverImage] } };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const headings = getHeadings(post.body);
  const related = getRelatedPosts(post);
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`;

  return (
    <main>
      <article>
        <header className="site-shell pb-12 pt-14 sm:pb-16 sm:pt-20">
          <Link href="/blog" className="text-sm font-semibold text-muted hover:text-coral">← Back to insights</Link>
          <div className="mt-10 max-w-5xl"><p className="eyebrow">{post.category}</p><h1 className="display-title mt-6 text-balance">{post.title}</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-muted">{post.excerpt}</p><div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"><strong>{post.author}</strong><span className="text-muted">{formatDate(post.publishedAt)}</span><span className="text-muted">{post.readingTime}</span></div></div>
        </header>
        <div className="article-hero"><div className="article-hero-orbit" /><div className="article-hero-copy"><span>{post.category}</span><strong>Think clearly.<br />Care deeply.</strong></div></div>
        <div className="site-shell grid gap-12 py-16 lg:grid-cols-[230px_minmax(0,700px)_1fr] lg:py-24">
          <aside className="lg:sticky lg:top-28 lg:self-start"><p className="text-xs font-bold uppercase tracking-[.15em]">In this article</p><nav className="mt-5 flex flex-col gap-3 border-l border-forest/15 pl-4" aria-label="Table of contents">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="text-sm leading-5 text-muted hover:text-coral">{heading.title}</a>)}</nav></aside>
          <MarkdownArticle source={post.body} />
          <aside className="lg:sticky lg:top-28 lg:self-start"><p className="text-xs font-bold uppercase tracking-[.15em]">Share</p><div className="mt-4 flex gap-2 lg:flex-col"><a className="share-link" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer">LinkedIn ↗</a><a className="share-link" href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(pageUrl)}`}>Email ↗</a></div></aside>
        </div>
      </article>
      <section className="border-t border-forest/10 bg-white py-20"><div className="site-shell"><div className="flex items-end justify-between"><div><p className="eyebrow">Keep reading</p><h2 className="mt-4 text-4xl font-medium tracking-[-.04em]">Related insights</h2></div><Link href="/blog" className="hidden text-sm font-semibold sm:block">View all →</Link></div><div className="mt-10 grid gap-6 md:grid-cols-2">{related.map((item, index) => <ArticleCard key={item.slug} post={item} index={index + 1} />)}</div></div></section>
    </main>
  );
}

function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date)); }
