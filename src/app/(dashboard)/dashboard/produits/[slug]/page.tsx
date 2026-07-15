import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
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
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Modifier le produit</h1>
        <p className="mt-1 text-sm text-muted">
          Les modifications seront soumises pour validation avant d&apos;être publiées.
        </p>
      </div>
      <EditProductForm product={product} />
    </div>
  );
}
