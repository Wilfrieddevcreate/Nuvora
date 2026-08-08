import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ButtonLink } from "@/components/ui/button";
import { ArrowUpRight } from "@/components/icons";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Créateurs vérifiés",
  description: "Découvrez tous les créateurs vérifiés de Nuvora — des experts indépendants dans leurs domaines respectifs.",
};

export default async function VerifiedCreatorsPage() {
  const creators = await db.creator.findMany({
    where: { verified: true },
    include: { user: { select: { name: true } }, _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  const colors = ["bg-indigo-500", "bg-violet-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500"];

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-fg mb-4">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Créateurs vérifiés</h1>
          <p className="mt-2 text-lg text-fg-2">
            {creators.length} experts indépendants, chacun dans son domaine.
          </p>
        </div>
      </div>

      {/* Grid */}
      {creators.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator, idx) => {
            const color = colors[idx % colors.length];
            return (
              <Link
                key={creator.id}
                href={`/createur/${creator.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-border-2 hover:shadow-soft-lg"
              >
                <span className={`mx-auto grid size-16 shrink-0 place-items-center rounded-xl ${color} text-2xl font-extrabold text-white`}>
                  {creator.user.name.charAt(0)}
                </span>
                <h2 className="mt-4 text-lg font-bold group-hover:text-accent">{creator.user.name}</h2>
                <p className="mt-1.5 text-sm text-fg-2 line-clamp-3 leading-relaxed">{creator.specialty || "Créateur"}</p>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted">
                  <span>{creator._count.products} produit{creator._count.products !== 1 ? "s" : ""}</span>
                </div>

                <span className="mt-4 inline-flex items-center gap-1 justify-center rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Vérifié
                </span>

                <div className="mt-auto pt-4">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all">
                    Voir le profil
                    <ArrowUpRight className="size-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="text-fg-2">Aucun créateur vérifié pour le moment.</p>
          <ButtonLink href="/inscription" variant="primary" size="md" className="mt-6">
            Devenir créateur
            <ArrowUpRight className="size-4" />
          </ButtonLink>
        </div>
      )}
    </main>
  );
}
