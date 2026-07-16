import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { db } from "@/lib/db";
import { EditProductForm } from "./form";

export const metadata: Metadata = {
  title: "Modifier un produit — Dashboard Nuvora",
  robots: { index: false, follow: false },
};

export default async function EditProduitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await verifySession();

  const product = await db.product.findFirst({
    where: {
      slug,
      creator: { userId: session.userId },
    },
  });

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Modifier le produit</h1>
        <p className="mt-1 text-sm text-muted">
          Les modifications repasseront en validation avant d&apos;être publiées.
        </p>
      </div>
      <EditProductForm
        productId={product.id}
        initialSlug={product.slug}
        initialTitle={product.title}
        initialDescription={product.description}
        initialCategory={product.category}
        initialSubCategory={product.subCategory ?? ""}
        initialTags={JSON.parse(product.tags ?? "[]")}
        initialPrice={product.price}
        initialIsFree={product.isFree}
        initialLanguage={product.language}
        initialCountry={product.country ?? ""}
        initialPlatform={product.platform}
        initialPurchaseUrl={product.purchaseUrl}
      />
    </div>
  );
}
