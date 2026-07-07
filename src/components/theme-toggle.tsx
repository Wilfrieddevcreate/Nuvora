"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/**
 * Bascule light/dark en ajoutant/retirant la classe .dark sur <html>.
 * Le choix est mémorisé dans localStorage. Pas de dépendance externe.
 */
export function ThemeToggle() {
  // undefined tant que non hydraté → évite le flash d'un mauvais libellé.
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem("nuvora-theme") as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");
    // localStorage/matchMedia ne sont dispo que côté client : l'init du thème
    // doit se faire après montage pour éviter tout décalage d'hydratation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("nuvora-theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Changer de thème"
      className="h-9 rounded-[2px] border-2 border-line-strong px-3.5 text-[12px] font-medium uppercase tracking-[0.05em] transition-colors hover:bg-ink hover:text-paper"
    >
      {theme === undefined ? "Thème" : theme === "dark" ? "Clair" : "Sombre"}
    </button>
  );
}
