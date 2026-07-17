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

async function getProducts(): Promise<DbProduct[]> {
  const rows = await db.product.findMany({
    where: { status: "active" },
    orderBy: { views: "desc" },
    include: {
      creator: {
        select: { slug: true, verified: true, user: { select: { name: true } } },
      },
    },
  });
  return rows.map(mapDbProduct);
}

export default async function CataloguePage() {
  const products = await getProducts();
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogView products={products} />
    </Suspense>
  );
}

function CatalogFallback() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="h-9 w-40 rounded-lg bg-surface-2" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-4/5 rounded-2xl border border-border bg-surface" />
        ))}
      </div>
    </div>
  );
}
