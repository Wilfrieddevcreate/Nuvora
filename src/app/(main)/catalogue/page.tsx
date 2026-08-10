import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { mapDbProduct } from "@/lib/product-mapper";
import { CatalogView } from "@/components/catalog-view";
import type { DbProduct } from "@/components/product-card";

export const metadata: Metadata = {
  title: "Catalogue de produits digitaux",
  description:
    "Explorez tous les produits digitaux référencés sur Nuvora : ebooks, formations, templates et logiciels. Filtrez par catégorie, prix, langue et plateforme.",
  keywords: [
    "catalogue produits digitaux",
    "ebooks",
    "formations en ligne",
    "templates",
    "logiciels",
    "filtrer produits digitaux",
  ],
  openGraph: {
    title: "Catalogue | Nuvora",
    description:
      "Explorez tous les produits digitaux référencés sur Nuvora : ebooks, formations, templates et logiciels.",
    url: "https://nuvora.app/catalogue",
    type: "website",
  },
  twitter: {
    title: "Catalogue | Nuvora",
    description: "Explorez ebooks, formations, templates et logiciels sur Nuvora.",
  },
  alternates: { canonical: "https://nuvora.app/catalogue" },
};

async function getProducts(searchParams: {
  q?: string;
  categorie?: string;
}): Promise<DbProduct[]> {
  const query = searchParams.q?.trim().toLowerCase() ?? "";
  const category = searchParams.categorie;

  // Charger seulement les produits nécessaires (limiter à 200)
  const rows = await db.product.findMany({
    where: {
      status: "active",
      ...(category && { category }),
    },
    include: {
      creator: {
        select: { slug: true, verified: true, user: { select: { name: true } } },
      },
    },
    take: 200,
  });

  // Filtrer et trier en une seule passe
  if (query) {
    return rows
      .filter((p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags?.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        // Créateurs vérifiés en premier
        if (a.creator.verified !== b.creator.verified) {
          return b.creator.verified ? -1 : 1;
        }
        // Puis par nombre de vues
        return b.views - a.views;
      })
      .map(mapDbProduct);
  }

  // Pas de requête = trier par créateur vérifié, puis vues
  return rows
    .sort((a, b) => {
      if (a.creator.verified !== b.creator.verified) {
        return b.creator.verified ? -1 : 1;
      }
      return b.views - a.views;
    })
    .map(mapDbProduct);
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const products = await getProducts({
    q: params.q,
    categorie: params.categorie,
  });

  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogView products={products} />
    </Suspense>
  );
}

function CatalogFallback() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="h-9 w-40 rounded-lg bg-surface-2 animate-pulse" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-4/5 rounded-2xl border border-border bg-surface animate-pulse"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
