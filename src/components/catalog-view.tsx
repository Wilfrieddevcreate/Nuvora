"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Select } from "@/components/ui/select";
import { SearchIcon } from "@/components/icons";
import {
  CATEGORIES,
  LANGUAGES,
  PLATFORMS,
  PRICE_BANDS,
  SORTS,
  filterProducts,
  type Category,
  type Platform,
  type PriceBand,
  type Product,
  type SortId,
} from "@/data/products";

// --- Lecture/écriture des filtres dans l'URL ---

function parseFilters(params: URLSearchParams) {
  const categories = (params.get("categorie")?.split(",") ?? []).filter(
    (c): c is Category => (CATEGORIES as string[]).includes(c),
  );
  const prices = (params.get("prix")?.split(",") ?? []).filter(
    (p): p is PriceBand => PRICE_BANDS.some((b) => b.id === p),
  );
  const languages = (params.get("langue")?.split(",") ?? []).filter(
    (l): l is Product["language"] => (LANGUAGES as string[]).includes(l),
  );
  const platforms = (params.get("plateforme")?.split(",") ?? []).filter(
    (p): p is Platform => (PLATFORMS as string[]).includes(p),
  );
  const sortParam = params.get("tri");
  const sort: SortId = SORTS.some((s) => s.id === sortParam)
    ? (sortParam as SortId)
    : "populaires";
  return {
    query: params.get("q") ?? "",
    categories,
    prices,
    languages,
    platforms,
    sort,
  };
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-fg-2 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="grid size-[18px] place-items-center rounded-md border-2 border-border-2 transition-colors peer-checked:border-accent peer-checked:bg-accent">
        {checked && (
          <svg viewBox="0 0 24 24" className="size-3 text-accent-fg" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12l5 5L20 7" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

export function CatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseFilters(new URLSearchParams(searchParams.toString()));
  const [mobileOpen, setMobileOpen] = useState(false);

  const results = filterProducts(filters);
  const activeCount =
    filters.categories.length +
    filters.prices.length +
    filters.languages.length +
    filters.platforms.length;

  // Met à jour l'URL (donc les filtres) sans recharger la page.
  function update(next: Partial<typeof filters>) {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();
    if (merged.query) params.set("q", merged.query);
    if (merged.categories.length)
      params.set("categorie", merged.categories.join(","));
    if (merged.prices.length) params.set("prix", merged.prices.join(","));
    if (merged.languages.length)
      params.set("langue", merged.languages.join(","));
    if (merged.platforms.length)
      params.set("plateforme", merged.platforms.join(","));
    if (merged.sort !== "populaires") params.set("tri", merged.sort);
    const qs = params.toString();
    router.replace(qs ? `/catalogue?${qs}` : "/catalogue", { scroll: false });
  }

  function toggle<T>(list: T[], value: T): T[] {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
  }

  function resetAll() {
    router.replace("/catalogue", { scroll: false });
  }

  const filtersPanel = (
    <div className="space-y-6">
      <FilterGroup title="Catégorie">
        {CATEGORIES.map((c) => (
          <Checkbox
            key={c}
            label={c === "Formation" ? "Formations" : c === "Ebook" ? "Ebooks" : c === "Template" ? "Templates" : "Logiciels"}
            checked={filters.categories.includes(c)}
            onChange={() => update({ categories: toggle(filters.categories, c) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Prix">
        {PRICE_BANDS.map((b) => (
          <Checkbox
            key={b.id}
            label={b.label}
            checked={filters.prices.includes(b.id)}
            onChange={() => update({ prices: toggle(filters.prices, b.id) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Langue">
        {LANGUAGES.map((l) => (
          <Checkbox
            key={l}
            label={l}
            checked={filters.languages.includes(l)}
            onChange={() => update({ languages: toggle(filters.languages, l) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Plateforme">
        {PLATFORMS.map((pl) => (
          <Checkbox
            key={pl}
            label={pl}
            checked={filters.platforms.includes(pl)}
            onChange={() => update({ platforms: toggle(filters.platforms, pl) })}
          />
        ))}
      </FilterGroup>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={resetAll}
          className="text-sm font-medium text-accent hover:underline"
        >
          Effacer les filtres ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Catalogue</h1>
        <p className="mt-2 text-fg-2">
          Explorez tous les produits digitaux référencés sur Nuvora.
        </p>
      </div>

      {/* Barre : recherche + tri */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft">
          <SearchIcon className="size-5 shrink-0 text-muted" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Rechercher un produit…"
            aria-label="Rechercher un produit"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium lg:hidden"
          >
            Filtres
            {activeCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-accent text-xs font-bold text-accent-fg">
                {activeCount}
              </span>
            )}
          </button>

          <Select
            label="Trier"
            ariaLabel="Trier les produits"
            value={filters.sort}
            options={SORTS.map((s) => ({ value: s.id, label: s.label }))}
            onChange={(v) => update({ sort: v })}
            className="min-w-[190px]"
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filtres (desktop) */}
        <aside className="hidden w-56 shrink-0 lg:block">{filtersPanel}</aside>

        {/* Grille */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 text-sm text-muted">
            {results.length} produit{results.length > 1 ? "s" : ""}
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-2 py-16 text-center">
              <p className="font-bold">Aucun produit ne correspond.</p>
              <p className="mt-1 text-sm text-muted">
                Essayez d’élargir vos filtres ou votre recherche.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-4 text-sm font-medium text-accent hover:underline"
              >
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drawer filtres (mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Fermer les filtres"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-bg p-6 shadow-soft-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Filtres</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer"
                className="grid size-9 place-items-center rounded-full border border-border-2 text-fg-2 hover:bg-surface-2"
              >
                ✕
              </button>
            </div>
            {filtersPanel}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mt-8 w-full rounded-full bg-accent py-3 text-sm font-semibold text-accent-fg"
            >
              Voir les {results.length} résultats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
        {title}
      </h3>
      {children}
    </div>
  );
}
