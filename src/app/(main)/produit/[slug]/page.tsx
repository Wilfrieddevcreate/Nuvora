import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { mapDbProduct } from "@/lib/product-mapper";
import { ProductCard, type DbProduct } from "@/components/product-card";
import { ProductReviews } from "@/components/product-reviews";
import { ArrowUpRight } from "@/components/icons";
import { trackProductView } from "@/app/actions/products";
import { ProductPurchaseButton } from "@/components/product-purchase-button";

const CATEGORY_SLUG: Record<string, string> = {
  Formation: "formation",
  Ebook: "ebook",
  Template: "template",
  Logiciel: "logiciel",
};

const COVER: Record<string, string> = {
  Formation: "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

function formatPrice(price: number, isFree: boolean): string {
  return isFree || price === 0 ? "Gratuit" : `${price} €`;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug, status: "active" },
    include: { creator: { include: { user: { select: { name: true } } } } },
  });
  if (!product) return { title: "Produit introuvable" };
  const url = `https://nuvora.app/produit/${product.slug}`;
  const tags = JSON.parse(product.tags ?? "[]") as string[];
  return {
    title: product.title,
    description: product.description,
    keywords: [product.category, product.subCategory ?? "", product.creator.user.name, ...tags, "produit digital", product.platform],
    authors: [{ name: product.creator.user.name }],
    openGraph: { title: `${product.title} — Nuvora`, description: product.description, url, type: "article" },
    twitter: { card: "summary_large_image", title: product.title, description: product.description },
    alternates: { canonical: url },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, status: "active" },
    include: {
      creator: {
        include: { user: { select: { name: true } } },
      },
    },
  });
  if (!product) notFound();

  // Track view asynchronously (non-blocking)
  const headersList = await headers();
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown";
  const userAgent = headersList.get("user-agent") || undefined;
  trackProductView(product.id, { ipAddress, userAgent }).catch(() => {});

  const tags = JSON.parse(product.tags ?? "[]") as string[];
  const isNew = (Date.now() - new Date(product.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000;

  const relatedRaw = await db.product.findMany({
    where: {
      status: "active",
      category: product.category,
      NOT: { id: product.id },
    },
    include: { creator: { select: { slug: true, verified: true, user: { select: { name: true } } } } },
    orderBy: { views: "desc" },
    take: 3,
  });

  const related: DbProduct[] = relatedRaw.map(mapDbProduct);

  const cover = COVER[product.category] ?? "from-surface-2 to-surface";

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <nav aria-label="Fil d'ariane" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/catalogue" className="hover:text-fg">Catalogue</Link>
        <span>/</span>
        <Link href={`/catalogue/${CATEGORY_SLUG[product.category] ?? product.category.toLowerCase()}`} className="hover:text-fg">
          {product.category}
        </Link>
        <span>/</span>
        <span aria-current="page" className="truncate text-fg">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className={`flex aspect-16/10 items-center justify-center rounded-3xl border border-border bg-linear-to-br ${cover}`}>
            <span className="text-7xl font-extrabold text-fg/15">{product.title.charAt(0)}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {isNew && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg">Nouveau</span>
            )}
            {product.creator.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-fg-2">
                <svg viewBox="0 0 24 24" className="size-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                Créateur vérifié
              </span>
            )}
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
              {product.language}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{product.title}</h1>
          <div className="mt-2 text-fg-2">
            {product.category}{product.subCategory ? ` · ${product.subCategory}` : ""} · par{" "}
            <Link href={`/createur/${product.creator.slug}`} className="font-semibold text-fg hover:text-accent">
              {product.creator.user.name}
            </Link>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold">Description</h2>
            <div
              className="mt-3 leading-relaxed text-fg-2 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {tags.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold">Tags</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-2 px-3 py-1 text-sm text-fg-2">{t}</span>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/createur/${product.creator.slug}`}
            className="mt-8 flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-2 hover:shadow-soft"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-base font-bold text-accent-fg">
              {product.creator.user.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">{product.creator.user.name}</span>
                {product.creator.verified && <span className="text-xs font-medium text-accent">✓ Vérifié</span>}
              </div>
              <p className="text-sm text-muted">Créateur sur {product.platform}</p>
            </div>
            <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          </Link>
        </div>

        <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-extrabold">{formatPrice(product.price, product.isFree)}</span>
            </div>

            <ProductPurchaseButton productId={product.id} purchaseUrl={product.purchaseUrl} />
            <p className="mt-3 text-center text-xs text-muted">
              Vous serez redirigé vers <span className="font-semibold text-fg-2">{product.platform}</span> pour finaliser l&apos;achat.
            </p>

            <dl className="mt-6 divide-y divide-border border-t border-border">
              <InfoRow
                label="Créateur"
                value={
                  <Link href={`/createur/${product.creator.slug}`} className="text-accent hover:text-accent-hover">
                    {product.creator.user.name}
                  </Link>
                }
              />
              <InfoRow label="Catégorie" value={`${product.category}${product.subCategory ? ` · ${product.subCategory}` : ""}`} />
              <InfoRow label="Plateforme" value={product.platform} />
              <InfoRow label="Langue" value={product.language} />
              <InfoRow label="Popularité" value={`${product.views.toLocaleString("fr-FR")} vues`} />
            </dl>
          </div>

          <p className="mt-4 px-2 text-center text-xs text-muted">
            Nuvora ne traite aucun paiement. L&apos;achat se fait directement chez le créateur.
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="mb-6 text-2xl font-extrabold">Produits similaires</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}

      <ProductReviews slug={product.slug} />
    </div>
  );
}
