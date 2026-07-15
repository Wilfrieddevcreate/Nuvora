import { SearchTabs } from "@/components/search-tabs";
import { HeroPreview } from "@/components/hero-preview";
import { CategoryTiles } from "@/components/category-tiles";
import { ProductCard } from "@/components/product-card";
import { Testimonials } from "@/components/testimonials";
import { AiTeaser } from "@/components/ai-teaser";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { getNewProducts, getPopularProducts } from "@/data/products";

const STEPS = [
  {
    n: "1",
    title: "Découvrez",
    desc: "Explorez le catalogue ou décrivez votre besoin à l’assistant IA. Nuvora sélectionne les meilleurs produits pour vous.",
  },
  {
    n: "2",
    title: "Comparez",
    desc: "Consultez les fiches, les avis et les créateurs vérifiés pour choisir en confiance, sans vous perdre.",
  },
  {
    n: "3",
    title: "Achetez ailleurs",
    desc: "On vous redirige vers la plateforme du créateur (Gumroad, Chariow, Systeme.io…) pour finaliser l’achat.",
  },
];

export default function Home() {
  const nouveautes = getNewProducts(4);
  const populaires = getPopularProducts(4);

  return (
    <>
      {/* ---------------- HERO — style Estatery : titre gauche, recherche à onglets, aperçu + témoignage à droite ---------------- */}
      <section className="relative overflow-hidden border-b border-border bg-accent-soft/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(60%_100%_at_20%_0%,var(--accent-soft),transparent)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Colonne texte */}
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-fg-2 sm:text-[13px]">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="truncate">Moteur de découverte de produits digitaux</span>
            </div>

            <h1 className="mt-6 text-[clamp(34px,5.2vw,54px)] font-extrabold leading-[1.06]">
              Le meilleur du digital,{" "}
              <span className="text-accent">trouvé pour vous.</span>
            </h1>

            <p className="mt-5 max-w-lg text-lg text-fg-2">
              Ebooks, formations, templates et logiciels,
              réunis au même endroit. Nuvora vous aide à choisir, puis vous
              redirige vers le créateur pour l’achat.
            </p>

            {/* Recherche à onglets (façon Rent/Buy/Sell) */}
            <div className="mt-8 max-w-lg">
              <SearchTabs />
            </div>

            {/* preuve de confiance — trois repères, même registre visuel */}
            <dl className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  value: "200+",
                  label: "produits référencés",
                  icon: (
                    <path d="M4 7h16M4 12h16M4 17h10" />
                  ),
                },
                {
                  value: "37",
                  label: "créateurs vérifiés",
                  icon: (
                    <>
                      <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
                      <path d="M9 12l2 2 4-4" />
                    </>
                  ),
                },
                {
                  value: "Sécurisé",
                  label: "achat chez le créateur",
                  icon: (
                    <>
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-start gap-2.5 rounded-2xl border border-border bg-surface/70 p-3.5 sm:p-4"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent">
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
                      {item.icon}
                    </svg>
                  </span>
                  <div>
                    <dt className="text-base font-extrabold leading-none tracking-tight sm:text-lg">
                      {item.value}
                    </dt>
                    <dd className="mt-1 text-xs text-muted sm:text-[13px]">
                      {item.label}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Colonne visuelle — aperçu produit + témoignage flottant */}
          <div className="hidden lg:block lg:pl-6">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ---------------- CATÉGORIES ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">Parcourir par catégorie</h2>
            <p className="mt-1 text-fg-2">Choisissez un type de produit pour commencer.</p>
          </div>
        </div>
        <CategoryTiles />
      </section>

      {/* ---------------- NOUVEAUTÉS ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold">Nouveautés</h2>
          <ButtonLink href="/catalogue" variant="ghost" size="sm">
            Voir tout
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nouveautes.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ---------------- TEASER ASSISTANT IA ---------------- */}
      <AiTeaser />

      {/* ---------------- POPULAIRES ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold">Les plus populaires</h2>
          <ButtonLink href="/catalogue" variant="ghost" size="sm">
            Voir tout
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {populaires.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ---------------- AVIS / PREUVE SOCIALE ---------------- */}
      <Testimonials />

      {/* ---------------- COMMENT ÇA MARCHE ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Comment ça marche
            </h2>
            <p className="mt-2 text-fg-2">
              Nuvora est un moteur de découverte, pas une boutique. On vous
              oriente, l’achat se fait toujours chez le créateur.
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-start">
                <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent font-bold">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-[15px] text-fg-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA CRÉATEUR ---------------- */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-accent px-8 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl"
          />
          <h2 className="mx-auto max-w-2xl text-2xl font-extrabold text-white sm:text-3xl">
            Vous êtes créateur ? Donnez de la visibilité à vos produits.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Référencez vos ebooks, formations ou templates gratuitement et
            touchez une audience qui cherche exactement ce que vous
            proposez.
          </p>
          <div className="mt-7 flex justify-center">
            <ButtonLink
              href="/inscription"
              variant="secondary"
              size="lg"
              className="border-white/70! bg-transparent! text-white! hover:bg-white/10!"
            >
              Référencer un produit
              <ArrowUpRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
