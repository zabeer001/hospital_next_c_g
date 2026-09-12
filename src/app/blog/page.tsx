import type { Metadata } from "next";
import { BlogBrowser } from "@/components/blog-browser";
import { blogPosts, getCategories } from "@/content/posts";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical ideas for clearer systems, connected care teams, and meaningful healthcare operations.",
};

export default function BlogPage() {
  return (
    <main>
      <section className="site-shell pb-14 pt-16 sm:pb-20 sm:pt-24">
        <p className="eyebrow">The Doctor Tracker journal</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <h1 className="display-title max-w-4xl">
            Ideas for calmer, smarter care.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-muted lg:justify-self-end">
            Practical thinking on connected teams, useful health data, and
            digital experiences that respect people’s attention.
          </p>
        </div>
      </section>
      <section className="site-shell pb-24 sm:pb-32">
        <BlogBrowser posts={blogPosts} categories={getCategories()} />
      </section>
    </main>
  );
}
