import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByCreator } from "@/data/products";

export const metadata: Metadata = {
  title: "Dashboard — Nuvora",
  robots: { index: false, follow: false },
};

const MOCK_CREATOR_SLUG = "studio-lumen";

const STATS = [
  {
    label: "Vues totales",
    value: "6 640",
    delta: "+12 %",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Clics boutique",
    value: "778",
    delta: "+8 %",
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
    value: "11.7 %",
    delta: "-0.3 %",
    positive: false,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17l4-8 4 4 4-6 4 4" />
        <path d="M3 21h18" />
      </svg>
    ),
  },
  {
    label: "Produits actifs",
    value: "2",
    delta: "sur Nuvora",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h10" />
      </svg>
    ),
  },
];

const RECENT_ACTIVITY = [
  { text: "Votre produit « Maîtriser Claude & les agents IA » a reçu 48 vues aujourd'hui.", time: "Il y a 2 h", type: "view" },
  { text: "3 nouveaux clics vers votre boutique Systeme.io.", time: "Il y a 4 h", type: "click" },
  { text: "Votre profil créateur a été consulté 12 fois cette semaine.", time: "Il y a 1 j", type: "profile" },
  { text: "« Pack de prompts marketing » ajouté aux favoris par 5 utilisateurs.", time: "Il y a 2 j", type: "fav" },
];

const COVER_COLOR: Record<string, string> = {
  Formation: "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

export default function DashboardPage() {
  const products = getProductsByCreator(MOCK_CREATOR_SLUG);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* ── Bienvenue ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Bonjour, Studio Lumen 👋</h1>
          <p className="mt-1 text-sm text-muted">
            Voici ce qui s&apos;est passé sur Nuvora ces 7 derniers jours.
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

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent">
                {s.icon}
              </span>
              <span
                className={`text-xs font-semibold ${
                  s.positive ? "text-success" : "text-danger"
                }`}
              >
                {s.delta}
              </span>
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none">{s.value}</p>
              <p className="mt-1 text-xs text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Grille principale : produits + activité ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Mes produits */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Mes produits</h2>
            <Link
              href="/dashboard/produits"
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              Voir tout →
            </Link>
          </div>

          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.slug}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft"
              >
                {/* Mini cover */}
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${COVER_COLOR[p.category]}`}
                >
                  <span className="text-lg font-extrabold text-fg/20">
                    {p.title.charAt(0)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-fg">{p.title}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {p.category} · {p.views.toLocaleString("fr-FR")} vues · {p.clicks} clics
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {p.verified && (
                    <span className="hidden rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent sm:inline">
                      Vérifié
                    </span>
                  )}
                  <Link
                    href={`/produit/${p.slug}`}
                    className="grid size-8 place-items-center rounded-lg border border-border text-muted transition-colors hover:text-fg"
                    aria-label="Voir la fiche"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </Link>
                </div>
              </div>
            ))}

            {/* CTA ajouter */}
            <Link
              href="/dashboard/produits"
              className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border-2 py-4 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              Référencer un nouveau produit
            </Link>
          </div>
        </section>

        {/* Activité récente */}
        <section>
          <h2 className="mb-4 font-bold">Activité récente</h2>
          <div className="rounded-2xl border border-border bg-surface shadow-soft divide-y divide-border overflow-hidden">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-4">
                <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg text-xs ${
                  a.type === "view" ? "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400" :
                  a.type === "click" ? "bg-accent-soft text-accent" :
                  a.type === "fav" ? "bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400" :
                  "bg-surface-2 text-muted"
                }`}>
                  {a.type === "view" && <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" /><circle cx="12" cy="12" r="3" /></svg>}
                  {a.type === "click" && <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>}
                  {a.type === "fav" && <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
                  {a.type === "profile" && <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] leading-relaxed text-fg-2">{a.text}</p>
                  <p className="mt-1 text-xs text-muted">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Bannière badge vérifié ── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:gap-6 shadow-soft">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-fg">Vous êtes créateur vérifié ✓</p>
          <p className="mt-0.5 text-sm text-muted">
            Votre badge de confiance est affiché sur toutes vos fiches produit.
          </p>
        </div>
        <Link
          href={`/createur/studio-lumen`}
          className="shrink-0 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
        >
          Voir mon profil public
        </Link>
      </div>
    </div>
  );
}
