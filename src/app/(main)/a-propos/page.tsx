import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "À propos de Nuvora",
  description:
    "Nuvora est une vitrine de découverte de produits digitaux — ebooks, formations, templates et logiciels créés par des indépendants.",
  alternates: { canonical: "https://nuvora.app/a-propos" },
  openGraph: {
    title: "À propos de Nuvora — Notre mission",
    description: "Nuvora est une vitrine de découverte de produits digitaux indépendants. Aucune commission, validation manuelle, avis vérifiés.",
    url: "https://nuvora.app/a-propos",
    type: "website",
  },
};

const VALUES = [
  {
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    title: "Transparence",
    desc: "0 % de commission, aucun frais caché. Le créateur garde 100 % de ses revenus — nous ne touchons pas à votre argent.",
  },
  {
    icon: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5Z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </>
    ),
    title: "Qualité",
    desc: "Chaque produit est validé manuellement par notre équipe avant publication. Pas d'algorithme, pas de spam : que du bon.",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </>
    ),
    title: "Indépendance",
    desc: "Nous mettons en avant les créateurs solo et les petites équipes. Nuvora existe pour rééquilibrer la visibilité face aux grandes plateformes.",
  },
];

const TEAM = [
  { initials: "WH", color: "#4f46e5", name: "Wilfried H.", role: "Fondateur & Dev" },
  { initials: "LM", color: "#0ea5e9", name: "Léa M.", role: "Design & UX" },
  { initials: "KB", color: "#10b981", name: "Karim B.", role: "Contenu & Curation" },
];

