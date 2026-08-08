import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { NovaMark } from "@/components/logo";
import Faqs from "@/components/faqs";
import { CreatorHero } from "@/components/creator-hero";
import { CreatorStats } from "@/components/creator-stats";
import { CreatorBenefits } from "@/components/creator-benefits";
import { CreatorHowItWorks } from "@/components/creator-how-its-work";
import PlatformsMarquee from "@/components/platforms-marquee";

export const metadata: Metadata = {
  title: "Référencez vos produits digitaux gratuitement",
  description:
    "Référencez vos ebooks, formations et logiciels gratuitement. Zéro commission. Touchez une audience qui cherche exactement ce que vous créez.",
  keywords: [
    "référencer produits digitaux",
    "référencer ebook",
    "créateur numérique",
    "annuaire créateurs indépendants",
    "référencer formation en ligne",
    "visibilité produit digital",
    "Gumroad Systeme.io Podia",
  ],
  openGraph: {
    title: "Référencez vos produits digitaux gratuitement | Nuvora",
    description:
      "Référencez vos ebooks, formations et templates gratuitement. Zéro commission, vos ventes restent sur votre plateforme.",
    url: "https://nuvora.app/createur",
    type: "website",
  },
  twitter: {
    title: "Référencez gratuitement, 0 % de commission Nuvora",
    description:
      "Référencez vos produits digitaux gratuitement. Touchez une audience qualifiée sans payer de commission.",
  },
  alternates: { canonical: "https://nuvora.app/createur" },
};

const PLATFORMS = [
  {
    name: "Chariow",
    desc: "Marketplace francophone",
    color: "#ca8a04",
    letter: "C",
  },
  {
    name: "Gumroad",
    desc: "Vente directe, simple et rapide",
    color: "#ff90e8",
    letter: "G",
  },
  {
    name: "Systeme.io",
    desc: "Tunnels, formations, affiliés",
    color: "#4f46e5",
    letter: "S",
  },
  {
    name: "Podia",
    desc: "Cours en ligne & memberships",
    color: "#f97316",
    letter: "P",
  },
  {
    name: "Lemon Squeezy",
    desc: "SaaS, licences, abonnements",
    color: "#f59e0b",
    letter: "L",
  },
  {
    name: "Payhip",
    desc: "Ebooks, templates & bundles",
    color: "#10b981",
    letter: "P",
  },
];

const BENEFITS = [
  {
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </>
    ),
    title: "Zéro commission Nuvora",
    desc: "On ne touche pas à vos revenus. L'acheteur est redirigé vers votre plateforme. 100 % de la vente vous revient.",
  },
  {
    icon: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5Z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </>
    ),
    title: "Référencement gratuit",
    desc: "Soumettez vos produits sans frais. On vérifie, on enrichit la fiche, et on la met en avant auprès des bons visiteurs.",
  },
  {
    icon: (
      <>
        <path d="M12 3c-1.2 5.4-5.4 9.6-9 12 3.6 2.4 7.8 6.6 9 12 1.2-5.4 5.4-9.6 9-12-3.6-2.4-7.8-6.6-9-12Z" />
      </>
    ),
    title: "Assistant IA qui recommande",
    desc: "Notre assistant analyse les besoins des visiteurs et recommande vos produits au bon moment, disponible en permanence.",
  },
  {
    icon: (
      <>
        <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    title: "Badge créateur vérifié",
    desc: "Votre profil affiche un badge de confiance visible sur toutes vos fiches produit. Un signal fort pour les visiteurs.",
  },
];

const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Créez votre compte",
    desc: "Inscrivez-vous en moins de 2 minutes. Renseignez votre profil créateur et ajoutez les liens vers vos pages produit (Gumroad, Systeme.io, etc.).",
  },
  {
    n: "2",
    title: "Soumettez vos produits",
    desc: "Ajoutez le titre, la description, les captures et le lien d'achat. Notre équipe valide et enrichit chaque fiche.",
  },
  {
    n: "3",
    title: "Nuvora fait le reste",
    desc: "Vos produits apparaissent dans le catalogue, dans les recommandations IA et dans les newsletters thématiques.",
  },
];

const FAQS = [
  {
    q: "Est-ce vraiment gratuit ?",
    a: "Oui. Le référencement est gratuit et Nuvora ne prend aucune commission. Nous gagnons notre vie autrement (partenariats, premium à venir).",
  },
  {
    q: "Mes ventes se passent où ?",
    a: "Sur votre propre plateforme (Gumroad, Systeme.io, etc.). Nuvora redirige le visiteur vers votre lien. Vous gardez 100 % du contrôle.",
  },
  {
    q: "Quel type de produits peut-on référencer ?",
    a: "Ebooks, formations vidéo, templates (Notion, Figma, Excel…), logiciels, presets, plugins, guides PDF : tout produit 100 % digital.",
  },
  {
    q: "Combien de temps pour être référencé ?",
    a: "Généralement 8 à 12 h après soumission. Nous vérifions chaque fiche manuellement pour garantir la qualité du catalogue.",
  },
];

export default function CreateurPage() {
  return (
    <>
      {/* ─── HERO ─── */}
     <CreatorHero />

      {/* ─── STATS ─── */}
      <CreatorStats />

      {/* ─── AVANTAGES ─── */}
      <CreatorBenefits BENEFITS={BENEFITS} />

      {/* ─── COMMENT ÇA MARCHE ─── */}
     <CreatorHowItWorks HOW_IT_WORKS={HOW_IT_WORKS} />

      {/* ─── PLATEFORMES COMPATIBLES ─── */}
      <PlatformsMarquee PLATFORMS={PLATFORMS} />

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
            <div className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl bg-white/15">
              <NovaMark className="size-7 text-white" bg="transparent" />
            </div>

            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Prêt à toucher de nouveaux acheteurs ?
            </h2>
            <p className="mt-3 text-white/80">
              Rejoignez les créateurs qui utilisent Nuvora pour être découverts.
              Inscription gratuite, sans engagement.
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
                href="/catalogue"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                Voir comment se présentent les fiches
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
