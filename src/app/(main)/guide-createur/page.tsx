import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import Faqs from "@/components/faqs";

export const metadata: Metadata = {
  title: "Guide créateur : comment référencer vos produits sur Nuvora",
  description:
    "Tout ce que vous devez savoir pour référencer vos ebooks, formations et templates sur Nuvora et attirer des acheteurs.",
  alternates: { canonical: "https://nuvora.app/guide-createur" },
  openGraph: {
    title: "Guide créateur Nuvora : référencer vos produits digitaux",
    description: "Tout ce qu'il faut savoir pour référencer vos produits digitaux sur Nuvora et être découvert par des acheteurs qualifiés. Gratuit, sans commission.",
    url: "https://nuvora.app/guide-createur",
    type: "website",
  },
};

const PREREQUISITES = [
  {
    icon: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5Z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </>
    ),
    title: "Un produit digital existant",
    desc: "Votre produit doit déjà être hébergé sur une plateforme externe (Gumroad, Systeme.io, Podia, Chariow…). Nuvora n'héberge pas les fichiers.",
  },
  {
    icon: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
    title: "Un lien de vente public",
    desc: "Vous devez avoir un lien URL permanent vers la page de vente ou de téléchargement de votre produit. Ce lien vous sera demandé lors du référencement.",
  },
  {
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    title: "Comprendre le modèle Nuvora",
    desc: "Nuvora est un annuaire de découverte, pas une boutique. Les visiteurs sont redirigés vers votre plateforme. Aucun paiement ne transite par Nuvora.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Créer votre compte créateur",
    desc: "Rendez-vous sur la page d'inscription et créez votre compte. Choisissez le type « Créateur » pour accéder aux fonctionnalités de référencement. L'inscription prend moins de 2 minutes et ne nécessite aucun moyen de paiement.",
  },
  {
    n: "2",
    title: "Compléter votre profil public",
    desc: "Depuis votre dashboard, renseignez votre biographie, vos spécialités et vos liens sociaux. Un profil complet renforce la confiance des acheteurs et améliore votre visibilité dans les résultats de l'assistant IA. Le badge « Créateur vérifié » s'affiche une fois votre profil examiné par notre équipe (délai estimé : 24 à 72 h).",
  },
  {
    n: "3",
    title: "Référencer votre premier produit",
    desc: "Dans « Mes produits », cliquez sur « Ajouter un produit ». Renseignez le titre, la description complète, la catégorie, les tags, l'image de couverture et le lien de vente externe. Plus votre fiche est détaillée, plus elle sera mise en avant.",
  },
  {
    n: "4",
    title: "Attendre la validation (24–72 h)",
    desc: "Notre équipe examine chaque soumission manuellement pour garantir la qualité du catalogue. Nous vérifions que le lien est fonctionnel, que la description est exacte et que le produit correspond à la catégorie choisie. Vous recevrez un email à la validation.",
  },
  {
    n: "5",
    title: "Suivre vos statistiques",
    desc: "Une fois votre produit en ligne, consultez l'onglet « Statistiques » de votre dashboard pour voir le nombre de vues, de clics et la provenance du trafic. Ces données vous aident à optimiser vos fiches et à identifier les catégories les plus performantes.",
  },
];

const BEST_PRACTICES = [
  {
    title: "Un titre accrocheur",
    desc: "Votre titre doit communiquer le bénéfice principal en moins de 60 caractères. Privilégiez un angle résultat (« Gagnez X en faisant Y ») plutôt qu'une simple description du contenu.",
  },
  {
    title: "Une description détaillée",
    desc: "Décrivez ce que le produit contient, pour qui il est fait et ce que l'acheteur va pouvoir faire après l'avoir utilisé. Les fiches de plus de 150 mots génèrent en moyenne 3× plus de clics.",
  },
  {
    title: "Une bonne image de couverture",
    desc: "Utilisez une image au format 16:9 (1200×675 px recommandé), à fond clair ou sombre contrasté. Évitez les captures d'écran floues. Une belle couverture est le premier facteur de clic dans le catalogue.",
  },
  {
    title: "Des tags pertinents",
    desc: "Ajoutez entre 3 et 8 tags qui reflètent vraiment le contenu. L'assistant IA les utilise pour recommander vos produits aux visiteurs qui posent des questions correspondantes.",
  },
];

