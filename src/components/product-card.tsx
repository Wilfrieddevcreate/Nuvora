"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { useFavorites } from "@/contexts/favorites";
import { useToast } from "@/contexts/toast";

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

function FavButton({ slug }: { slug: string }) {
  const { isFav, toggle } = useFavorites();
  const { toast } = useToast();
  const active = isFav(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toast(active ? "Retiré des favoris" : "Ajouté aux favoris ♥", active ? "info" : "success");
        toggle(slug);
      }}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`absolute right-3 top-3 grid size-8 place-items-center rounded-full border backdrop-blur transition-colors ${
        active
          ? "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400"
          : "border-border bg-surface/80 text-muted hover:text-rose-500"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-border-2 hover:shadow-soft-lg"
    >
      {/* Couverture — dégradé doux + initiale du produit */}
      <div
        className={`relative flex aspect-16/10 items-center justify-center bg-linear-to-br ${COVER_GRADIENT[product.category]} ${COVER_GRADIENT_DARK[product.category]}`}
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
        <FavButton slug={product.slug} />
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
