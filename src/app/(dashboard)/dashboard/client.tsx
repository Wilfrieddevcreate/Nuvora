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
  createdAt: string;
};

type Props = {
  userName: string;
  creatorSlug?: string;
  verified: boolean;
  products: Product[];
};

const COVER_COLOR: Record<string, string> = {
  Formation: "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

export default function DashboardClient({ userName, creatorSlug, verified, products }: Props) {
  const totalViews = products.reduce((s, p) => s + p.views, 0);
  const totalClicks = products.reduce((s, p) => s + p.clicks, 0);
  const activeCount = products.filter((p) => p.status === "active").length;
  const pendingCount = products.filter((p) => p.status === "pending").length;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const STATS = [
    {
      label: "Vues totales",
      value: totalViews.toLocaleString("fr-FR"),
      delta: "depuis le début",
      positive: true,
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      label: "Clics sortants",
      value: totalClicks.toLocaleString("fr-FR"),
      delta: "vers votre plateforme",
      positive: true,
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      ),
    },
    {
      label: "Taux de clic",
      value: `${ctr} %`,
      delta: "clics / vues",
      positive: true,
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 17l4-8 4 4 4-6 4 4" />
          <path d="M3 21h18" />
        </svg>
      ),
    },
    {
      label: "Produits actifs",
      value: String(activeCount),
      delta: pendingCount > 0 ? `${pendingCount} en attente` : "référencés",
      positive: true,
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Bienvenue */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Bonjour, {userName} 👋</h1>
          <p className="mt-1 text-sm text-muted">
            Voici un aperçu de vos produits sur Nuvora.
          </p>
        </div>
        <Link
          href="/dashboard/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          Ajouter un produit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent">{s.icon}</span>
              <span className={`text-xs font-semibold ${s.positive ? "text-success" : "text-danger"}`}>{s.delta}</span>
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none">{s.value}</p>
              <p className="mt-1 text-xs text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grille principale */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Mes produits récents */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Mes produits</h2>
            <Link href="/dashboard/produits" className="text-sm font-medium text-accent hover:text-accent-hover">Voir tout →</Link>
          </div>

          <div className="space-y-3">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${COVER_COLOR[p.category] ?? "from-surface-2 to-surface"}`}>
                  <span className="text-lg font-extrabold text-fg/20">{p.title.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-fg">{p.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.category} · {p.views.toLocaleString("fr-FR")} vues · {p.clicks} clics</p>
                </div>
                <Link
                  href={`/produit/${p.slug}`}
                  className="grid size-8 place-items-center rounded-lg border border-border text-muted transition-colors hover:text-fg"
                  aria-label="Voir la fiche"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </Link>
              </div>
            ))}

            {recentProducts.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-2 py-8 text-center">
                <p className="text-sm text-muted">Aucun produit pour le moment.</p>
              </div>
            )}

            <Link
              href="/dashboard/produits/nouveau"
              className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border-2 py-4 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              Référencer un nouveau produit
            </Link>
          </div>
        </section>

        {/* Récapitulatif statuts */}
        <section>
          <h2 className="mb-4 font-bold">Récapitulatif</h2>
          <div className="rounded-2xl border border-border bg-surface shadow-soft divide-y divide-border overflow-hidden">
            {[
              { label: "Produits actifs", value: products.filter(p => p.status === "active").length, color: "text-accent" },
              { label: "En attente de validation", value: products.filter(p => p.status === "pending").length, color: "text-amber-600" },
              { label: "Refusés", value: products.filter(p => p.status === "rejected").length, color: "text-danger" },
              { label: "Total référencés", value: products.length, color: "text-fg" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3.5">
                <p className="text-sm text-fg-2">{item.label}</p>
                <p className={`text-lg font-extrabold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Badge vérifié */}
      {verified && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:gap-6 shadow-soft">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-fg">Vous êtes créateur vérifié</p>
            <p className="mt-0.5 text-sm text-muted">Votre badge de confiance est affiché sur toutes vos fiches produit.</p>
          </div>
          <Link
            href={`/createur/${creatorSlug ?? "profil"}`}
            className="shrink-0 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
          >
            Voir mon profil public
          </Link>
        </div>
      )}
    </div>
  );
}
