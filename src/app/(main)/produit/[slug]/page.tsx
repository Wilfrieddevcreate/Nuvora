import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductReviews } from "@/components/product-reviews";
import { ArrowUpRight } from "@/components/icons";
import {
  getAllSlugs,
  getProductBySlug,
  getRelatedProducts,
  type Product,
} from "@/data/products";

const COVER: Record<Product["category"], string> = {
  Formation:
    "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template:
    "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel:
    "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

// Génère les routes statiques pour chaque produit.
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  const url = `https://nuvora.app/produit/${product.slug}`;
  return {
    title: product.title,
    description: product.description,
    keywords: [
      product.category,
      product.subCategory,
      product.creator,
      ...product.tags,
      "produit digital",
      product.platform,
    ],
    authors: [{ name: product.creator }],
    openGraph: {
      title: `${product.title} — Nuvora`,
      description: product.description,
      url,
      type: "article",
      tags: product.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
    },
    alternates: { canonical: url },
  };
}

function formatPrice(price: number): string {
  return price === 0 ? "Gratuit" : `${price} €`;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Fil d'ariane */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/catalogue" className="hover:text-fg">
          Catalogue
        </Link>
        <span>/</span>
        <Link
          href={`/catalogue?categorie=${encodeURIComponent(product.category)}`}
          className="hover:text-fg"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="truncate text-fg">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Colonne gauche : visuel + description */}
        <div>
          <div
            className={`flex aspect-16/10 items-center justify-center rounded-3xl border border-border bg-linear-to-br ${COVER[product.category]}`}
          >
            <span className="text-7xl font-extrabold text-fg/15">
              {product.title.charAt(0)}
            </span>
          </div>

          {/* badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {product.isNew && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg">
                Nouveau
              </span>
            )}
            {product.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-fg-2">
                <svg viewBox="0 0 24 24" className="size-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                Créateur vérifié
              </span>
            )}
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
              {product.language}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            {product.title}
          </h1>
          <div className="mt-2 text-fg-2">
            {product.category} · {product.subCategory} · par{" "}
            <Link
              href={`/createur/${product.creatorSlug}`}
              className="font-semibold text-fg hover:text-accent"
            >
              {product.creator}
            </Link>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold">Description</h2>
            <p className="mt-3 leading-relaxed text-fg-2">
              {product.description}
            </p>
          </div>

          {/* tags */}
          {product.tags.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold">Tags</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-surface-2 px-3 py-1 text-sm text-fg-2"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* à propos du créateur */}
          <Link
            href={`/createur/${product.creatorSlug}`}
            className="mt-8 flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-2 hover:shadow-soft"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-base font-bold text-accent-fg">
              {product.creator.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">{product.creator}</span>
                {product.verified && (
                  <span className="text-xs font-medium text-accent">
                    ✓ Vérifié
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">
                Créateur sur {product.platform}
              </p>
            </div>
            <svg
              viewBox="0 0 24 24"
              className="size-4 shrink-0 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Colonne droite : carte d'achat (sticky) */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-extrabold">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-muted">{product.currency}</span>
            </div>

            <a
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
            >
              Acheter maintenant
              <ArrowUpRight className="size-4" />
            </a>
            <p className="mt-3 text-center text-xs text-muted">
              Vous serez redirigé vers{" "}
              <span className="font-semibold text-fg-2">
                {product.platform}
              </span>{" "}
              pour finaliser l’achat.
            </p>

            <dl className="mt-6 divide-y divide-border border-t border-border">
              <InfoRow
                label="Créateur"
                value={
                  <Link
                    href={`/createur/${product.creatorSlug}`}
                    className="text-accent hover:text-accent-hover"
                  >
                    {product.creator}
                  </Link>
                }
              />
              <InfoRow
                label="Catégorie"
                value={`${product.category} · ${product.subCategory}`}
              />
              <InfoRow label="Plateforme" value={product.platform} />
              <InfoRow label="Langue" value={product.language} />
              <InfoRow
                label="Popularité"
                value={`${product.views.toLocaleString("fr-FR")} vues`}
              />
            </dl>
          </div>

          <p className="mt-4 px-2 text-center text-xs text-muted">
            Nuvora ne traite aucun paiement. L’achat se fait directement chez le
            créateur.
          </p>
        </aside>
      </div>

      {/* Produits similaires */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="mb-6 text-2xl font-extrabold">Produits similaires</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <ProductReviews slug={product.slug} />
    </div>
  );
}
