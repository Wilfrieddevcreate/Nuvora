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
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-2 rounded-full border border-border-2 bg-surface p-2 pl-5 shadow-soft focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft"
    >
      <SearchIcon className="size-5 shrink-0 text-muted" />
      <input
        type="search"
        aria-label="Rechercher un produit"
        placeholder="Rechercher un produit…"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
      >
        Rechercher
      </button>
    </form>
  );
}
