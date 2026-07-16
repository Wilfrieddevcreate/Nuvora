import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog : ressources pour créateurs et acheteurs",
  description:
    "Conseils, guides et ressources pour créateurs de produits digitaux et acheteurs. Formations, ebooks, templates : tout ce que vous devez savoir.",
  alternates: { canonical: "https://nuvora.app/blog" },
  openGraph: {
    title: "Blog Nuvora : conseils pour créateurs et acheteurs",
    description: "Guides, comparatifs et ressources pour créateurs de produits digitaux et acheteurs. Formations, ebooks, templates.",
    url: "https://nuvora.app/blog",
    type: "website",
  },
};

const CATEGORY_STYLES: Record<string, string> = {
  "Guide créateur":
    "bg-accent-soft text-accent",
  "Sélection":
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  "Ressources":
    "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  "Comparatif":
    "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
  "Marketing":
    "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
};

function CategoryBadge({ category }: { category: string }) {
  const cls = CATEGORY_STYLES[category] ?? "bg-surface-2 text-fg-2";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {category}
    </span>
  );
}

function PostMeta({
  author,
  date,
  readTime,
}: {
  author: string;
  date: string;
  readTime: string;
}) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      <span>{author}</span>
      <span aria-hidden className="size-1 rounded-full bg-border" />
      <span>{date}</span>
      <span aria-hidden className="size-1 rounded-full bg-border" />
      <span>{readTime} de lecture</span>
    </p>
  );
}

export default function BlogPage() {
  const featured = POSTS.filter((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured);

  return (
    <>
      {/* ─── HEADER ─── */}
      <section className="relative overflow-hidden border-b border-border bg-accent-soft/30">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(55%_100%_at_50%_0%,var(--accent-soft),transparent)]"
        />
        <div className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-8 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-fg-2 sm:text-[13px]">
            <span className="size-1.5 rounded-full bg-accent" />
            {POSTS.length} articles
          </div>

          <h1 className="mt-6 text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.06]">
            Blog
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-fg-2">
            Conseils, guides et ressources pour créateurs de produits digitaux et
            acheteurs : ebooks, formations, templates et plus.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 space-y-14">

        {/* ─── ARTICLES FEATURED ─── */}
        <section>
          <h2 className="mb-6 text-lg font-bold">À la une</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {featured.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article
                  className="group flex flex-col justify-between gap-5 rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg sm:flex-row sm:items-start sm:gap-6"
                >
                  <div className="min-w-0 flex-1">
                    <CategoryBadge category={post.category} />
                    <h3 className="mt-3 text-lg font-bold leading-snug group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-fg-2 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <PostMeta author={post.author} date={post.date} readTime={post.readTime} />
                  </div>
                  <div className="shrink-0 self-end sm:self-start">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm font-semibold text-fg transition-colors group-hover:border-accent group-hover:text-accent"
                      aria-hidden="true"
                    >
                      Lire l&apos;article
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── GRILLE DES AUTRES ARTICLES ─── */}
        <section>
          <h2 className="mb-6 text-lg font-bold">Tous les articles</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
                >
                  <div className="flex-1">
                    <CategoryBadge category={post.category} />
                    <h3 className="mt-3 font-bold leading-snug group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-fg-2 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <PostMeta author={post.author} date={post.date} readTime={post.readTime} />
                    <span
                      className="ml-3 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent transition-opacity group-hover:opacity-80"
                      aria-hidden="true"
                    >
                      Lire
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── CTA BAS DE PAGE ─── */}
        <div className="rounded-2xl border border-border bg-surface-2/60 px-6 py-5 text-center text-sm text-fg-2">
          Vous créez des produits digitaux ?{" "}
          <Link href="/createur" className="font-medium text-accent hover:underline">
            Référencez-les gratuitement sur Nuvora →
          </Link>
        </div>

      </div>
    </>
  );
}
