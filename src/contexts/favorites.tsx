"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface FavoritesCtx {
  favorites: string[];
  toggle: (slug: string) => void;
  isFav: (slug: string) => boolean;
}

const Ctx = createContext<FavoritesCtx>({
  favorites: [],
  toggle: () => {},
  isFav: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nuvora_favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  function toggle(slug: string) {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try { localStorage.setItem("nuvora_favorites", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return (
    <Ctx.Provider value={{ favorites, toggle, isFav: (slug) => favorites.includes(slug) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFavorites() {
  return useContext(Ctx);
}
