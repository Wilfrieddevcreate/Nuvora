import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/data/products";
import { RefreshButton } from "./refresh-button";

export const metadata: Metadata = {
  title: "Admin — Vue d'ensemble",
  robots: { index: false, follow: false },
};

function ActivityIcon({ type }: { type: string }) {
  const base = "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg";
  if (type === "submit") return (
    <span className={`${base} bg-rose-50 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400`}>
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
    </span>
  );
  if (type === "verify") return (
    <span className={`${base} bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400`}>
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" /><path d="M9 12l2 2 4-4" /></svg>
    </span>
  );
  if (type === "user") return (
    <span className={`${base} bg-sky-50 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400`}>
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
    </span>
  );
  return (
    <span className={`${base} bg-violet-50 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400`}>
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    </span>
  );
}

export default async function AdminOverviewPage() {
  const [
    totalProducts,
    totalCreators,
    totalViews,
    totalClicks,
    pendingProducts,
    recentProducts,
    recentCreators,
  ] = await Promise.all([
    db.product.count(),
    db.creator.count(),
    db.product.aggregate({ _sum: { views: true } }),
    db.product.aggregate({ _sum: { clicks: true } }),
    db.product.findMany({
      where: { status: "pending" },
      include: { creator: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.product.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    db.creator.findMany({ orderBy: { createdAt: "desc" }, take: 3, include: { user: { select: { name: true } } } }),
  ]);

  const categoryCounts = CATEGORIES.map(async (cat) => ({
    name: cat,
    count: await db.product.count({ where: { category: cat } }),
  }));
  const catData = await Promise.all(categoryCounts);
  const catSorted = catData.sort((a, b) => b.count - a.count);
  const maxCat = Math.max(...catSorted.map((c) => c.count), 1);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  type ActivityEntry = { id: string; text: string; time: string; type: string };
  const activity: ActivityEntry[] = [
    ...recentProducts.map((p) => ({
      id: `submit-${p.id}`,
      text: `Nouveau produit soumis : ${p.title}`,
      time: new Date(p.createdAt).toLocaleDateString("fr-FR"),
      type: "submit",
    })),
    ...recentCreators.map((c) => ({
      id: `creator-${c.id}`,
      text: `Nouveau créateur inscrit : ${c.user.name}`,
      time: new Date(c.createdAt).toLocaleDateString("fr-FR"),
      type: "user",
    })),
  ].sort(() => 0).slice(0, 5);

  const KPIS = [
    {
      label: "Total produits",
      value: totalProducts.toString(),
      icon: <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>,
    },
    {
      label: "Total créateurs",
      value: totalCreators.toString(),
      icon: <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="7" r="4" /><path d="M17 11a4 4 0 0 1 0 8" /><path d="M3 21a8 8 0 0 1 12 0" /></svg>,
    },
    {
      label: "Vues totales",
      value: (totalViews._sum.views ?? 0).toLocaleString("fr-FR"),
      icon: <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" /><circle cx="12" cy="12" r="3" /></svg>,
    },
    {
      label: "Clics totaux",
      value: (totalClicks._sum.clicks ?? 0).toLocaleString("fr-FR"),
      icon: <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Bonjour, Admin</h1>
          <p className="mt-1 text-sm text-muted capitalize">{today}</p>
        </div>
        <RefreshButton />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
            <span className="grid size-9 place-items-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400">
              {k.icon}
            </span>
            <div>
              <p className="text-2xl font-extrabold leading-none">{k.value}</p>
              <p className="mt-1 text-xs text-muted">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-bold">En attente de validation</h2>
              {pendingProducts.length > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {pendingProducts.length}
                </span>
              )}
            </div>
            <Link href="/admin/produits" className="text-sm font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-3">
            {pendingProducts.length === 0 ? (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-border py-10 text-sm text-muted">
                Aucun produit en attente de validation.
              </div>
            ) : (
              pendingProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 dark:bg-rose-500/20">
                    <span className="text-base font-extrabold text-rose-400">{p.title.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{p.category} · {p.creator.user.name}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href="/admin/produits"
                      className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
                    >
                      Gérer →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-bold">Activité récente</h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
            {activity.length === 0 ? (
              <p className="px-4 py-6 text-sm text-center text-muted">Aucune activité récente.</p>
            ) : activity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 px-4 py-4">
                <ActivityIcon type={a.type} />
                <div className="min-w-0">
                  <p className="text-[13px] leading-relaxed text-fg-2">{a.text}</p>
                  <p className="mt-1 text-xs text-muted">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-4 font-bold">Répartition par catégorie</h2>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <ul className="space-y-4">
            {catSorted.map((cat) => {
              const pct = Math.round((cat.count / maxCat) * 100);
              return (
                <li key={cat.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-fg">{cat.name}</span>
                    <span className="text-muted">{cat.count} produit{cat.count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-rose-50 dark:bg-rose-500/10">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
