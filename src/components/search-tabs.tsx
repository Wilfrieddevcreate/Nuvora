"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons";
import { CATEGORIES } from "@/data/products";

const TABS = ["Tout", ...CATEGORIES] as const;

/**
 * Onglets de catégories + barre de recherche, façon panneau flottant.
 * L'onglet actif filtrera le catalogue (paramètre transmis à la recherche).
 * Maquette front : la soumission redirige vers /catalogue avec les params.
 */
export function SearchTabs() {
  const router = useRouter();
  const [active, setActive] = useState<string>("Tout");
  const [query, setQuery] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (active !== "Tout") params.set("categorie", active);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.push(`/catalogue${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-2 shadow-soft-lg">
      {/* Onglets */}
      <div
        role="tablist"
        aria-label="Type de produit"
        className="flex flex-wrap gap-1 px-1 pb-2"
      >
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className={
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors " +
                (isActive
                  ? "bg-accent-soft text-accent"
                  : "text-fg-2 hover:bg-surface-2 hover:text-fg")
              }
            >
              {tab === "Formation"
                ? "Formations"
                : tab === "Ebook"
                  ? "Ebooks"
                  : tab === "Template"
                    ? "Templates"
                    : tab === "Logiciel"
                      ? "Logiciels"
                      : tab}
            </button>
          );
        })}
      </div>

      {/* Barre de recherche */}
      <form
        role="search"
        onSubmit={submit}
        className="flex items-center gap-2 rounded-xl border border-border bg-bg p-1.5 pl-4 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft"
      >
        <SearchIcon className="size-5 shrink-0 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher un produit"
          placeholder={
            active === "Tout"
              ? "Rechercher un produit…"
              : `Rechercher dans ${active.toLowerCase()}s…`
          }
          className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
        >
          Rechercher
        </button>
      </form>
    </div>
  );
}
