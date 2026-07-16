import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ProductCard, type DbProduct } from "@/components/product-card";

function mapProduct(p: {
  id: string; slug: string; title: string; category: string;
  subCategory: string | null; tags: string; price: number; isFree: boolean;
  language: string; platform: string; views: number; clicks: number;
  createdAt: Date;
  creator: { slug: string; verified: boolean; user: { name: string } };
}): DbProduct {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category as DbProduct["category"],
    subCategory: p.subCategory ?? "",
    tags: (() => { try { return JSON.parse(p.tags) as string[]; } catch { return []; } })(),
    price: p.price,
    isFree: p.isFree,
    language: p.language,
    platform: p.platform,
    views: p.views,
    clicks: p.clicks,
    createdAt: p.createdAt.toISOString(),
    creatorName: p.creator.user.name,
    creatorSlug: p.creator.slug,
    creatorVerified: p.creator.verified,
  };
}

export async function Recommendations() {
  const session = await getSession();
  if (!session?.userId) return null;

  // Les 5 dernières vues de l'utilisateur
  const recentViews = await db.recentView.findMany({
    where: { userId: session.userId },
    orderBy: { viewedAt: "desc" },
    take: 5,
    include: { product: { select: { category: true, subCategory: true, tags: true } } },
  });

  if (recentViews.length === 0) return null;

  // Score de chaque catégorie/sous-catégorie selon l'historique
  const catScore: Record<string, number> = {};
  const subCatScore: Record<string, number> = {};
  const seenIds = new Set(recentViews.map((v) => v.productId));

  recentViews.forEach(({ product }, i) => {
    const weight = recentViews.length - i; // vue la plus récente = poids le plus élevé
    catScore[product.category] = (catScore[product.category] ?? 0) + weight;
    if (product.subCategory) {
      subCatScore[product.subCategory] = (subCatScore[product.subCategory] ?? 0) + weight;
    }
  });

  const topCategory = Object.entries(catScore).sort((a, b) => b[1] - a[1])[0][0];
  const topSubCategory = Object.entries(subCatScore).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Chercher des produits dans la catégorie préférée, hors déjà vus
  const candidates = await db.product.findMany({
    where: {
      status: "active",
      category: topCategory,
      NOT: { id: { in: [...seenIds] } },
    },
    include: { creator: { select: { slug: true, verified: true, user: { select: { name: true } } } } },
    take: 20,
  });

  if (candidates.length === 0) return null;

  // Score par sous-catégorie + views comme tie-breaker
  const scored = candidates
    .map((p) => {
      let score = 0;
      if (topSubCategory && p.subCategory === topSubCategory) score += 2;
      score += p.views / 1000; // favorise légèrement les populaires
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ p }) => mapProduct(p));

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">Recommandés pour vous</h2>
          <p className="mt-1 text-sm text-muted">
            Basé sur vos {recentViews.length} dernière{recentViews.length > 1 ? "s" : ""} consultation{recentViews.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scored.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
