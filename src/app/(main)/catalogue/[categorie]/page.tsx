import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { filterProducts, CATEGORIES, type Category } from "@/data/products";

// Map URL slug → Category label
const SLUG_TO_CATEGORY: Record<string, Category> = {
  formation: "Formation",
  ebook: "Ebook",
  template: "Template",
  logiciel: "Logiciel",
};

const CATEGORY_META: Record<Category, { title: string; description: string; emoji: string }> = {
  Formation: {
    emoji: "🎓",
    title: "Formations en ligne",
    description:
      "Les meilleures formations digitales en français et en anglais. Dev, IA, marketing, business et plus.",
  },
  Ebook: {
    emoji: "📖",
    title: "Ebooks & guides",
    description:
      "Des ebooks pratiques pour apprendre à votre rythme. Business, finance, marketing, productivité.",
  },
  Template: {
    emoji: "⚡",
    title: "Templates & modèles",
    description:
      "Templates Notion, Figma, Framer et Excel créés par des experts. Gagnez du temps dès maintenant.",
  },
  Logiciel: {
    emoji: "💻",
    title: "Logiciels & outils",
    description:
      "SaaS, plugins et extensions pour booster votre productivité. Testés et validés par la communauté.",
  },
};

export async function generateStaticParams() {
  return Object.keys(SLUG_TO_CATEGORY).map((categorie) => ({ categorie }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const category = SLUG_TO_CATEGORY[categorie];
  if (!category) return { title: "Catégorie introuvable" };
  const meta = CATEGORY_META[category];
  return {
    title: `${meta.title} — Nuvora`,
    description: meta.description,
    alternates: { canonical: `https://nuvora.app/catalogue/${categorie}` },
    openGraph: {
      title: `${meta.title} — Nuvora`,
      description: meta.description,
      url: `https://nuvora.app/catalogue/${categorie}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const category = SLUG_TO_CATEGORY[categorie];
  if (!category) notFound();

  const products = filterProducts({
    query: "",
    categories: [category],
    prices: [],
    languages: [],
    platforms: [],
    sort: "populaires",
  });
  const meta = CATEGORY_META[category];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Fil d'ariane" className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/catalogue" className="hover:text-fg transition-colors">
          Catalogue
        </Link>
        <svg
          viewBox="0 0 24 24"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span aria-current="page" className="font-semibold text-fg">{category}</span>
      </nav>

      {/* Hero catégorie */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-3xl">
            {meta.emoji}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">{meta.title}</h1>
            <p className="mt-0.5 text-sm text-muted">
              {products.length} produit{products.length > 1 ? "s" : ""} référencé
              {products.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          href="/catalogue"
          className="shrink-0 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
        >
          ← Toutes les catégories
        </Link>
      </div>

      <p className="mb-8 max-w-2xl text-[15px] text-fg-2">{meta.description}</p>

      {/* Autres catégories */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Object.entries(SLUG_TO_CATEGORY)
          .filter(([, cat]) => cat !== category)
          .map(([slug, cat]) => (
            <Link
              key={slug}
              href={`/catalogue/${slug}`}
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-fg-2 transition-colors hover:border-accent hover:text-accent"
            >
              {CATEGORY_META[cat].emoji} {cat}
            </Link>
          ))}
      </div>

      {/* Grille produits */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="font-semibold text-fg">
            Aucun produit dans cette catégorie pour l&apos;instant.
          </p>
          <Link
            href="/catalogue"
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
          >
            Voir tout le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
