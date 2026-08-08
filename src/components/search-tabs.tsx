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
      {/* Onglets — défilent horizontalement sur mobile, sans scrollbar */}
      <div
        role="tablist"
        aria-label="Type de produit"
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-smooth active:scale-95 " +
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
          className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-2 transition-smooth"
        />
        <button
          type="submit"
          aria-label="Rechercher"
          className="flex shrink-0 items-center justify-center rounded-lg bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-fg transition-smooth hover:bg-accent-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-5"
        >
          {/* icône seule sur très petit écran, libellé dès sm */}
          <SearchIcon className="size-5 sm:hidden" />
          <span className="hidden sm:inline">Rechercher</span>
        </button>
      </form>
    </div>
  );
}
