"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { approveProduct, rejectProduct } from "@/app/actions/admin";

type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  platform: string;
  price: number;
  isFree: boolean;
  status: "pending" | "active" | "rejected";
  creatorName: string;
  creatorSlug: string;
};

type Filter = "tous" | "en-attente" | "actifs" | "rejetés";

const COVER_COLOR: Record<string, string> = {
  Formation: "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "en-attente", label: "En attente" },
  { key: "actifs", label: "Actifs" },
  { key: "rejetés", label: "Rejetés" },
];

function StatusBadge({ status }: { status: Product["status"] }) {
  const cls =
    status === "active"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
      : status === "rejected"
      ? "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400"
      : "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
  const label = status === "active" ? "Actif" : status === "rejected" ? "Rejeté" : "En attente";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function ProductRow({ p }: { p: Product }) {
  const [, startTransition] = useTransition();

  function approve() {
    startTransition(() => approveProduct(p.id));
  }
  function reject() {
    startTransition(() => rejectProduct(p.id));
  }

  return (
    <li key={p.id}>
      {/* Desktop */}
      <div className="hidden grid-cols-[auto_1fr_110px_80px_100px_110px_auto] items-center gap-3 px-5 py-4 sm:grid">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${COVER_COLOR[p.category] ?? "from-surface-2 to-surface"}`}>
          <span className="text-sm font-extrabold text-fg/20">{p.title.charAt(0)}</span>
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold text-fg">{p.title}</p>
          <Link href={`/createur/${p.creatorSlug}`} className="mt-0.5 truncate text-xs text-muted hover:text-accent transition-colors">
            {p.creatorName}
          </Link>
        </div>

        <span className="text-sm text-fg-2">{p.category}</span>

        <span className="text-right text-sm font-semibold text-fg">
          {p.isFree ? "Gratuit" : `${p.price} €`}
        </span>

        <span className="text-sm text-muted">{p.platform}</span>

        <div className="flex justify-center">
          <StatusBadge status={p.status} />
        </div>

        <div className="flex items-center justify-end gap-1.5">
          {p.status !== "active" && (
            <button
              type="button"
              onClick={approve}
              className="rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Valider
            </button>
          )}
          {p.status !== "rejected" && (
            <button
              type="button"
              onClick={reject}
              className="rounded-lg border border-danger px-2.5 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Rejeter
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

      {/* Mobile */}
      <div className="flex flex-col gap-3 p-4 sm:hidden">
        <div className="flex items-start gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${COVER_COLOR[p.category] ?? "from-surface-2 to-surface"}`}>
            <span className="text-sm font-extrabold text-fg/20">{p.title.charAt(0)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-fg leading-snug">{p.title}</p>
            <p className="mt-0.5 text-xs text-muted">{p.creatorName} · {p.category}</p>
          </div>
          <StatusBadge status={p.status} />
        </div>

        <div className="flex items-center justify-between text-xs text-muted">
          <span>{p.platform}</span>
          <span className="font-semibold text-fg">{p.isFree ? "Gratuit" : `${p.price} €`}</span>
        </div>

        <div className="flex items-center gap-2">
          {p.status !== "active" && (
            <button
              type="button"
              onClick={approve}
              className="flex-1 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Valider
            </button>
          )}
          {p.status !== "rejected" && (
            <button
              type="button"
              onClick={reject}
              className="flex-1 rounded-lg border border-danger py-2 text-xs font-semibold text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Rejeter
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
}

export function AdminProduitsClient({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("tous");

  const counts = {
    tous: products.length,
    "en-attente": products.filter((p) => p.status === "pending").length,
    actifs: products.filter((p) => p.status === "active").length,
    rejetés: products.filter((p) => p.status === "rejected").length,
  };

  const filtered = products.filter((p) => {
    if (filter === "en-attente") return p.status === "pending";
    if (filter === "actifs") return p.status === "active";
    if (filter === "rejetés") return p.status === "rejected";
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold">Produits</h1>
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-sm font-semibold text-muted">{products.length}</span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {counts.actifs} actif{counts.actifs > 1 ? "s" : ""} · {counts["en-attente"]} en attente
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                filter === f.key ? "bg-surface shadow-soft text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-1.5 py-px text-[11px] font-bold leading-none ${
                filter === f.key
                  ? f.key === "en-attente"
                    ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                    : "bg-accent-soft text-accent"
                  : "bg-surface text-muted"
              }`}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
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
            {filtered.map((p) => <ProductRow key={p.id} p={p} />)}
          </ul>
        )}
      </div>
    </div>
  );
}
