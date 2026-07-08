import Link from "next/link";
import type { Product } from "@/data/products";

function formatPrice(price: number): string {
  return price === 0 ? "Gratuit" : `${price} €`;
}

// Dégradés doux par catégorie pour la couverture (pas d'image externe).
const COVER_GRADIENT: Record<Product["category"], string> = {
  Formation: "from-indigo-100 to-violet-50",
  Ebook: "from-sky-100 to-cyan-50",
  Template: "from-amber-100 to-orange-50",
  Logiciel: "from-emerald-100 to-teal-50",
};

const COVER_GRADIENT_DARK: Record<Product["category"], string> = {
  Formation: "dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "dark:from-emerald-500/20 dark:to-teal-500/10",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-border-2 hover:shadow-soft-lg"
    >
      {/* Couverture — dégradé doux + initiale du produit */}
      <div
        className={`relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br ${COVER_GRADIENT[product.category]} ${COVER_GRADIENT_DARK[product.category]}`}
      >
        <span className="text-4xl font-extrabold text-fg/15">
          {product.title.charAt(0)}
        </span>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-fg">
              Nouveau
            </span>
          )}
          {product.verified && (
            <span className="rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-fg-2 backdrop-blur">
              ✓ Vérifié
            </span>
          )}
        </div>
      </div>

      {/* Corps */}
      <div className="flex flex-1 flex-col p-4">
        <div className="text-xs font-medium text-muted">
          {product.category} · {product.subCategory}
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-fg group-hover:text-accent">
          {product.title}
        </h3>
        <div className="mt-1 text-[13px] text-muted">par {product.creator}</div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-extrabold">
            {formatPrice(product.price)}
          </span>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">
            {product.platform}
          </span>
        </div>
      </div>
    </Link>
  );
}
