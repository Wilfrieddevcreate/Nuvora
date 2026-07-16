"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, Creator } from "@/data/products";

type Filter = "tous" | "en-attente" | "validés";
type ActionState = "validé" | "rejeté";

const COVER_COLOR: Record<string, string> = {
  Formation: "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "en-attente", label: "En attente" },
  { key: "validés", label: "Validés" },
];

export function AdminProduitsClient({
  products,
  creators,
}: {
  products: Product[];
  creators: Creator[];
}) {
  const [filter, setFilter] = useState<Filter>("tous");
  const [actions, setActions] = useState<Record<string, ActionState>>({});

  function isVerified(p: Product): boolean {
    const override = actions[p.slug];
    if (override === "validé") return true;
    if (override === "rejeté") return false;
    return p.verified;
  }

  const filtered = products.filter((p) => {
    if (filter === "validés") return isVerified(p);
    if (filter === "en-attente") return !isVerified(p);
    return true;
  });

  const pendingCount = products.filter((p) => !isVerified(p)).length;
  const validatedCount = products.filter((p) => isVerified(p)).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold">Produits</h1>
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-sm font-semibold text-muted">
              {products.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {validatedCount} validé{validatedCount > 1 ? "s" : ""} · {pendingCount} en attente
          </p>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 p-1">
          {FILTERS.map((f) => {
            const count =
              f.key === "tous"
                ? products.length
                : f.key === "validés"
                ? validatedCount
                : pendingCount;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  filter === f.key
                    ? "bg-surface shadow-soft text-fg"
                    : "text-muted hover:text-fg"
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-1.5 py-px text-[11px] font-bold leading-none ${
                    filter === f.key
                      ? f.key === "en-attente"
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                        : "bg-accent-soft text-accent"
                      : "bg-surface text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table desktop ── */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
        {/* En-tête desktop */}
        <div className="hidden grid-cols-[auto_1fr_110px_80px_100px_110px_auto] items-center gap-3 border-b border-border bg-surface-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted sm:grid">
          <span />
          <span>Produit</span>
          <span>Catégorie</span>
          <span className="text-right">Prix</span>
          <span>Plateforme</span>
          <span className="text-center">Statut</span>
          <span className="text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center text-muted">
            <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            <p className="text-sm">Aucun produit dans cette catégorie.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((p) => {
              const verified = isVerified(p);
              const action = actions[p.slug];

              return (
                <li key={p.slug}>
                  {/* Desktop row */}
                  <div className="hidden grid-cols-[auto_1fr_110px_80px_100px_110px_auto] items-center gap-3 px-5 py-4 sm:grid">
                    {/* Cover mini */}
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${COVER_COLOR[p.category]}`}>
                      <span className="text-sm font-extrabold text-fg/20">{p.title.charAt(0)}</span>
                    </div>

                    {/* Titre + créateur */}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-fg">{p.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted">{p.creator}</p>
                    </div>

                    {/* Catégorie */}
                    <span className="text-sm text-fg-2">{p.category}</span>

                    {/* Prix */}
                    <span className="text-right text-sm font-semibold text-fg">
                      {p.price === 0 ? "Gratuit" : `${p.price} €`}
                    </span>

                    {/* Plateforme */}
                    <span className="text-sm text-muted">{p.platform}</span>

                    {/* Statut */}
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        action === "rejeté"
                          ? "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                          : verified
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      }`}>
                        {action === "rejeté" ? "Rejeté" : verified ? "Validé" : "En attente"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5">
                      {!verified && action !== "rejeté" && (
                        <button
                          type="button"
                          onClick={() => setActions((prev) => ({ ...prev, [p.slug]: "validé" }))}
                          className="rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-600"
                        >
                          Valider
                        </button>
                      )}
                      {action !== "rejeté" && (
                        <button
                          type="button"
                          onClick={() => setActions((prev) => ({ ...prev, [p.slug]: "rejeté" }))}
                          className="rounded-lg border border-danger px-2.5 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          Rejeter
                        </button>
                      )}
                      {action && (
                        <button
                          type="button"
                          onClick={() => setActions((prev) => { const n = { ...prev }; delete n[p.slug]; return n; })}
                          className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:text-fg"
                          title="Annuler"
                        >
                          ↩
                        </button>
                      )}
                      <Link
                        href={`/produit/${p.slug}`}
                        className="grid size-7 place-items-center rounded-lg border border-border text-muted transition-colors hover:text-fg"
                        aria-label="Voir la fiche publique"
                      >
                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="flex flex-col gap-3 p-4 sm:hidden">
                    <div className="flex items-start gap-3">
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${COVER_COLOR[p.category]}`}>
                        <span className="text-sm font-extrabold text-fg/20">{p.title.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-fg leading-snug">{p.title}</p>
                        <p className="mt-0.5 text-xs text-muted">{p.creator} · {p.category}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        action === "rejeté"
                          ? "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                          : verified
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      }`}>
                        {action === "rejeté" ? "Rejeté" : verified ? "Validé" : "En attente"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{p.platform}</span>
                      <span className="font-semibold text-fg">{p.price === 0 ? "Gratuit" : `${p.price} €`}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!verified && action !== "rejeté" && (
                        <button
                          type="button"
                          onClick={() => setActions((prev) => ({ ...prev, [p.slug]: "validé" }))}
                          className="flex-1 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
                        >
                          Valider
                        </button>
                      )}
                      {action !== "rejeté" && (
                        <button
                          type="button"
                          onClick={() => setActions((prev) => ({ ...prev, [p.slug]: "rejeté" }))}
                          className="flex-1 rounded-lg border border-danger py-2 text-xs font-semibold text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          Rejeter
                        </button>
                      )}
                      {action && (
                        <button
                          type="button"
                          onClick={() => setActions((prev) => { const n = { ...prev }; delete n[p.slug]; return n; })}
                          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted transition-colors hover:text-fg"
                        >
                          Annuler
                        </button>
                      )}
                      <Link
                        href={`/produit/${p.slug}`}
                        className="grid size-8 place-items-center rounded-lg border border-border text-muted transition-colors hover:text-fg"
                        aria-label="Voir la fiche"
                      >
                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
