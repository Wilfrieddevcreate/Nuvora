import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tarifs — Référencement gratuit pour les créateurs",
  description:
    "Nuvora est gratuit pour les créateurs. Référencez vos produits digitaux sans commission, sans abonnement.",
  alternates: { canonical: "https://nuvora.app/tarifs" },
  openGraph: {
    title: "Tarifs Nuvora — Gratuit pour les créateurs",
    description: "Découvrez nos offres pour créateurs de produits digitaux. Référencement gratuit, zéro commission.",
    url: "https://nuvora.app/tarifs",
    type: "website",
  },
};

const FREE_FEATURES = [
  "Référencement illimité de produits",
  "Page profil créateur publique",
  "Statistiques de vues et clics",
  'Badge "Vérifié" (après validation)',
  "0 % de commission sur vos ventes",
  "Lien direct vers votre plateforme",
];

const PRO_FEATURES = [
  "Mise en avant dans le catalogue",
  "Statistiques avancées",
  'Badge "Premium"',
  "Support prioritaire",
];

const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Vous créez vos produits sur votre plateforme",
    desc: "Gumroad, Systeme.io, Podia, Lemon Squeezy… vous choisissez l'outil de vente qui vous convient.",
  },
  {
    n: "2",
    title: "Vous les référencez sur Nuvora",
    desc: "Soumettez le titre, la description et votre lien de vente. Notre équipe valide et publie votre fiche.",
  },
  {
    n: "3",
    title: "Les acheteurs vous trouvent et sont redirigés",
    desc: "Vos produits apparaissent dans le catalogue et dans l'assistant IA. Un clic, et l'acheteur arrive chez vous.",
  },
];

const FAQS = [
  {
    q: "Nuvora prend-il une commission ?",
    a: "Non, 0 %. Nuvora est une vitrine de découverte : quand un acheteur clique sur un produit, il est redirigé vers votre plateforme. La transaction se passe entièrement chez vous, sans intermédiaire.",
  },
  {
    q: "Puis-je référencer autant de produits que je veux ?",
    a: "Oui, le référencement est illimité sur le plan gratuit. Vous pouvez soumettre tous vos ebooks, formations, templates et logiciels sans restriction.",
  },
  {
    q: "Que se passe-t-il après la validation ?",
    a: "Votre produit apparaît dans le catalogue public de Nuvora, dans les résultats de recherche et dans les recommandations de l'assistant IA. Vous recevez les statistiques de vues et de clics depuis votre tableau de bord.",
  },
];

export default function TarifsPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-border bg-accent-soft/30">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(55%_100%_at_50%_0%,var(--accent-soft),transparent)]"
        />
        <div className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-8 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-fg-2 sm:text-[13px]">
            <span className="size-1.5 rounded-full bg-accent" />
            Simple &amp; transparent
          </div>

          <h1 className="mt-6 text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.06]">
            Gratuit pour les créateurs.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-fg-2">
            Nuvora ne prend aucune commission et ne facture aucun abonnement.
            Référencez vos produits, et les acheteurs sont redirigés directement
            vers votre plateforme — vous gardez 100&nbsp;% de vos revenus.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/inscription" size="lg">
              Commencer gratuitement
              <ArrowUpRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/createur" variant="secondary" size="lg">
              En savoir plus
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ─── PRICING CARDS ─── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Un modèle simple, sans surprise
          </h2>
          <p className="mt-2 text-fg-2">
            Pas de frais cachés, pas de palier technique à débloquer.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {/* Plan Gratuit — mis en avant */}
          <div className="relative flex flex-col rounded-2xl border-2 border-accent bg-surface p-7 shadow-soft-lg">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                Gratuit
              </p>
              <p className="mt-2 text-4xl font-extrabold">
                0&nbsp;<span className="text-xl font-bold text-fg-2">€/mois</span>
              </p>
              <p className="mt-2 text-sm text-fg-2">
                Pour tous les créateurs, sans limite dans le temps.
              </p>
            </div>

            <ButtonLink href="/inscription" size="lg" className="w-full justify-center">
              Commencer gratuitement
              <ArrowUpRight className="size-4" />
            </ButtonLink>

            <ul className="mt-7 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 size-4 shrink-0 text-accent"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan Pro — bientôt */}
          <div className="flex flex-col rounded-2xl border border-border bg-surface p-7 shadow-soft opacity-70">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Pro
                </p>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                  Bientôt
                </span>
              </div>
              <p className="mt-2 text-4xl font-extrabold text-muted">
                —&nbsp;<span className="text-xl font-bold">€/mois</span>
              </p>
              <p className="mt-2 text-sm text-fg-2">
                Pour les créateurs qui veulent plus de visibilité.
              </p>
            </div>

            <button
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold text-muted"
            >
              Disponible bientôt
            </button>

            <ul className="mt-7 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan Équipes — bientôt */}
          <div className="flex flex-col rounded-2xl border border-border bg-surface p-7 shadow-soft opacity-70">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Équipes
                </p>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                  Bientôt
                </span>
              </div>
              <p className="mt-2 text-4xl font-extrabold text-muted">
                —&nbsp;<span className="text-xl font-bold">€/mois</span>
              </p>
              <p className="mt-2 text-sm text-fg-2">
                Pour les studios et collectifs de créateurs.
              </p>
            </div>

            <button
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold text-muted"
            >
              Disponible bientôt
            </button>

            <ul className="mt-7 space-y-3">
              {[
                "Tout le plan Pro",
                "Gestion multi-créateurs",
                "Tableau de bord partagé",
                "Facturation centralisée",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section className="bg-surface-2/60">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Comment ça marche
            </h2>
            <p className="mt-2 text-fg-2">
              Trois étapes, aucune technicité requise.
            </p>
          </div>

          <div className="relative mt-12">
            <div
              aria-hidden
              className="absolute left-1/2 top-5 hidden h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-border to-transparent md:block"
            />

            <div className="grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.n} className="flex flex-col items-center text-center">
                  <span className="relative z-10 grid size-11 place-items-center rounded-full bg-accent font-bold text-accent-fg shadow-soft">
                    {step.n}
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-2">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
          Questions fréquentes
        </h2>

        <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          {FAQS.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-fg">
                {item.q}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-2">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-accent px-8 py-14 text-center sm:px-14 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Prêt à être découvert ?
            </h2>
            <p className="mt-3 text-white/80">
              Inscription gratuite, sans engagement, 0&nbsp;% de commission.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/inscription"
                variant="secondary"
                size="lg"
                className="border-white/70! bg-transparent! text-white! hover:bg-white/10!"
              >
                Commencer gratuitement
                <ArrowUpRight className="size-4" />
              </ButtonLink>
              <Link
                href="/createur"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                En savoir plus sur Nuvora
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
