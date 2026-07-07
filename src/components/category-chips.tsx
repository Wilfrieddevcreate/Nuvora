import Link from "next/link";
import { CATEGORIES } from "@/data/products";

/**
 * Puces de catégories. "Tout" est actif par défaut sur l'accueil ;
 * chaque puce mène au catalogue filtré (paramètre lu côté catalogue plus tard).
 */
export function CategoryChips({ active = "Tout" }: { active?: string }) {
  const items = ["Tout", ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((label) => {
        const isActive = label === active;
        const href =
          label === "Tout"
            ? "/catalogue"
            : `/catalogue?categorie=${encodeURIComponent(label)}`;
        return (
          <Link
            key={label}
            href={href}
            className={
              "rounded-[2px] border-[1.5px] px-3 py-1.5 text-[12.5px] font-medium uppercase tracking-[0.02em] transition-colors " +
              (isActive
                ? "border-ink bg-ink text-paper"
                : "border-line bg-card text-muted hover:border-ink hover:text-ink")
            }
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
