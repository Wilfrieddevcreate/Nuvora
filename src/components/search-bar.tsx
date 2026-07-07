"use client";

import { SearchIcon } from "@/components/icons";

/**
 * Barre de recherche (présentation). Non fonctionnelle pour la maquette front —
 * la recherche réelle sera branchée côté catalogue plus tard.
 */
export function SearchBar() {
  return (
    <form
      role="search"
      className="flex items-center gap-3 border-2 border-line-strong bg-card p-3.5"
      onSubmit={(e) => e.preventDefault()}
    >
      <SearchIcon className="size-[18px] shrink-0 text-muted" />
      <input
        type="search"
        placeholder="Rechercher une formation, un ebook, un template…"
        className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted-2"
        aria-label="Rechercher un produit"
      />
      <button
        type="submit"
        className="rounded-[2px] bg-accent px-4 py-2 text-[13px] font-medium uppercase tracking-[0.03em] text-white transition-colors hover:bg-ink"
      >
        Chercher
      </button>
    </form>
  );
}
