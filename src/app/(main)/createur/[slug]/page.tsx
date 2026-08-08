import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { mapDbProduct } from "@/lib/product-mapper";
import { ProductCard, type DbProduct } from "@/components/product-card";

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-violet-500", "bg-rose-500", "bg-sky-500",
  "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-teal-500",
];

function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const creator = await db.creator.findUnique({
    where: { slug },
    include: { user: { select: { name: true } }, _count: { select: { products: { where: { status: "active" } } } } },
  });
  if (!creator) return { title: "Créateur introuvable" };
  const url = `https://nuvora.app/createur/${slug}`;
  const count = creator._count.products;
  return {
    title: `${creator.user.name}, créateur sur Nuvora`,
    description: `${creator.tagline ?? ""}. Découvrez les ${count} produit${count > 1 ? "s" : ""} digital${count > 1 ? "s" : ""} de ${creator.user.name} référencé${count > 1 ? "s" : ""} sur Nuvora.`,
    authors: [{ name: creator.user.name }],
    openGraph: { title: `${creator.user.name}, créateur sur Nuvora`, description: creator.bio ?? undefined, url, type: "profile" },
    twitter: { card: "summary", title: `${creator.user.name} sur Nuvora`, description: creator.tagline ?? undefined },
    alternates: { canonical: url },
  };
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const creator = await db.creator.findUnique({
    where: { slug },
    include: {
      user: { select: { name: true } },
      products: {
        where: { status: "active" },
        orderBy: { views: "desc" },
      },
    },
  });
  if (!creator) notFound();

  const products: DbProduct[] = creator.products.map((p) => {
    const mapped = mapDbProduct(p);
    return { ...mapped, creatorName: creator.user.name, creatorSlug: creator.slug };
  });

  const totalViews = products.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const totalClicks = products.reduce((sum, p) => sum + (p.clicks ?? 0), 0);
  const joinedYear = new Date(creator.createdAt).getFullYear();
  const color = avatarColor(creator.user.name);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <nav aria-label="Fil d'ariane" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-fg">Accueil</Link>
        <span>/</span>
        <Link href="/catalogue" className="hover:text-fg">Catalogue</Link>
        <span>/</span>
        <span aria-current="page" className="text-fg">{creator.user.name}</span>
      </nav>

      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
        <div className={`h-24 sm:h-32 ${color} opacity-20`} />

        <div className="px-6 pb-8 sm:px-8">
          <div className="flex flex-wrap items-end gap-4 -mt-8 sm:-mt-10">
            <span className={`grid size-16 shrink-0 place-items-center rounded-2xl ${color} text-2xl font-extrabold text-white shadow-soft ring-4 ring-surface sm:size-20 sm:text-3xl`}>
              {creator.user.name.charAt(0).toUpperCase()}
            </span>

            <div className="mb-1 flex flex-wrap items-center gap-2">
              {creator.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Créateur vérifié
                </span>
              )}
              {creator.specialty && (
                <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                  {creator.specialty}
                </span>
              )}
              <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                Sur Nuvora depuis {joinedYear}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-2xl font-extrabold sm:text-3xl">{creator.user.name}</h1>
            {creator.tagline && <p className="mt-1 font-medium text-accent">{creator.tagline}</p>}
            {creator.bio && (
              <div
                className="mt-4 max-w-2xl leading-relaxed text-fg-2 prose prose-sm"
                dangerouslySetInnerHTML={{ __html: creator.bio }}
              />
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-6 border-t border-border pt-6">
            <div>
              <p className="text-xl font-extrabold">{products.length}</p>
              <p className="text-sm text-muted">produit{products.length > 1 ? "s" : ""} référencé{products.length > 1 ? "s" : ""}</p>
            </div>
            <div>
              <p className="text-xl font-extrabold">{totalViews.toLocaleString("fr-FR")}</p>
              <p className="text-sm text-muted">vues cumulées</p>
            </div>
            <div>
              <p className="text-xl font-extrabold">{totalClicks.toLocaleString("fr-FR")}</p>
              <p className="text-sm text-muted">clics sortants</p>
            </div>
            {creator.platform && (
              <div>
                <p className="text-xl font-extrabold">{creator.platform}</p>
                <p className="text-sm text-muted">plateforme de vente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">Produits de {creator.user.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/catalogue" className="text-sm font-medium text-accent hover:text-accent-hover">
            Voir tout le catalogue →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center text-muted">
            Aucun produit référencé pour le moment.
          </div>
        )}
      </section>

      <div className="mt-14 rounded-3xl border border-border bg-surface-2/60 px-8 py-10 text-center">
        <p className="text-lg font-bold">Vous êtes créateur ?</p>
        <p className="mt-2 text-fg-2">Référencez vos produits gratuitement et touchez une audience qualifiée.</p>
        <Link href="/createur" className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover">
          En savoir plus
        </Link>
      </div>
    </div>
  );
}
