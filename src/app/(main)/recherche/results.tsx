"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { SearchIcon } from "@/components/icons";
import { recommendProducts, CATEGORIES, toDbProduct, type Category } from "@/data/products";

export function SearchResults({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [input, setInput] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<Category | "">("");

  // sync avec l'URL
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
    setInput(q);
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(input.trim())}`);
    }
  }

  // calcul des résultats
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const recommended = recommendProducts(query, 20).map((r) => toDbProduct(r.product));
    if (activeCategory) return recommended.filter((p) => p.category === activeCategory);
    return recommended;
  }, [query, activeCategory]);

  const noQuery = !query.trim();

  return (
    <div className="space-y-8">
      {/* Barre de recherche inline */}
      <div className="space-y-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-full border border-border-2 bg-surface p-2 pl-5 shadow-soft focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft"
        >
          <SearchIcon className="size-5 shrink-0 text-muted" />
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Rechercher un produit…"
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-2"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Rechercher
          </button>
        </form>
        {query && (
          <p className="pl-2 text-sm text-muted">
            {results.length} résultat{results.length !== 1 ? "s" : ""} pour{" "}
            <span className="font-semibold text-fg">&quot;{query}&quot;</span>
          </p>
        )}
      </div>

      {/* Filtres catégorie */}
      {!noQuery && (
        <div className="flex flex-wrap gap-2">
          {(["", ...CATEGORIES] as (Category | "")[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? "bg-accent text-accent-fg"
                  : "border border-border bg-surface text-fg-2 hover:bg-surface-2"
              }`}
            >
              {cat || "Tous"}
            </button>
          ))}
        </div>
      )}

      {/* Résultats */}
      {noQuery ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="grid size-16 place-items-center rounded-2xl bg-surface-2 text-muted">
            <SearchIcon className="size-8" />
          </div>
          <p className="font-semibold text-fg">Que cherchez-vous ?</p>
          <p className="max-w-xs text-sm text-muted">
            Tapez un mot-clé, une catégorie ou un nom de créateur pour trouver des produits digitaux.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="grid size-16 place-items-center rounded-2xl bg-surface-2 text-muted">
            <SearchIcon className="size-8" />
          </div>
          <p className="font-semibold text-fg">Aucun résultat</p>
          <p className="max-w-xs text-sm text-muted">
            Essayez avec d&apos;autres mots-clés ou explorez le catalogue.
          </p>
          <a
            href="/catalogue"
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
          >
            Voir le catalogue
          </a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