export default function AProposPage() {
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
            Notre mission
          </div>

          <h1 className="mt-6 text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.06]">
            Aider les créateurs indépendants
            <br />
            <span className="text-accent">à être découverts.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-fg-2">
            Nuvora est une vitrine de découverte — pas une marketplace avec commissions.
            Chaque produit est créé par un indépendant, vérifié par notre équipe, et
            accessible directement sur la plateforme du créateur.
          </p>
        </div>
      </section>

      {/* ─── NOTRE HISTOIRE ─── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Notre histoire</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-fg-2">
              Nuvora est née en 2024 d&apos;un constat simple : les créateurs indépendants
              produisent des ressources de grande qualité — ebooks approfondis, formations
              soignées, templates efficaces — mais restent invisibles face aux grandes
              plateformes qui captent l&apos;essentiel du trafic et imposent des commissions
              élevées.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-2">
              Nous avons voulu créer l&apos;espace qui manquait : une vitrine dédiée aux
              produits digitaux indépendants, où chaque fiche est soignée, vérifiée et mise
              en valeur. L&apos;acheteur est redirigé directement vers la plateforme du
              créateur — pas de friction, pas de commission cachée.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-2">
              Notre objectif est simple : permettre à n&apos;importe quel créateur sérieux,
              qu&apos;il ait 200 abonnés ou 20&nbsp;000, d&apos;être découvert par les bonnes
              personnes au bon moment. Pas besoin d&apos;un gros budget marketing — juste un
              bon produit et une fiche bien faite.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft lg:sticky lg:top-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              En quelques mots
            </p>
            <ul className="mt-6 space-y-4">
              {[
                { label: "Fondée en", value: "2024" },
                { label: "Modèle", value: "Vitrine de découverte, 0 % de commission" },
                { label: "Produits", value: "Ebooks, formations, templates, logiciels" },
                { label: "Validation", value: "Manuelle, par notre équipe" },
                { label: "Accès", value: "Gratuit pour les créateurs et les acheteurs" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-[15px] text-fg-2">
                    <span className="font-semibold text-fg">{item.label} — </span>
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── NOS VALEURS ─── */}
      <section className="bg-surface-2/60">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Nos valeurs</h2>
            <p className="mt-2 text-fg-2">
              Trois principes qui guident chaque décision que nous prenons.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
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
                    {v.icon}
                  </svg>
                </span>
                <div>
                  <h3 className="font-bold">{v.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-fg-2">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POUR LES ACHETEURS ─── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft order-last lg:order-first">
            <ul className="space-y-5">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  ),
                  title: "Chaque produit est vérifié à la main",
                  desc: "Notre équipe passe en revue chaque fiche avant publication — contenu, prix, plateforme. Vous ne trouverez ici aucun produit bâclé ou trompeur.",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ),
                  title: "Des avis d'acheteurs vérifiés",
                  desc: "Les notes et commentaires sur Nuvora proviennent uniquement de personnes ayant réellement acheté le produit. Aucun faux avis, aucun témoignage payé.",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  ),
                  title: "Prix clairs, aucun frais surprise",
                  desc: "Le prix affiché est le prix réel. Vous êtes redirigé directement vers la plateforme du créateur — Nuvora ne touche pas à votre paiement.",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  ),
                  title: "Trouvez exactement ce que vous cherchez",
                  desc: "Filtrez par catégorie, langue, plateforme ou prix. Notre assistant IA peut aussi vous guider vers le produit qui correspond à votre niveau et vos objectifs.",
                },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-fg">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-fg-2">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              Pour les acheteurs
            </span>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              Achetez en confiance,
              <br />
              <span className="text-accent">pas au hasard.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-fg-2">
              Trouver un bon produit digital ne devrait pas ressembler à un jeu de loterie. Trop souvent, on achète une formation ou un ebook sur la foi d'une landing page soignée — pour se retrouver déçu une fois dedans.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-2">
              Nuvora existe pour changer ça. Chaque produit que vous voyez sur la plateforme a été examiné par un humain, noté par de vrais acheteurs, et décrit honnêtement. Vous n'achetez pas dans le noir.
            </p>
            <Link
              href="/catalogue"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-fg transition-colors hover:bg-accent-hover"
            >
              Explorer le catalogue
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LES CHIFFRES ─── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-border px-5 sm:grid-cols-4 sm:px-8">
          {[
            { value: "9", label: "produits référencés" },
            { value: "7", label: "créateurs vérifiés" },
            { value: "4", label: "plateformes supportées" },
            { value: "0 %", label: "de commission" },
          ].map((s) => (
            <div key={s.label} className="py-8 text-center sm:py-10">
              <p className="text-2xl font-extrabold text-accent sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── L'ÉQUIPE ─── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">L&apos;équipe</h2>
          <p className="mt-2 text-fg-2">
            Une petite équipe soudée, convaincue que les meilleurs produits méritent d&apos;être vus.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center shadow-soft"
            >
              <span
                className="grid size-16 place-items-center rounded-2xl text-xl font-extrabold text-white"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </span>
              <div>
                <p className="font-bold">{member.name}</p>
                <p className="mt-0.5 text-sm text-muted">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="bg-surface-2/60">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Acheteurs */}
            <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-8 shadow-soft">
              <span className="inline-block w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                Vous achetez ?
              </span>
              <h3 className="text-xl font-extrabold text-fg">
                Des milliers de produits vérifiés vous attendent.
              </h3>
              <p className="text-[15px] text-fg-2">
                Formations, ebooks, templates — filtrés par notre équipe, notés par de vrais acheteurs. Aucune mauvaise surprise.
              </p>
              <Link
                href="/catalogue"
                className="mt-auto inline-flex items-center gap-2 self-start rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-fg transition-colors hover:bg-accent-hover"
              >
                Explorer le catalogue
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
              </Link>
            </div>

            {/* Créateurs */}
            <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-8 shadow-soft">
              <span className="inline-block w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                Vous créez ?
              </span>
              <h3 className="text-xl font-extrabold text-fg">
                Soyez découvert par les bonnes personnes.
              </h3>
              <p className="text-[15px] text-fg-2">
                Inscription gratuite, zéro commission. Votre produit face à une audience qui cherche exactement ce que vous proposez.
              </p>
              <ButtonLink href="/createur" size="sm" className="mt-auto self-start">
                Devenir créateur
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
