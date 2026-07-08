"use client";

import { useEffect, useRef, useState } from "react";
import { getFeatured, type Featured } from "@/data/products";

const COVER: Record<string, string> = {
  Formation:
    "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template:
    "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel:
    "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

const AUTOPLAY_MS = 5000;
const FEATURED: Featured[] = getFeatured();

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      {dir === "left" ? <path d="m14 6-6 6 6 6" /> : <path d="m10 6 6 6-6 6" />}
    </svg>
  );
}

/**
 * Colonne droite du hero : carrousel "livre" de 3 produits phares.
 * Chaque slide = carte produit + carte-témoignage flottante (design conservé).
 * Autoplay doux (~5s), flèches et points. Désactivé si prefers-reduced-motion.
 */
export function HeroPreview() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedRef = useRef(false);

  const count = FEATURED.length;
  const go = (i: number) => setIndex(((i % count) + count) % count);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedRef.current || paused) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const { product, testimonial } = FEATURED[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-roledescription="carrousel"
      aria-label="Produits phares"
    >
      {/* profondeur : cartes empilées derrière (effet livre) */}
      <div
        aria-hidden
        className="absolute -right-3 top-5 h-full w-full rounded-3xl border border-border bg-surface/60"
      />
      <div
        aria-hidden
        className="absolute -right-1.5 top-2.5 h-full w-full rounded-3xl border border-border bg-surface/80"
      />

      {/* carte vedette (slide courant) */}
      <div
        key={product.slug}
        className="hero-slide relative overflow-hidden rounded-3xl border border-border bg-surface shadow-soft-lg"
      >
        <div
          className={`flex aspect-[16/11] items-center justify-center bg-gradient-to-br ${COVER[product.category]}`}
        >
          <span className="text-5xl font-extrabold text-fg/15">
            {product.title.charAt(0)}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <span>{product.category}</span>
            <span className="size-1 rounded-full bg-border-2" />
            <span>{product.subCategory}</span>
          </div>
          <h3 className="mt-2 text-lg font-bold leading-snug">
            {product.title}
          </h3>
          <div className="mt-1 text-sm text-muted">par {product.creator}</div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-extrabold">{product.price} €</span>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              {product.platform}
            </span>
          </div>
        </div>
      </div>

      {/* carte-témoignage flottante (change avec le produit) */}
      <div
        key={`t-${product.slug}`}
        className="hero-slide absolute -left-8 top-16 w-60 rounded-2xl border border-border bg-surface p-3.5 shadow-soft-lg xl:-left-12"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-[13px] font-bold text-accent-fg">
            {testimonial.initials}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold">
              {testimonial.author}
            </div>
            <div className="text-[11px] text-muted">{testimonial.role}</div>
          </div>
        </div>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-fg-2">
          {testimonial.quote}
        </p>
        <div className="mt-2.5 flex items-center gap-4 border-t border-border pt-2.5">
          {testimonial.stats.map((s) => (
            <div key={s.label}>
              <div className="text-[13px] font-extrabold">{s.value}</div>
              <div className="text-[10.5px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrôles : flèches + points */}
      <div className="relative z-10 mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Produit précédent"
          className="grid size-8 place-items-center rounded-full border border-border-2 bg-surface text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <Chevron dir="left" />
        </button>

        <div className="flex items-center gap-1.5" role="tablist">
          {FEATURED.map((f, i) => (
            <button
              key={f.product.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Aller au produit ${i + 1}`}
              onClick={() => go(i)}
              className={
                "h-1.5 rounded-full transition-all " +
                (i === index
                  ? "w-5 bg-accent"
                  : "w-1.5 bg-border-2 hover:bg-muted")
              }
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Produit suivant"
          className="grid size-8 place-items-center rounded-full border border-border-2 bg-surface text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
}
