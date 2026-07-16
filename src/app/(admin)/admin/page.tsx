import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, CREATORS, CATEGORIES } from "@/data/products";
import { RefreshButton } from "./refresh-button";

export const metadata: Metadata = {
  title: "Admin — Vue d'ensemble",
  robots: { index: false, follow: false },
};

// ── KPIs calculés côté serveur ──────────────────────────────────────────────

const totalViews = PRODUCTS.reduce((sum, p) => sum + p.views, 0);
const totalClicks = PRODUCTS.reduce((sum, p) => sum + p.clicks, 0);
const pendingProducts = PRODUCTS.filter((p) => !p.verified);

// ── Répartition par catégorie ───────────────────────────────────────────────

const categoryCounts = CATEGORIES.map((cat) => ({
  name: cat,
  count: PRODUCTS.filter((p) => p.category === cat).length,
})).sort((a, b) => b.count - a.count);

const maxCategoryCount = Math.max(...categoryCounts.map((c) => c.count), 1);

// ── KPIs ─────────────────────────────────────────────────────────────────────

const KPIS = [
  {
    label: "Total produits",
    value: PRODUCTS.length.toString(),
    delta: "+3 cette semaine",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h10" />
      </svg>
    ),
  },
  {
    label: "Total créateurs",
    value: CREATORS.length.toString(),
    delta: "+1 ce mois",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="7" r="4" />
        <path d="M17 11a4 4 0 0 1 0 8" />
        <path d="M3 21a8 8 0 0 1 12 0" />
      </svg>
    ),
  },
  {
    label: "Vues totales",
    value: totalViews.toLocaleString("fr-FR"),
    delta: "+8 % ce mois",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Clics totaux",
    value: totalClicks.toLocaleString("fr-FR"),
    delta: "+5 % ce mois",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    ),
  },
];

// ── Activité récente (mock) ──────────────────────────────────────────────────

const ACTIVITY = [
  {
    id: "activity-submit-studio-lumen",
    text: "Nouveau produit soumis par Studio Lumen",
    time: "Il y a 1 h",
    type: "submit",
  },
  {
    id: "activity-verify-devacademy",
    text: "Créateur DevAcademy vérifié",
    time: "Il y a 3 h",
    type: "verify",
  },
  {
    id: "activity-flag-pack-prompts",
    text: "Avis signalé sur « Pack de prompts marketing »",
    time: "Il y a 5 h",
    type: "flag",
  },
  {
    id: "activity-user-atelier-pixel",
    text: "Nouveau créateur inscrit : Atelier Pixel",
    time: "Il y a 1 j",
    type: "user",
  },
  {
    id: "activity-milestone-maitriser-claude",
    text: "Produit « Maîtriser Claude » atteint 5 000 vues",
    time: "Il y a 2 j",
    type: "milestone",
  },
];

// ── Icônes d'activité ─────────────────────────────────────────────────────────

function ActivityIcon({ type }: { type: string }) {
  const base = "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg";

  if (type === "submit") {
    return (
      <span className={`${base} bg-rose-50 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400`}>
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
    );
  }
  if (type === "verify") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400`}>
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </span>
    );
  }
  if (type === "flag") {
    return (
      <span className={`${base} bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400`}>
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      </span>
    );
  }
  if (type === "user") {
    return (
      <span className={`${base} bg-sky-50 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400`}>
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </svg>
      </span>
    );
  }
  // milestone
  return (
    <span className={`${base} bg-violet-50 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400`}>
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* ── En-tête ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Bonjour, Admin 👋</h1>
          <p className="mt-1 text-sm text-muted capitalize">{today}</p>
        </div>
        <RefreshButton />
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div
            key={k.label}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400">
                {k.icon}
              </span>
              <span className={`text-xs font-semibold ${k.positive ? "text-success" : "text-danger"}`}>
                {k.delta}
              </span>
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none">{k.value}</p>
              <p className="mt-1 text-xs text-muted">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Grille principale : validation + activité ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

        {/* En attente de validation */}
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
            <Link
              href="/admin/produits"
              className="text-sm font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
            >
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
                <div
                  key={p.slug}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft"
                >
                  {/* Initiale */}
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 dark:bg-rose-500/20">
                    <span className="text-base font-extrabold text-rose-400">
                      {p.title.charAt(0)}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {p.category} · {p.creator}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Valider ${p.title}`}
                      className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
                    >
                      Valider
                    </button>
                    <button
                      type="button"
                      aria-label={`Rejeter ${p.title}`}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Activité récente */}
        <section>
          <h2 className="mb-4 font-bold">Activité récente</h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
            {ACTIVITY.map((a) => (
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

      {/* ── Répartition par catégorie ── */}
      <section>
        <h2 className="mb-4 font-bold">Répartition par catégorie</h2>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <ul className="space-y-4">
            {categoryCounts.map((cat) => {
              const pct = Math.round((cat.count / maxCategoryCount) * 100);
              return (
                <li key={cat.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-fg">{cat.name}</span>
                    <span className="text-muted">
                      {cat.count} produit{cat.count > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-rose-50 dark:bg-rose-500/10">
                    <div
                      className="h-full rounded-full bg-rose-500"
                      style={{ width: `${pct}%` }}
                    />
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
