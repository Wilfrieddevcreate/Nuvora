import { SearchBar } from "@/components/search-bar";
import { HeroPreview } from "@/components/hero-preview";
import { CategoryTiles } from "@/components/category-tiles";
import { ProductCard } from "@/components/product-card";
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
      {/* ---------------- HERO — épuré, aligné à gauche, confiant ---------------- */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Colonne texte */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[13px] font-medium text-fg-2">
              <span className="size-1.5 rounded-full bg-accent" />
              Moteur de découverte francophone
            </div>

            <h1 className="mt-6 text-[clamp(34px,5.2vw,54px)] font-extrabold leading-[1.06]">
              Le meilleur du digital,{" "}
              <span className="text-accent">trouvé pour vous.</span>
            </h1>

            <p className="mt-5 max-w-lg text-lg text-fg-2">
              Ebooks, formations, templates et logiciels francophones,
              réunis au même endroit. Nuvora vous aide à choisir, puis vous
              redirige vers le créateur pour l’achat.
            </p>

            <div className="mt-8 max-w-lg">
              <SearchBar />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/catalogue" size="lg">
                Explorer le catalogue
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/inscription" variant="ghost" size="lg">
                Devenir créateur
              </ButtonLink>
            </div>

            {/* preuve de confiance discrète */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <span>
                <b className="font-bold text-fg">+200</b> produits référencés
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span>
                <b className="font-bold text-fg">37</b> créateurs vérifiés
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span>100&nbsp;% francophone</span>
            </div>
          </div>

          {/* Colonne visuelle — aperçu produit calme */}
          <div className="hidden lg:block">
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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {nouveautes.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ---------------- POPULAIRES ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold">Les plus populaires</h2>
          <ButtonLink href="/catalogue" variant="ghost" size="sm">
            Voir tout
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {populaires.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

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
          <h2 className="mx-auto max-w-2xl text-2xl font-extrabold text-accent-fg sm:text-3xl">
            Vous êtes créateur ? Donnez de la visibilité à vos produits.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-accent-fg/80">
            Référencez vos ebooks, formations ou templates gratuitement et
            touchez une audience francophone qui cherche exactement ce que vous
            proposez.
          </p>
          <div className="mt-7 flex justify-center">
            <ButtonLink
              href="/inscription"
              variant="secondary"
              size="lg"
              className="border-transparent !bg-white !text-accent hover:!bg-white/90"
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
