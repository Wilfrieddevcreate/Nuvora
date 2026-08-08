import type { DbProduct } from "@/components/product-card";

export function mapDbProduct(p: any): DbProduct {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category as DbProduct["category"],
    subCategory: p.subCategory ?? "",
    tags: (() => { try { return JSON.parse(p.tags ?? "[]") as string[]; } catch { return []; } })(),
    price: p.price,
    isFree: p.isFree,
    language: p.language,
    platform: p.platform,
    views: p.views,
    clicks: p.clicks,
    createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
    coverImage: p.coverImage ?? undefined,
    creatorName: p.creator?.user?.name ?? p.creatorName ?? "",
    creatorSlug: p.creator?.slug ?? p.creatorSlug ?? "",
    creatorVerified: p.creator?.verified ?? p.creatorVerified,
  };
}
