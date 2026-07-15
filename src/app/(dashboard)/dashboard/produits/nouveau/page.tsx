import type { Metadata } from "next";
import { NewProductForm } from "./form";

export const metadata: Metadata = {
  title: "Nouveau produit — Dashboard Nuvora",
  robots: { index: false, follow: false },
};

export default function NouveauProduitPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Référencer un produit</h1>
        <p className="mt-1 text-sm text-muted">
          Remplissez les informations ci-dessous. Notre équipe validera votre fiche sous 24 à 72 h.
        </p>
      </div>
      <NewProductForm />
    </div>
  );
}
