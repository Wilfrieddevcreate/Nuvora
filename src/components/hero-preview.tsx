import { getPopularProducts } from "@/data/products";

const COVER: Record<string, string> = {
  Formation: "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

/**
 * Aperçu produit du hero : une seule carte nette, mise en scène calmement
 * dans un cadre. Statique, sobre — pas d'éléments qui volent.
 */
export function HeroPreview() {
  const [featured] = getPopularProducts(1);

  return (
    <div className="relative">
      {/* cartes en arrière-plan, à peine décalées : suggère la profondeur du catalogue */}
      <div
        aria-hidden
        className="absolute -right-3 top-4 h-full w-full rounded-3xl border border-border bg-surface/60"
      />
      <div
        aria-hidden
        className="absolute -right-1.5 top-2 h-full w-full rounded-3xl border border-border bg-surface/80"
      />

      {/* carte vedette nette */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-soft-lg">
        <div
          className={`flex aspect-[16/10] items-center justify-center bg-gradient-to-br ${COVER[featured.category]}`}
        >
          <span className="text-5xl font-extrabold text-fg/15">
            {featured.title.charAt(0)}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <span>{featured.category}</span>
            <span className="size-1 rounded-full bg-border-2" />
            <span>{featured.subCategory}</span>
          </div>
          <h3 className="mt-2 text-lg font-bold leading-snug">
            {featured.title}
          </h3>
          <div className="mt-1 text-sm text-muted">par {featured.creator}</div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-extrabold">{featured.price} €</span>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              {featured.platform}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
