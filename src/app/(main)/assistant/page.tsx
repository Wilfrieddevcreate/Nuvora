import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AssistantChat } from "@/components/assistant-chat";
import type { DbProduct } from "@/components/product-card";

export const metadata: Metadata = {
  title: "Assistant IA — Trouvez le produit digital qu'il vous faut",
  description:
    "Décrivez votre besoin en langage naturel : l'assistant Nuvora analyse les produits disponibles et vous recommande les mieux adaptés à votre situation.",
  keywords: [
    "assistant IA produits digitaux",
    "recommandation produit",
    "aide au choix ebook",
    "formation recommandée",
    "intelligence artificielle marketplace",
  ],
  openGraph: {
    title: "Assistant IA Nuvora — Trouvez le produit digital qu'il vous faut",
    description:
      "Décrivez votre besoin : l'assistant Nuvora vous recommande les meilleurs ebooks, formations et templates.",
    url: "https://nuvora.app/assistant",
    type: "website",
  },
  twitter: {
    title: "Assistant IA Nuvora",
    description:
      "Décrivez votre besoin, l'assistant vous recommande les meilleurs produits digitaux.",
  },
  alternates: { canonical: "https://nuvora.app/assistant" },
};

export default async function AssistantPage() {
  const rows = await db.product.findMany({
    where: { status: "active" },
    orderBy: { views: "desc" },
    include: {
      creator: { select: { slug: true, verified: true, user: { select: { name: true } } } },
    },
  });

  const products: DbProduct[] = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category as DbProduct["category"],
    subCategory: p.subCategory ?? "",
    tags: JSON.parse(p.tags ?? "[]") as string[],
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
  }));

  return <AssistantChat products={products} />;
}