const FAQS = [
  {
    q: "Mon produit peut-il être en plusieurs langues ?",
    a: "Oui. Nuvora est ouvert à tous les créateurs, quelle que soit la langue du produit. Vous pouvez indiquer la langue lors du référencement — un filtre dédié permet aux visiteurs de filtrer par langue dans le catalogue.",
  },
  {
    q: "Puis-je référencer plusieurs produits ?",
    a: "Oui, sans limite. Vous pouvez référencer autant de produits que vous souhaitez. Chaque fiche est examinée individuellement. Nous recommandons de ne pas en soumettre plus de 5 en même temps pour accélérer la validation.",
  },
  {
    q: "Que se passe-t-il si mon lien de vente change ?",
    a: "Depuis votre dashboard, vous pouvez modifier le lien à tout moment. La modification est effective immédiatement. Aucune nouvelle validation n'est nécessaire pour un simple changement de lien.",
  },
  {
    q: "Comment être mis en avant dans le catalogue ?",
    a: "Les fiches les plus complètes (image, description longue, tags pertinents, profil vérifié) sont favorisées algorithmiquement. Chaque critère de complétion améliore directement votre position dans le catalogue.",
  },
];

export default function GuideCreateurPage() {
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
            Pour les créateurs
          </div>

          <h1 className="mt-6 text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.06]">
            Le guide complet
            <br />
            <span className="text-accent">pour être découvert sur Nuvora</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-fg-2">
            Tout ce que vous devez savoir pour référencer vos produits, toucher des acheteurs qualifiés et maximiser votre visibilité dans l'annuaire.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/inscription" size="lg">
              Créer mon compte
              <ArrowUpRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/catalogue" variant="secondary" size="lg">
              Voir le catalogue
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ─── AVANT DE COMMENCER ─── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Avant de commencer
          </h2>
          <p className="mt-2 text-fg-2">
            Assurez-vous de réunir ces 3 conditions avant de soumettre votre premier produit.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PREREQUISITES.map((p) => (
            <div
              key={p.title}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                  aria-hidden="true"
                >
                  {p.icon}
                </svg>
              </span>
              <div>
                <h3 className="font-bold">{p.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-fg-2">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LES ÉTAPES ─── */}
      <section className="bg-surface-2/60">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Les étapes pour référencer votre produit
            </h2>
            <p className="mt-2 text-fg-2">
              Suivez ce guide pas à pas pour être visible dans le catalogue dès aujourd&apos;hui.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-6">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="flex gap-5 rounded-2xl border border-border bg-surface p-6 shadow-soft"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent font-bold text-accent-fg text-sm">
                  {step.n}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-fg-2">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BONNES PRATIQUES ─── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Bonnes pratiques
          </h2>
          <p className="mt-2 text-fg-2">
            Les créateurs qui appliquent ces conseils multiplient leur visibilité dans le catalogue.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {BEST_PRACTICES.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                Conseil
              </div>
              <h3 className="font-bold">{tip.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-fg-2">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <Faqs FAQS={FAQS} />

      {/* ─── CTA FINAL ─── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
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
              Prêt à référencer votre produit&nbsp;?
            </h2>
            <p className="mt-3 text-white/80">
              Créez votre compte gratuitement et soumettez votre premier produit en moins de 5 minutes.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/inscription"
                variant="secondary"
                size="lg"
                className="border-white/70! bg-transparent! text-white! hover:bg-white/10!"
              >
                Créer mon compte gratuitement
                <ArrowUpRight className="size-4" />
              </ButtonLink>
              <Link
                href="/createur"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                Pourquoi choisir Nuvora&nbsp;?
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
