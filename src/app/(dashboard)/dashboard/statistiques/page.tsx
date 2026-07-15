import type { Metadata } from "next";
import { getProductsByCreator } from "@/data/products";

export const metadata: Metadata = {
  title: "Statistiques — Dashboard Nuvora",
  robots: { index: false, follow: false },
};

const MOCK_CREATOR_SLUG = "studio-lumen";

const WEEKLY = [
  { day: "Lun", views: 120, clicks: 14 },
  { day: "Mar", views: 98, clicks: 11 },
  { day: "Mer", views: 145, clicks: 18 },
  { day: "Jeu", views: 210, clicks: 25 },
  { day: "Ven", views: 187, clicks: 22 },
  { day: "Sam", views: 95, clicks: 9 },
  { day: "Dim", views: 72, clicks: 7 },
];

const MAX_VIEWS = Math.max(...WEEKLY.map((d) => d.views));

export default function StatistiquesPage() {
  const products = getProductsByCreator(MOCK_CREATOR_SLUG);
  const totalViews = products.reduce((s, p) => s + p.views, 0);
  const totalClicks = products.reduce((s, p) => s + p.clicks, 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Statistiques</h1>
        <p className="mt-1 text-sm text-muted">Performances de vos produits sur Nuvora.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {[
          { label: "Vues totales", value: totalViews.toLocaleString("fr-FR"), sub: "depuis le début" },
          { label: "Clics boutique", value: totalClicks.toLocaleString("fr-FR"), sub: "redirections" },
          { label: "Taux de clic moyen", value: `${ctr} %`, sub: "clics / vues" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <p className="text-3xl font-extrabold">{k.value}</p>
            <p className="mt-1 text-sm font-semibold text-fg">{k.label}</p>
            <p className="text-xs text-muted">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Graphique en barres — vues sur 7 jours */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
        <h2 className="mb-5 font-bold">Vues des 7 derniers jours</h2>
        <div className="flex h-36 items-end gap-2 sm:gap-3">
          {WEEKLY.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted">{d.views}</span>
              <div
                className="w-full rounded-t-md bg-accent-soft transition-all"
                style={{ height: `${(d.views / MAX_VIEWS) * 100}%` }}
              >
                <div
                  className="w-full rounded-t-md bg-accent transition-all"
                  style={{ height: `${(d.clicks / d.views) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-muted">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-accent-soft inline-block" />Vues</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-accent inline-block" />Clics</span>
        </div>
      </div>

      {/* Par produit */}
      <div className="rounded-2xl border border-border bg-surface shadow-soft overflow-hidden">
        <div className="border-b border-border bg-surface-2 px-5 py-3">
          <h2 className="font-bold">Performance par produit</h2>
        </div>
        <ul className="divide-y divide-border">
          {products.map((p) => {
            const pCtr = p.views > 0 ? ((p.clicks / p.views) * 100).toFixed(1) : "0";
            const pct = Math.round((p.views / totalViews) * 100);
            return (
              <li key={p.slug} className="px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="min-w-0 truncate text-sm font-semibold text-fg">{p.title}</p>
                  <div className="flex shrink-0 items-center gap-4 text-sm">
                    <span className="text-muted">{p.views.toLocaleString("fr-FR")} vues</span>
                    <span className="text-muted">{p.clicks} clics</span>
                    <span className="font-semibold text-accent">{pCtr} %</span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
