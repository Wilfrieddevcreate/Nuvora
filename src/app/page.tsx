import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { CategoryChips } from "@/components/category-chips";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { getNewProducts, getPopularProducts } from "@/data/products";

export default function Home() {
  const nouveautes = getNewProducts(3);
  const populaires = getPopularProducts(6);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="border-b-2 border-line-strong">
        <div className="mx-auto grid max-w-[1200px] items-end gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.55fr_0.9fr] md:py-20">
          <div>
            <div className="mb-5 flex items-center gap-2.5 font-mono text-[12.5px] uppercase tracking-[0.14em] text-accent-ink">
              <span className="inline-block h-0.5 w-8 bg-accent" />
              Moteur intelligent · francophone
            </div>
            <h1 className="font-display text-[clamp(44px,8vw,96px)]">
              Le moteur des{" "}
              <span className="text-accent">produits digitaux</span>.
            </h1>
            <p className="mt-6 max-w-[46ch] text-[17px] text-ink-2">
              Un annuaire où les créateurs référencent leurs ebooks, formations
              et templates — déjà vendus sur Gumroad, Chariow ou Systeme.io. On
              aide à découvrir, on redirige vers l’achat. Jamais de paiement ici.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {[
              { n: "08", l: "Écrans du MVP" },
              { n: "03", l: "Rôles · acheteur / créateur / admin" },
              { n: "FR", l: "Cible francophone" },
            ].map((m) => (
              <div key={m.l} className="border-t-2 border-line-strong pt-2.5">
                <div className="font-display text-[40px] leading-none">
                  {m.n}
                </div>
                <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.06em] text-muted">
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- RECHERCHE ---------------- */}
      <section className="border-b-2 border-line-strong">
        <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8">
          <div className="max-w-[640px]">
            <h2 className="font-display text-[clamp(28px,4vw,42px)]">
              Trouvez le produit qu’il vous faut.
            </h2>
            <p className="mt-3 text-[15px] font-medium text-muted">
              Ebooks, formations, templates, logiciels — sélectionnés et classés
              pour vous.
            </p>
          </div>
          <div className="mt-6 max-w-[600px]">
            <SearchBar />
          </div>
          <div className="mt-6">
            <CategoryChips />
          </div>
        </div>
      </section>

      {/* ---------------- NOUVEAUTÉS ---------------- */}
      <section className="border-b-2 border-line-strong">
        <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(26px,3.6vw,38px)]">
              Nouveautés
            </h2>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.03em] text-accent-ink text-[13px] hover:text-accent"
            >
              Voir tout <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 border-l-2 border-t-2 border-line-strong sm:grid-cols-2 lg:grid-cols-3">
            {nouveautes.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-[auto_1fr] gap-3 border-2 border-accent bg-accent-wash p-4 text-[14px] text-accent-ink">
            <ArrowUpRight className="size-5" />
            <p>
              Le bouton d’achat redirige toujours vers la plateforme externe du
              créateur. Nuvora ne traite aucun paiement.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- POPULAIRES ---------------- */}
      <section className="border-b-2 border-line-strong">
        <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(26px,3.6vw,38px)]">
              Les plus populaires
            </h2>
            <span className="font-mono text-[12px] uppercase tracking-[0.04em] text-muted">
              Classé par vues
            </span>
          </div>
          <div className="grid grid-cols-1 border-l-2 border-t-2 border-line-strong sm:grid-cols-2 lg:grid-cols-3">
            {populaires.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
