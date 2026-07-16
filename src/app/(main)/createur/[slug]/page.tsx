import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import {
  getCreatorBySlug,
  getAllCreatorSlugs,
  getProductsByCreator,
} from "@/data/products";

export function generateStaticParams() {
  return getAllCreatorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);
  if (!creator) return { title: "Créateur introuvable" };
  const products = getProductsByCreator(slug);
  const url = `https://nuvora.app/createur/${creator.slug}`;
  return {
    title: `${creator.name}, créateur sur Nuvora`,
    description: `${creator.tagline}. Découvrez les ${products.length} produit${products.length > 1 ? "s" : ""} digital${products.length > 1 ? "s" : ""} de ${creator.name} référencé${products.length > 1 ? "s" : ""} sur Nuvora.`,
    keywords: [
      creator.name,
      creator.specialty,
      "créateur produits digitaux",
      creator.platform,
      ...products.flatMap((p) => p.tags).slice(0, 6),
    ],
    authors: [{ name: creator.name }],
    openGraph: {
      title: `${creator.name}, créateur sur Nuvora`,
      description: creator.bio,
      url,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${creator.name} sur Nuvora`,
      description: creator.tagline,
    },
    alternates: { canonical: url },
  };
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);
  if (!creator) notFound();

  const products = getProductsByCreator(slug);
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const totalClicks = products.reduce((sum, p) => sum + p.clicks, 0);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Fil d'ariane */}
      <nav aria-label="Fil d'ariane" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-fg">Accueil</Link>
        <span>/</span>
        <Link href="/catalogue" className="hover:text-fg">Catalogue</Link>
        <span>/</span>
        <span aria-current="page" className="text-fg">{creator.name}</span>
      </nav>

      {/* ─── EN-TÊTE CRÉATEUR ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
        {/* Bandeau de couleur */}
        <div className={`h-24 sm:h-32 ${creator.color} opacity-20`} />

        <div className="px-6 pb-8 sm:px-8">
          {/* Avatar + badges */}
          <div className="flex flex-wrap items-end gap-4 -mt-8 sm:-mt-10">
            <span
              className={`grid size-16 shrink-0 place-items-center rounded-2xl ${creator.color} text-2xl font-extrabold text-white shadow-soft ring-4 ring-surface sm:size-20 sm:text-3xl`}
            >
              {creator.name.charAt(0)}
            </span>

            <div className="mb-1 flex flex-wrap items-center gap-2">
              {creator.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Créateur vérifié
                </span>
              )}
              <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                {creator.specialty}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                Sur Nuvora depuis {creator.joinedYear}
              </span>
            </div>
          </div>

          {/* Nom + tagline + bio */}
          <div className="mt-5">
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              {creator.name}
            </h1>
            <p className="mt-1 font-medium text-accent">{creator.tagline}</p>
            <p className="mt-4 max-w-2xl leading-relaxed text-fg-2">
              {creator.bio}
            </p>
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-6 border-t border-border pt-6">
            <div>
              <p className="text-xl font-extrabold">
                {products.length}
              </p>
              <p className="text-sm text-muted">
                produit{products.length > 1 ? "s" : ""} référencé{products.length > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-xl font-extrabold">
                {totalViews.toLocaleString("fr-FR")}
              </p>
              <p className="text-sm text-muted">vues cumulées</p>
            </div>
            <div>
              <p className="text-xl font-extrabold">
                {totalClicks.toLocaleString("fr-FR")}
              </p>
              <p className="text-sm text-muted">clics sortants</p>
            </div>
            <div>
              <p className="text-xl font-extrabold">{creator.platform}</p>
              <p className="text-sm text-muted">plateforme de vente</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PRODUITS DU CRÉATEUR ─── */}
      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">
              Produits de {creator.name}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/catalogue"
            className="text-sm font-medium text-accent hover:text-accent-hover"
          >
            Voir tout le catalogue →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center text-muted">
            Aucun produit référencé pour le moment.
          </div>
        )}
      </section>

      {/* ─── CTA rejoindre ─── */}
      <div className="mt-14 rounded-3xl border border-border bg-surface-2/60 px-8 py-10 text-center">
        <p className="text-lg font-bold">
          Vous êtes créateur ?
        </p>
        <p className="mt-2 text-fg-2">
          Référencez vos produits gratuitement et touchez une audience qualifiée.
        </p>
        <Link
          href="/createur"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
        >
          En savoir plus
        </Link>
      </div>
    </div>
  );
}
