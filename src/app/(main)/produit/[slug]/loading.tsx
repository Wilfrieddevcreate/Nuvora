export default function ProduitLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Fil d'ariane skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-1 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-20 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-1 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-36 animate-pulse rounded bg-surface-2" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Colonne gauche */}
        <div>
          {/* Image cover */}
          <div className="aspect-16/10 animate-pulse rounded-3xl bg-surface-2" />

          {/* Badges */}
          <div className="mt-5 flex flex-wrap gap-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-surface-2" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-surface-2" />
            <div className="h-6 w-12 animate-pulse rounded-full bg-surface-2" />
          </div>

          {/* Titre */}
          <div className="mt-4 space-y-2">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-surface-2" />
            <div className="h-8 w-1/2 animate-pulse rounded-lg bg-surface-2" />
          </div>

          {/* Sous-titre créateur */}
          <div className="mt-2 h-5 w-56 animate-pulse rounded bg-surface-2" />

          {/* Description */}
          <div className="mt-8 space-y-2">
            <div className="h-5 w-24 animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-3/5 animate-pulse rounded bg-surface-2" />
          </div>

          {/* Tags */}
          <div className="mt-8 space-y-3">
            <div className="h-5 w-12 animate-pulse rounded bg-surface-2" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-16 animate-pulse rounded-full bg-surface-2"
                  style={{ width: `${48 + i * 12}px` }}
                />
              ))}
            </div>
          </div>

          {/* Card créateur */}
          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
            <div className="size-12 shrink-0 animate-pulse rounded-full bg-surface-2" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-surface-2" />
              <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
            </div>
            <div className="size-4 animate-pulse rounded bg-surface-2" />
          </div>
        </div>

        {/* Colonne droite : carte d'achat */}
        <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-end justify-between">
              <div className="h-10 w-28 animate-pulse rounded-lg bg-surface-2" />
              <div className="h-4 w-8 animate-pulse rounded bg-surface-2" />
            </div>

            {/* Bouton acheter */}
            <div className="mt-5 h-12 w-full animate-pulse rounded-full bg-surface-2" />
            <div className="mx-auto mt-3 h-3 w-48 animate-pulse rounded bg-surface-2" />

            {/* Infos */}
            <div className="mt-6 space-y-3 border-t border-border pt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Produits similaires */}
      <div className="mt-16 border-t border-border pt-12">
        <div className="mb-6 h-7 w-44 animate-pulse rounded-lg bg-surface-2" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="aspect-4/3 animate-pulse rounded-xl bg-surface-2" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
                <div className="h-5 w-16 animate-pulse rounded bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
