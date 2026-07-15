import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog-view";

export const metadata: Metadata = {
  title: "Catalogue — Nuvora",
  description:
    "Explorez tous les produits digitaux référencés sur Nuvora : ebooks, formations, templates et logiciels. Filtrez par catégorie, prix et langue.",
};

export default function CataloguePage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogView />
    </Suspense>
  );
}

function CatalogFallback() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="h-9 w-40 rounded-lg bg-surface-2" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-2xl border border-border bg-surface"
          />
        ))}
      </div>
    </div>
  );
}
