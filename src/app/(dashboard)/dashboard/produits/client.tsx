"use client";

import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  platform: string;
  status: "pending" | "active" | "rejected";
  views: number;
  clicks: number;
};

const COVER_COLOR: Record<string, string> = {
  Formation: "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

export default function ProduitsClient({ products }: { products: Product[] }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Mes produits</h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} produit{products.length > 1 ? "s" : ""} référencé{products.length > 1 ? "s" : ""} sur Nuvora.
          </p>
        </div>
        <Link
          href="/dashboard/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          Référencer un produit
        </Link>
      </div>

      {products.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          <div className="hidden grid-cols-[auto_1fr_100px_100px_80px_60px] items-center gap-4 border-b border-border bg-surface-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted sm:grid">
            <span />
            <span>Produit</span>
            <span className="text-right">Vues</span>
            <span className="text-right">Clics</span>
            <span className="text-center">Statut</span>
            <span />
          </div>

          <ul className="divide-y divide-border">
            {products.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 p-4 sm:grid sm:grid-cols-[auto_1fr_100px_100px_80px_60px] sm:items-center sm:gap-4 sm:px-5 sm:py-4">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${COVER_COLOR[p.category] ?? "from-surface-2 to-surface"}`}>
                  <span className="text-sm font-extrabold text-fg/20">{p.title.charAt(0)}</span>
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-fg">{p.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.category} · {p.platform}</p>
                </div>

                <div className="flex items-center justify-between text-sm sm:contents">
                  <div className="flex gap-4 sm:contents">
                    <span className="sm:text-right">
                      <span className="font-semibold">{p.views.toLocaleString("fr-FR")}</span>
                      <span className="ml-1 text-xs text-muted sm:hidden">vues</span>
                    </span>
                    <span className="sm:text-right">
                      <span className="font-semibold">{p.clicks}</span>
                      <span className="ml-1 text-xs text-muted sm:hidden">clics</span>
                    </span>
                  </div>

                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold sm:mx-auto ${
                    p.status === "active"
                      ? "bg-accent-soft text-accent"
                      : p.status === "rejected"
                      ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                  }`}>
                    {p.status === "active" ? "Actif" : p.status === "rejected" ? "Refusé" : "En attente"}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 sm:justify-center">
                  <Link
                    href={`/dashboard/produits/${p.slug}`}
                    className="grid size-8 place-items-center rounded-lg border border-border text-muted transition-colors hover:text-fg"
                    aria-label="Modifier le produit"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </Link>
                  <Link
                    href={`/produit/${p.slug}`}
                    className="grid size-8 place-items-center rounded-lg border border-border text-muted transition-colors hover:text-fg"
                    aria-label="Voir la fiche publique"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {products.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-2 py-12 text-center">
          <svg viewBox="0 0 24 24" className="size-8 text-muted" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
          <p className="font-semibold text-fg">Référencez votre premier produit</p>
          <p className="max-w-xs text-sm text-muted">
            Ajoutez un ebook, une formation ou un template pour augmenter votre visibilité.
          </p>
          <Link href="/dashboard/produits/nouveau" className="mt-2 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            Ajouter un produit
          </Link>
        </div>
      )}
    </div>
  );
}
