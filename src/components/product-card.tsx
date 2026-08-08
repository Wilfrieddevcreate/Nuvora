"use client";

import Link from "next/link";
import { useFavorites } from "@/contexts/favorites";
import { useToast } from "@/contexts/toast";

export type DbProduct = {
  id?: string;
  slug: string;
  title: string;
  category: "Formation" | "Ebook" | "Template" | "Logiciel";
  subCategory: string;
  tags?: string[];
  price: number;
  isFree?: boolean;
  language?: string;
  platform: string;
  views?: number;
  clicks?: number;
  createdAt?: string;
  coverImage?: string;
  creatorName: string;
  creatorSlug: string;
  creatorVerified?: boolean;
};

function formatPrice(price: number, isFree?: boolean): string {
  return (isFree ?? false) || price === 0 ? "Gratuit" : `${price} €`;
}

const COVER_GRADIENT: Record<DbProduct["category"], string> = {
  Formation: "from-indigo-100 to-violet-50",
  Ebook: "from-sky-100 to-cyan-50",
  Template: "from-amber-100 to-orange-50",
  Logiciel: "from-emerald-100 to-teal-50",
};

const COVER_GRADIENT_DARK: Record<DbProduct["category"], string> = {
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
        toast(active ? "Retiré des favoris" : "Ajouté aux favoris", active ? "info" : "success");
        toggle(slug);
      }}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`absolute right-3 top-3 grid size-8 place-items-center rounded-full border backdrop-blur transition-all active:scale-90 ${
        active
          ? "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400 shadow-sm"
          : "border-border bg-surface/80 text-muted hover:text-rose-500 hover:scale-105 hover:shadow-sm"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

export function ProductCard({ product }: { product: DbProduct }) {
  const isNew = product.createdAt
    ? (Date.now() - new Date(product.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000
    : false;
  const gradient = COVER_GRADIENT[product.category] ?? "from-surface-2 to-surface";
  const gradientDark = COVER_GRADIENT_DARK[product.category] ?? "";

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-0"
    >
      <div className={`relative flex aspect-16/10 items-center justify-center bg-linear-to-br ${gradient} ${gradientDark} overflow-hidden`}>
        {product.coverImage ? (
          <img src={product.coverImage} alt={product.title} className="size-full object-cover" />
        ) : (
          <span className="text-4xl font-extrabold text-fg/15">{product.title.charAt(0)}</span>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-fg shadow-sm">
              <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden="true">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
              </svg>
              Nouveau
            </span>
          )}
          {product.creatorVerified && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-500/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur shadow-sm">
              <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
                <path d="M8.5 1a.5.5 0 0 0-.5.5v.793a.5.5 0 0 1-.854.354l-.561-.561a.5.5 0 0 0-.708.708l.561.56a.5.5 0 0 1 0 .708l-.561.561a.5.5 0 0 0 .708.708l.56-.561a.5.5 0 0 1 .854.354v.793a.5.5 0 0 0 1 0v-.793a.5.5 0 0 1 .854-.354l.561.561a.5.5 0 0 0 .708-.708l-.561-.56a.5.5 0 0 1 0-.708l.561-.561a.5.5 0 0 0-.708-.708l-.56.561a.5.5 0 0 1-.854-.354V1.5a.5.5 0 0 0-.5-.5z" />
              </svg>
              Vérifié
            </span>
          )}
        </div>
        <FavButton slug={product.slug} />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="text-xs font-medium text-muted">
          {product.category}{product.subCategory ? ` · ${product.subCategory}` : ""}
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-fg group-hover:text-accent">
          {product.title}
        </h3>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-fg-2">{product.creatorName}</span>
          {product.creatorVerified && (
            <svg viewBox="0 0 16 16" className="size-3.5 text-blue-500 dark:text-blue-400" fill="currentColor" role="img" aria-label="Créateur vérifié">
              <title>Créateur vérifié</title>
              <path d="M8.5 1a.5.5 0 0 0-.5.5v.793a.5.5 0 0 1-.854.354l-.561-.561a.5.5 0 0 0-.708.708l.561.56a.5.5 0 0 1 0 .708l-.561.561a.5.5 0 0 0 .708.708l.56-.561a.5.5 0 0 1 .854.354v.793a.5.5 0 0 0 1 0v-.793a.5.5 0 0 1 .854-.354l.561.561a.5.5 0 0 0 .708-.708l-.561-.56a.5.5 0 0 1 0-.708l.561-.561a.5.5 0 0 0-.708-.708l-.56.561a.5.5 0 0 1-.854-.354V1.5a.5.5 0 0 0-.5-.5z" />
            </svg>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-extrabold">
            {formatPrice(product.price, product.isFree)}
          </span>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">
            {product.platform}
          </span>
        </div>
      </div>
    </Link>
  );
}
