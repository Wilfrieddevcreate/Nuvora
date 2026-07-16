import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { NovaMark } from "@/components/logo";

export const metadata: Metadata = {
  title: "Vendre sur Nuvora — Donnez de la visibilité à vos produits digitaux",
  description:
    "Référencez vos ebooks, formations, templates et logiciels sur Nuvora gratuitement. Zéro commission. Touchez une audience qui cherche exactement ce que vous créez.",
  keywords: [
    "vendre produits digitaux",
    "référencer ebook",
    "créateur numérique",
    "marketplace créateurs",
    "vendre formation en ligne",
    "visibilité produit digital",
    "Gumroad Systeme.io Podia",
  ],
  openGraph: {
    title: "Vendre sur Nuvora — Donnez de la visibilité à vos produits digitaux",
    description:
      "Référencez vos ebooks, formations et templates gratuitement. Zéro commission, votre boutique reste chez vous.",
    url: "https://nuvora.app/createur",
    type: "website",
  },
  twitter: {
    title: "Vendre sur Nuvora — 0 % de commission",
    description:
      "Référencez vos produits digitaux gratuitement. Touchez une audience qualifiée sans payer de commission.",
  },
  alternates: { canonical: "https://nuvora.app/createur" },
};

const PLATFORMS = [
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
    name: "Chariow",
    desc: "Marketplace francophone",
    color: "#0ea5e9",
    letter: "C",
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
    desc: "On ne touche pas à vos revenus. L'acheteur est redirigé vers votre plateforme — 100 % de la vente vous revient.",
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
    desc: "Notre assistant analyse les besoins des visiteurs et recommande vos produits au bon moment — comme un vendeur qui ne dort jamais.",
  },
  {
    icon: (
      <>
        <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    title: "Badge créateur vérifié",
    desc: "Votre profil affiche un badge de confiance visible sur toutes vos fiches produit — un signal fort pour les acheteurs.",
  },
];

const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Créez votre compte",
    desc: "Inscrivez-vous en moins de 2 minutes. Renseignez votre profil créateur et ajoutez vos liens de vente existants.",
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
    a: "Sur votre propre plateforme (Gumroad, Systeme.io, etc.). Nuvora redirige l'acheteur vers votre lien — vous gardez 100 % du contrôle.",
  },
  {
    q: "Quel type de produits peut-on référencer ?",
    a: "Ebooks, formations vidéo, templates (Notion, Figma, Excel…), logiciels, presets, plugins, guides PDF — tout produit 100 % digital.",
  },
  {
    q: "Combien de temps pour être référencé ?",
    a: "Généralement 24 à 72 h après soumission. Nous vérifions chaque fiche manuellement pour garantir la qualité du catalogue.",
  },
];

export default function CreateurPage() {
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
            Pour les créateurs de produits digitaux
          </div>

          <h1 className="mt-6 text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.06]">
            Faites découvrir vos produits
            <br />
            <span className="text-accent">à ceux qui les cherchent.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-fg-2">
            Nuvora référence vos ebooks, formations et templates gratuitement.
            Vous gardez 100&nbsp;% de vos revenus — on s&apos;occupe de la visibilité.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/inscription" size="lg">
              Référencer mes produits
              <ArrowUpRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/catalogue" variant="secondary" size="lg">
              Voir le catalogue
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-border px-5 sm:grid-cols-4 sm:px-8">
          {[
            { value: "200+", label: "produits référencés" },
            { value: "37", label: "créateurs actifs" },
            { value: "0 %", label: "de commission Nuvora" },
            { value: "24 h", label: "délai de validation" },
          ].map((s) => (
            <div key={s.label} className="py-8 text-center sm:py-10">
              <p className="text-2xl font-extrabold text-accent sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── AVANTAGES ─── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Pourquoi choisir Nuvora ?
          </h2>
          <p className="mt-2 text-fg-2">
            Une vitrine de découverte pensée pour mettre vos produits devant les bonnes personnes.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex gap-5 rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
            >
              <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
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
                  {b.icon}
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="font-bold">{b.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-fg-2">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section className="bg-surface-2/60">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Référencez en 3 étapes
            </h2>
            <p className="mt-2 text-fg-2">
              Pas de technicité requise. Si vous avez déjà un produit en vente quelque part, c&apos;est suffisant.
            </p>
          </div>

          <div className="relative mt-12">
            {/* Ligne de connexion — desktop uniquement */}
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

          <div className="mt-12 flex justify-center">
            <ButtonLink href="/inscription" size="lg">
              Commencer gratuitement
              <ArrowUpRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ─── PLATEFORMES COMPATIBLES ─── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Compatible avec vos outils
          </h2>
          <p className="mt-2 text-fg-2">
            Vous vendez déjà sur une de ces plateformes ? Il vous suffit de nous donner le lien.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 text-center shadow-soft"
            >
              <span
                className="grid size-12 place-items-center rounded-xl font-extrabold text-white text-lg"
                style={{ backgroundColor: p.color }}
              >
                {p.letter}
              </span>
              <div>
                <p className="text-sm font-bold">{p.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Et toute autre plateforme avec un lien de vente public.
        </p>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-surface-2/60">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Questions fréquentes
          </h2>

          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface shadow-soft overflow-hidden">
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
        </div>
      </section>

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
