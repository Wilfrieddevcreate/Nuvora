import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "@/data/blog";
import { ArrowRight } from "@/components/icons";

// ─── STATIC PARAMS ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

// ─── METADATA ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — Blog Nuvora`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://nuvora.app/blog/${post.slug}`,
      type: "article",
    },
    alternates: { canonical: `https://nuvora.app/blog/${post.slug}` },
  };
}

// ─── CONTENT RENDERER ─────────────────────────────────────────────────────────

/**
 * Transforme le markdown simplifié du champ `content` en HTML.
 * Le contenu est entièrement hardcodé — pas d'input utilisateur.
 */
function renderContent(raw: string): string {
  const html = raw
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Titre ## ou ###
      if (trimmed.startsWith("### ")) {
        return `<h3 class="text-lg font-bold text-fg mt-6 mb-2">${trimmed.slice(4)}</h3>`;
      }
      if (trimmed.startsWith("## ")) {
        return `<h2 class="text-xl font-bold text-fg mt-8 mb-3">${trimmed.slice(3)}</h2>`;
      }

      // Liste : lignes commençant par "- "
      if (trimmed.split("\n").every((l) => l.trimStart().startsWith("- ") || l.trim() === "")) {
        const items = trimmed
          .split("\n")
          .filter((l) => l.trimStart().startsWith("- "))
          .map((l) => `<li class="ml-4 list-disc">${inlineFormat(l.replace(/^[\s]*-\s/, ""))}</li>`)
          .join("");
        return `<ul class="my-3 space-y-1 text-[16px] leading-relaxed text-fg-2">${items}</ul>`;
      }

      // Paragraphe normal
      return `<p class="text-[16px] leading-relaxed text-fg-2 mt-0">${inlineFormat(trimmed)}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return html;
}

/** Transforme **gras** et *italique* inline. */
function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

// ─── HELPERS UI ───────────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, string> = {
  "Guide créateur": "bg-accent-soft text-accent",
  "Sélection": "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  "Ressources": "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  "Comparatif": "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
  "Marketing": "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
};

function CategoryBadge({ category }: { category: string }) {
  const cls = CATEGORY_STYLES[category] ?? "bg-surface-2 text-fg-2";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {category}
    </span>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = post.relatedSlugs
    .map((s) => POSTS.find((p) => p.slug === s))
    .filter(Boolean) as (typeof POSTS)[number][];

  const contentHtml = renderContent(post.content);
  const shortTitle = post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">

      {/* ─── BREADCRUMB ─── */}
      <nav
        aria-label="Fil d'ariane"
        className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted"
      >
        <Link href="/" className="hover:text-fg transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-fg transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-fg">{shortTitle}</span>
      </nav>

      {/* ─── LAYOUT 2 COLONNES ─── */}
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">

        {/* ─── CORPS DE L'ARTICLE ─── */}
        <article className="min-w-0 flex-1 lg:max-w-3xl">

          {/* Header */}
          <header className="mb-8">
            <CategoryBadge category={post.category} />
            <h1 className="mt-4 text-[clamp(24px,4vw,38px)] font-extrabold leading-tight text-fg">
              {post.title}
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span>{post.author}</span>
              <span aria-hidden className="size-1 rounded-full bg-border" />
              <span>{post.date}</span>
              <span aria-hidden className="size-1 rounded-full bg-border" />
              <span>{post.readTime} de lecture</span>
            </p>
            <p className="mt-4 text-lg leading-relaxed text-fg-2">{post.excerpt}</p>
            <div className="mt-6 h-px bg-border" />
          </header>

          {/* Contenu */}
          <div
            className="space-y-4"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>

        {/* ─── SIDEBAR STICKY ─── */}
        <aside className="w-full lg:w-64 lg:shrink-0 lg:sticky lg:top-8">
          <div className="rounded-2xl border border-border bg-accent-soft/40 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Vous créez des produits digitaux ?
            </p>
            <h2 className="mt-2 text-base font-bold text-fg leading-snug">
              Référencez vos produits sur Nuvora gratuitement
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-2">
              Rejoignez les créateurs qui génèrent du trafic organique via le catalogue Nuvora — sans commission.
            </p>
            <Link
              href="/createur"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-smooth hover:bg-accent-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Démarrer gratuitement
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </aside>
      </div>

      {/* ─── ARTICLES SIMILAIRES ─── */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="mb-6 text-lg font-bold">Articles similaires</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((rel) => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`}>
                <article className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg">
                  <CategoryBadge category={rel.category} />
                  <h3 className="mt-3 font-bold leading-snug group-hover:text-accent transition-colors">
                    {rel.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-2 line-clamp-2">
                    {rel.excerpt}
                  </p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                    <span>{rel.author}</span>
                    <span aria-hidden className="size-1 rounded-full bg-border" />
                    <span>{rel.readTime} de lecture</span>
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
